import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Index from '@/pages/Index'
import Menu from '@/pages/Menu'
import Role from '@/pages/Role'
// import User from '@/pages/User'
let User = ()=> import( /*webpackChunkName: 'group-a' */ "@/pages/User")
let Category = ()=> import( /*webpackChunkName: 'group-a' */ "@/pages/Category")
let Specs = ()=> import( /*webpackChunkName: 'group-a' */ "@/pages/Specs")
let Goods = ()=> import( /*webpackChunkName: 'group-a' */ "@/pages/Goods")
Vue.use(Router)


let router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },{
      path:"/",
      component:Layout,
      children:[{
        path:"index",
        component:Index
      },{
        path:"menu",
        component:Menu
      },{
        path:"role",
        component:Role
      },{
        path:"user",
        component:User
      },{
        path:"category",
        component:Category
      },{
        path:"specs",
        component:Specs
      },{
        path:"goods",
        component:Goods
      },{
        path:"*",
        redirect:"/index"
      }]
    }
  ]
})


// 导航守卫
router.beforeEach((to,from,next)=>{
  // 获取登录信息
  let user =JSON.parse(sessionStorage.getItem("user"));
  // 已登录
  if(user){
    if(to.path=="/login"){
      next(false)
    }else if(to.path=="/"||to.path=="/index"){
      next();
    }else{
      // console.log(user)

      //判断用户的访问权限
      // let flag = user.menus_url.some(item=>item==to.path);

      let flag = false;

      user.menus_url.map(item=>{
        if(item==to.path){
          flag = true;
        }
      });

      console.log(flag)
      // 具有访问权限
      if(flag){
        next();
      }else{
        // 不具有访问权限
        next(false);
      }
    }
  }else{
    // 未登录
    if(to.path=="/login"){
      next()
    }else{
      next("/login");
    }
  }
})
export default router
