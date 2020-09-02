<template>
  <div>
    <!-- 面包屑导航
    
    separator: 分割符-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:void(0);">管理员管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-container">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <!-- 
        利用返回数据生成树状结构表格
      -->
      <el-table
        :data="data"
        style="width: 100%"
        row-key="id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!-- 

          prop : 关联的data 中的数据的名称
          label : 表头文字
          默认将 关联数据的文本作为内容项
          
        -->
        <!-- prop: 指定关联的data 数据的属性 -->
        <el-table-column prop="uid" label="用户编号" width="180"></el-table-column>
        <el-table-column prop="rolename" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名称" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <!-- 插槽插入  自定义内容 -->
          <template slot-scope="scope">
            <!-- scope.row ： 这一行的数据 -->
            <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status==2" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 点击编辑和删除按钮，做对应的操作，传入参数为这一行的数据 -->
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- current-change:当前页数发送变化触发，事件处理函数参数就是 当前的页数
            total：总条数

            page-size:每一页的数据
      -->
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="handlePageChange"
          
        ></el-pagination>
      </div>
      <!-- 弹出对话框：    -->
      <el-dialog :title="'菜单'+tip" :visible.sync="dialogVisible" width="50%">
        <el-form :model="ruleForm" :rules="rules" ref="f1" label-width="150px">
          <el-form-item label="角色名称" prop="pid">
            <!-- 选择框 :利用 角色列表每一个角色的id 作为 roleid -->
            <el-select v-model="ruleForm.roleid">
              <el-option
                v-for="item in role"
                :key="item.id"
                :label="item.rolename"
                :value="item.id.toString()"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username" label="用户名称">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <!-- 根据 type 决定 是否显示 -->
          <el-form-item prop="password" label="用户密码">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <!-- 切换时触发 changeStatus函数 -->
          <el-form-item label="状态">
            <el-switch
              v-model="status"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="changeStatus"
            ></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleReset">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 树形数据，后台获取
      data: [],
      //对话框是否显示
      dialogVisible: false,
      //对话框标题文本
      tip: "",
      ruleForm: {
        //角色id
        roleid: "",
        username: "",
        password: "",
        // 状态
        status: "1"
      },
      //   验证规则
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      //   切换状态
      status: true,
      //  翻页器总条数
      total: 0,
      //每一页的条数
      pageSize: 2,
      //角色列表
      role: [],
      //当前的页数
      page: 1
    };
  },
  mounted() {
    //   获取数据 数据渲染表格
    this.getCount();
  },
  methods: {
    //获取总条数
    getCount(){
        this.$http.get("/api/usercount").then(res => {
            if (res.code === 200) {
                this.total = res.list[0].total;  
                this.showlist();  
            } 
        });
    },
    //获取数据
    showlist() {  
      this.$http
            .get("/api/userlist", {
              params: {
                size: this.pageSize,
                page: this.page
              }
            })
            .then(res => {
              //   console.log(res);
              if (res.code == 200) {
                this.data = res.list;
              } else {
                this.$message({
                  type: "warn",
                  message: res.msg
                });
              }
            });
    },
    //  获取角色列表
    getRole() {
      this.$http.get("/api/rolelist").then(res => {
        // console.log(res);
        this.role = res.list;
      });
    },
    // 页码变化的代码
    handlePageChange(page) {
      // console.log(page)
      this.page = page;
      this.$http
        .get("/api/userlist", {
          params: {
            size: this.pageSize,
            page
          }
        })
        .then(res => {
          //   console.log(res);
          if (res.code == 200) {
            this.data = res.list;
          } else {
            this.$message({
              type: "warn",
              message: res.msg
            });
          }
        });
    },
    // 切换状态
    changeStatus(val) {
      // 根据 切换的 boolean 决定状态
      this.ruleForm.status = val ? "1" : "2";
    },
    // 修改函数
    handleEdit(row) {
      // 获取菜单
      this.getRole();
      this.tip = "修改";
      // 显示对话框
      this.dialogVisible = true;
      // get 请求以对象的形式传入参数，必须是在params 属性中
      this.$http
        .get("/api/userinfo", {
          params: {
            uid: row.uid
          }
        })
        .then(res => {
          console.log(res);
          let info = res.list;
          this.status = info.status=="1"?true:false;
          this.ruleForm = info;
          this.ruleForm.roleid = row.roleid.toString();
          // 点击修改弹出对话框，向 ruleform 添加 id 属性
          this.ruleForm.id = row.id;
        });
    },
    // 删除函数
    handleDelete(row) {
      //根据id 删除数据
      this.$http.post("/api/userdelete", { id: row.id }).then(res => {
          console.log(res)
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
            // 本页唯一数据被删页码建议
          if (res.list.length % this.pageSize == 0) {
            this.page--;
          }
           // 删除成功获取最新的用户列表来渲染  
            this.$http.get("/api/usercount").then(res => {
                if (res.code === 200) {
                    this.total = res.list[0].total; 
                    this.showlist();  
                } 
            });
        } else {
          this.$message({
            type: "warn",
            message: res.msg
          });
        }
      });
    },
    // 添加函数
    handleAdd() {
      // 获取菜单
      this.getRole();
      // 对话框标题修改
      this.tip = "添加";
      // 显示对话框
      this.dialogVisible = true;
    },
    // 点击取消还原 表单数据
    handleReset() {
      this.dialogVisible = false;
      this.ruleForm = {
        roleid: "",
        username: "",
        password: "",
        status: "1"
      };
    },
    // 提交操作
    handleSubmit() {
      this.dialogVisible = false;
      // 通过是否具有id 来判断 修改还是新增
      let url = this.ruleForm.id ? "/api/useredit" : "/api/useradd";
      this.$http.post(url, this.ruleForm).then(res => {
        // 向后台提交数据
        console.log(res);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });

             // 添加成功 获取最新的用户列表来渲染  
            this.$http.get("/api/usercount").then(res => {
                if (res.code === 200) {
                    this.total = res.list[0].total; 
                    // 添加数据不在这一页，页码加一
                    if(this.total%this.pageSize!=0&&url=="/api/useradd"){
                        this.page++;
                        // console.log(this.page);
                    } 
                    this.showlist();  
                } 
            });
         
        } else {
          this.$message({
            type: "warn",
            message: res.msg
          });
        }
        // 重置表单
        this.ruleForm = {
          roleid: "",
          username: "",
          password: "",
          status: "1"
        };
      });
    }
  }
};
</script>
<style lang="">
</style>