<template>
  <div class="layout">
    <el-container>
      <el-aside width="151px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header style="background-color:#B3C0D1;text-align:right;line-height:60px;">
          {{username}}
          <el-dropdown  @command="logout">
            <!-- 显示内容 -->
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>
            </span>
            <!-- 下拉显示内容 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar.vue";
export default {
  components: {
    SideBar
  },
  computed:{
    username(){
      return this.$store.state.user.username
    }
  },
  methods:{
    // 登出函数
    logout(command){
      // console.log(command)
      sessionStorage.clear();
      this.$store.commit("clearInfo");
      this.$router.replace("/login");
    }
  }
};
</script>
<style lang="">
.layout {
  height: 100%;
}
.el-container{
  height: 100%;
}
</style>