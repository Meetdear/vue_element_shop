import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Users from "../components/user/Users"
import Rights from "../components/power/Rights"
import Roles from "../components/power/Roles"


Vue.use(VueRouter)


const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles }
        ]
    },
]

const router = new VueRouter({
        routes
    })
    // 挂载路由导航守卫

// 1.为路由对象,添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
    //  to 将要访问的路径
    //  from 代表从哪个路径跳转而来
    // next 是一个函数 ,表示放行
    // next () 放行 next('/login') 强制跳转

    // 2.如果用户访问的登录页,直接放行
    if (to.path === '/login') return next();
    // 3.从sessionStorage中获取到 保存token值
    const tokenStr = window.sessionStorage.getItem('token')
        //  4.没有token强制跳转登录页
    if (!tokenStr) return next("/login")
    next()
})

export default router