<template>
  <div>
    <!-- 面包屑导航
    
    separator: 分割符-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:void(0);">分类管理</a>
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
        <el-table-column prop="catename" label="分类名称" width="180"></el-table-column>
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
      <el-dialog :title="'菜单'+tip" :visible.sync="dialogVisible" width="50%">
        <el-form :model="ruleForm" :rules="rules" ref="f1" label-width="150px">
          <el-form-item label="菜单类型" prop="pid">
            <!-- 选择框 -->
            <el-select v-model="ruleForm.pid">
              <el-option :key="0" label="顶层菜单" :value="'0'"></el-option>
              <el-option
                v-for="item in cate"
                :key="item.id"
                :label="item.catename"
                :value="item.id.toString()"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="catename" label="分类名称">
            <el-input v-model="ruleForm.catename"></el-input>
          </el-form-item>
          <el-form-item label="分类图片">
            <!--action:提交地址 占位
                list-type：图片墙
                 auto-upload：是否选择上传图片后自动上传
            -->
            <!-- 使用原生的 input 标签实现上传 -->
            <!-- <input type="file" ref="upload" value=""> -->
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleChange"
            >
              <!-- 上传 -->
              <i slot="default" class="el-icon-plus"></i>
              <!-- 图片的缩略插槽 -->
              <div slot="file" slot-scope="{file}">
                <!-- 预览图片 -->
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <!-- 预览图片图标 -->
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <!-- 移除图片 -->
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <!-- 预览框 -->
            <!-- <el-dialog :visible.sync="disabled">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
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
import axios from "axios";
export default {
  data() {
    return {
      // 树形数据，后台获取
      data: [],
      dialogImageUrl: "",
      disabled: false,
      //对话框是否显示
      dialogVisible: false,
      //对话框标题文本
      tip: "",
      ruleForm: {
        // 选择上级分类
        pid: "0",
        //分类名称
        catename: "",
        //图片
        img: "",
        // 状态
        status: "1"
      },
      //   分类列表数据
      cate: [],
      //   验证规则
      rules: {
        pid: [{ required: true, message: "请输入上级菜单", trigger: "blur" }],
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //切换状态
      status: true,
      //  文件列表
      fileList: []
    };
  },
  mounted() {
    //   获取菜单数据 istree =1 返回树状结构数据渲染表格
    this.$http.get("/api/catelist?istree=1").then(res => {
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
    handleChange(file) {
      console.log(file);
      this.ruleForm.img = file.raw;
    },
    //   移除图片
    handleRemove(file) {
      console.log(file);
      //   console.log(this.fileList)
      document.querySelector(".el-upload-list--picture-card").innerHTML = "";
      this.fileList = [];
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.disabled = true;
    },
    //   获取一级目录
    getCate() {
      this.$http.get("/api/catelist?pid=0").then(res => {
        console.log(res);
        this.cate = res.list;
      });
    },
    // 切换状态
    changeStatus(val) {
        console.log(val)
      // 根据 切换的 boolean 决定状态
      this.ruleForm.status = val ? "1" : "2";
      console.log(this.ruleForm.status)
    },
    // 修改函数
    handleEdit(row) {
      // 获取菜单
      this.getCate();
      this.tip = "修改";
      // 显示对话框
      this.dialogVisible = true;
      // get 请求以对象的形式传入参数，必须是在params 属性中
      this.$http
        .get("/api/cateinfo", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          console.log(res);
          let info = res.list;
          // 点击修改弹出对话框，向 ruleform 添加 id 属性
          info.id = row.id.toString();
          info.pid = info.pid.toString();
          this.ruleForm = info;
          // 状态赋值
          this.status = info.status=="1"?true:false;
          //设置图片预览图
          this.fileList = [
            { name: "", url: "http://localhost:3000" + info.img }
          ];
        });
    },
    // 删除函数
    handleDelete(row) {
      //根据id 删除数据
      this.$http.post("/api/menudelete", { id: row.id }).then(res => {
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
      this.getCate();
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
        img: "",
        catename: "",
        status: "1"
      };
      this.state = true;
    },
    // 提交操作
    handleSubmit() {
      // console.log(this.$refs.upload.files)
        console.log(this.ruleForm);
      this.dialogVisible = false;

    //  this.ruleForm.status = this.ruleForm.status==="1"?"1":"2"
      // 通过是否具有id 来判断 修改还是新增
      let url = this.ruleForm.id ? "/api/cateedit" : "/api/cateadd";
      
      //1.新建表单数据对象
      let formDate = new FormData();

      // 2.需要上传的数据添加到容器中
      for (var key in this.ruleForm) {
        // @params1: 推入的属性名
        // @params2: 推入的属性值
        formDate.append(key, this.ruleForm[key]);
      }
      // 原生上传添加
      // formDate.append("img",this.$refs.upload.files[0])

      // 3.由于需要上传图片文件，需要改写header
      axios({
        method: "post",
        url,
        data: formDate,
        headers: {
          Authorization: sessionStorage.getItem("token"),
          // 文件上传是选择该类型
          "Content-Type": "multipart/form-data "
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "上传成功"
          });
          this.$http.get("/api/catelist?istree=1").then(res => {
            console.log(res);
            if (res.code == 200) {
              this.data = res.list;
              // 重置表单
              this.ruleForm = {
                pid: "0",
                img: "",
                catename: "",
                status: "1"
              };
              document.querySelector(
                ".el-upload-list--picture-card"
              ).innerHTML = "";
              this.fileList = [];
               this.state = true;
            } else {
              this.$message({
                type: "warn",
                message: res.msg
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="">
</style>