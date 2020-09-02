<template>
  <div>
    <!-- 面包屑导航
    
    separator: 分割符-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:void(0);">角色管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-container">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <!-- 
        利用返回数据生成树状结构表格
      -->
      <el-table :data="data" style="width: 100%" row-key="id" border>
        <!-- 
          prop : 关联的data 中的数据的名称
          label : 表头文字
          默认将 关联数据的文本作为内容项
        -->
        <!-- prop: 指定关联的data 数据的属性 -->
        <el-table-column prop="rolename" label="名称" width="180"></el-table-column>
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

      <!-- 弹出对话框：    -->
      <el-dialog :title="'角色'+tip" :visible.sync="dialogVisible" width="50%">
        <el-form :model="ruleForm" :rules="rules" ref="f1" label-width="150px">
          <el-form-item prop="rolename" label="角色名称">
            <el-input v-model="ruleForm.rolename"></el-input>
          </el-form-item>
          <!-- 树状结构 -->
          <el-form-item label="角色权限">
            <!-- 
                  data 绑定的树状结构数据
                  show-checkbox 可选择
                  node-key: 节点表示
                  props: children 属性作为子阶段数据
                  label : 文本是title 属性
                  ref : 添加标记，为后面 获取 checked-key 做准备
            -->
            <el-tree
              ref="m"
              :data="menu"
              show-checkbox
              node-key="id"
              :default-checked-keys="menus"
              :props="{children:'children',label:'title'}"
            ></el-tree>
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
        rolename: "",
        status: "1"
      },
      //   菜单列表数据
      menu: [],
      //   验证规则
      rules: {
        rolename: [
          { required: true, message: "请输入上级菜单", trigger: "blur" }
        ]
      },
      //   切换状态
      status: true,
      menus: []
    };
  },
  mounted() {
    //   获取角色数据
    this.$http.get("/api/rolelist").then(res => {
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
    getMenu() {
      // 获取菜单的树状结构数据
      this.$http.get("/api/menulist?istree=1").then(res => {
        // console.log(res);
        this.menu = res.list;
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
      this.getMenu();
      this.tip = "修改";
      // 显示对话框
      this.dialogVisible = true;
      // get 请求以对象的形式传入参数，必须是在params 属性中
      this.$http
        .get("/api/roleinfo", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          console.log(res);
          let info = res.list;
          this.menus = res.list.menus.split(",");
          // 点击修改弹出对话框，向 ruleform 添加 id 属性
          info.id = row.id.toString();
          this.status = info.status=="1"?true:false;
          this.ruleForm = info;
        });
    },
    // 删除函数
    handleDelete(row) {
      //根据id 删除数据
      this.$http.post("/api/roledelete", { id: row.id }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.data = res.list ? res.list : [];
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
          rolename:"",
          status: "1"
      };
    },
    // 提交操作
    handleSubmit() {
      this.dialogVisible = false;
      // 通过是否具有id 来判断 修改还是新增
      let url = this.ruleForm.id ? "/api/roleedit" : "/api/roleadd";
      // 获取 树状 组将选择权限 数组转化为字符串 准备提交
      let menus = this.$refs.m.getCheckedKeys().join(",");
      this.ruleForm.menus = menus;
      this.$http.post(url, this.ruleForm).then(res => {
        // 向后台提交数据
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          // 添加成功 获取最新的菜单列表来渲染
          this.$http.get("/api/rolelist").then(res => {
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
          rolename:"",
          status: "1"
        };
        this.menus = [];
        this.menu = [];
      });
    }
  }
};
</script>
<style lang="">
</style>