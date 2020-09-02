<template>
  <div>
    <!-- 面包屑导航
    
     separator: 分割符-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:void(0);">菜单管理</a>
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
        <el-table-column prop="title" label="名称" width="180"></el-table-column>
        <el-table-column prop="icon" label="图标" width="150">
          <!-- 插槽插入  自定义内容 -->
          <template slot-scope="scope">
            <!-- scope.row ： 这一行的数据 -->
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="150">
          <template slot-scope="scope">
            <!-- scope.row ： 这一行的数据 -->
            <el-tag v-if="scope.row.type==1">目录</el-tag>
            <el-tag v-else type="success">菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="菜单URL" width="150"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 点击编辑和删除按钮，做对应的操作，传入参数为这一行的数据 -->
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹出对话框：    -->
      <el-dialog :title="'菜单'+tip" :visible.sync="dialogVisible" width="50%">
        <el-form :model="ruleForm" :rules="rules" ref="f1" label-width="150px">
          <el-form-item label="菜单类型" prop="pid">
            <!-- 选择框 -->
            <el-select v-model="ruleForm.pid" @change="changeMenu">
              <el-option :key="0" label="顶层菜单" :value="'0'"></el-option>
              <el-option
                v-for="item in menu"
                :key="item.id"
                :label="item.title"
                :value="item.id.toString()"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title" label="菜单名称">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <!-- 根据 type 决定 是否显示 -->
          <el-form-item prop="icon" label="菜单图标" v-show="ruleForm.type==='1'">
            <el-input v-model="ruleForm.icon"></el-input>
          </el-form-item>
          <!-- 根据 type 决定 类型 -->
          <el-form-item label="类型">
            <el-radio v-model="ruleForm.type" label="1" :disabled="ruleForm.type=='2'">目录</el-radio>
            <el-radio v-model="ruleForm.type" label="2" :disabled="ruleForm.type=='1'">菜单</el-radio>
          </el-form-item>
          <!-- 根据 type 决定 是否显示 -->
          <el-form-item label="菜单路径" v-show="ruleForm.type==='2'">
            <el-input v-model="ruleForm.url"></el-input>
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
    //  value 要验证的值
    // callback，回调函数 ,传入错误对象，显示错误信息
    var menucheck = (rule, value, callback) => {
      // 输入值为空
      if (!value) {
        return callback(new Error("菜单不能为空"));
      }
      var reg = /^[\u4e00-\u9fa5]{3,5}$/g;
      if (!reg.test(value)) {
        return callback(new Error("请输入3-5汉字"));
      }
    };
    return {
      // 树形数据，后台获取
      data: [],
      //对话框是否显示
      dialogVisible: false,
      //对话框标题文本
      tip: "",
      ruleForm: {
        // 选择上级分类
        pid: "0",
        //文本
        title: "",
        // 图标
        icon: "",
        // 类型
        type: "1",
        // 菜单路径
        url: "",
        // 状态
        status: "1"
      },
      //   菜单列表数据
      menu: [],
      //   验证规则
      rules: {
        pid: [{ required: true, message: "请输入上级菜单", trigger: "blur" }],
        title: [{ validator: menucheck, trigger: "blur" }]
      },
      //   切换状态
      status: true
    };
  },
  mounted() {
    //   获取菜单数据 istree =1 返回树状结构数据渲染表格
    this.$http.get("/api/menulist?istree=1").then(res => {
      console.log(res);
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
  methods: {
    //   获取一级目录
    getMenu() {
      this.$http.get("/api/menulist?pid=0").then(res => {
        // console.log(res);
        this.menu = res.list;
      });
    },
    // 点击切换 目录或者菜单
    changeMenu(val) {
      // 根据 切换的 option 的value 决定类型
      this.ruleForm.type = val === 0 ? "1" : "2";
    },
    // 切换状态
    changeStatus(val) {
      // 根据 切换的 boolean 决定状态
      this.ruleForm.status = val ? "1" : "2";
    },
    // 修改函数
    handleEdit(row) {
      // 获取菜单
      this.getMenu();
      this.tip = "修改";
      // 显示对话框
      this.dialogVisible = true;
      // get 请求以对象的形式传入参数，必须是在params 属性中
      this.$http
        .get("/api/menuinfo", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          console.log(res);
          let info = res.list;
          // 点击修改弹出对话框，向 ruleform 添加 id 属性
          info.id = info.id.toString();
          info.pid = info.pid.toString();
          info.type = info.type.toString();
          this.status = info.status=="1"?true:false;
          this.ruleForm = info;
          
        });
    },
    // 删除函数
    handleDelete(row) {
      //根据id 删除数据
      this.$http.post("/api/menudelete", { id: row.id }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.data = res.list?res.list:[];
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
      this.getMenu();
      // 对话框标题修改
      this.tip = "添加";
      // 显示对话框
      this.dialogVisible = true;
    },
    // 点击取消还原 表单数据
    handleReset() {
      this.dialogVisible = false;
      this.ruleForm = {
        pid: "0",
        title: "",
        icon: "",
        type: "1",
        url: "",
        status: "1"
      };
    },
    // 提交操作
    handleSubmit() {
      this.dialogVisible = false;
      // 通过是否具有id 来判断 修改还是新增
      let url = this.ruleForm.id ? "/api/menuedit" : "/api/menuadd";
      this.$http.post(url, this.ruleForm).then(res => {
        // 向后台提交数据
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          // 添加成功 获取最新的菜单列表来渲染
          this.$http.get("/api/menulist?istree=1").then(res => {
            console.log(res);
            if (res.code == 200) {
              this.data = res.list || [];
            } else {
              this.$message({
                type: "warn",
                message: res.msg
              });
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
          pid: "0",
          title: "",
          icon: "",
          type: "1",
          url: "",
          status: "1"
        };
      });
    }
  }
};
</script>
<style lang="">
</style>