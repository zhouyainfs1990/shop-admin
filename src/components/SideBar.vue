<template>
  <div class="side">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :default-active ="$route.path"
    >
    <!-- index 导航栏唯一标识 -->
      <el-menu-item >后台管理系统</el-menu-item>
      <el-menu-item index="/index">
          <router-link to="/index">
             <i class="el-icon-s-home"></i>首页
          </router-link>
      </el-menu-item>
      <!-- 利用 后台数据动态生成导航栏 -->
      <!-- 一级菜单 -->
      <el-submenu  v-for="(item,index) in menus" :key="index"  :index="(index+1).toString()">
          <!-- 标题插槽，显示导航标题 -->
          <template slot="title">
                <i :class="item.icon"></i>{{item.title}}
          </template>
          <!-- 二级菜单 -->
          <el-menu-item-group>
              <el-menu-item v-for="(sub,index) in item.children" :index="sub.url" :key="index" >
                  <router-link :to="sub.url">
                        {{sub.title}}
                    </router-link>
              </el-menu-item>
          </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  mounted() {
    // console.log(this.$store.state.user.menus);
  },
  computed:{
      menus(){
          return this.$store.state.user.menus;
      }
  }
};
</script>
<style lang="">
.side{
  height:100%;
  background: #545c64
}
/* 左侧宽带 */
    .el-menu {
	    width: 150px;
    }
    /*  */
    .el-submenu .el-menu-item {
        min-width: 149px;
    }
    /* 导航栏的颜色 */
    a {
        text-decoration: none;
        color: #fff;
    }
    /* 活跃样式 */
    .el-menu .is-active a.router-link-active,
    .is-opened .is-active a.router-link-active {
        color: #ffd04b;
    }
</style>