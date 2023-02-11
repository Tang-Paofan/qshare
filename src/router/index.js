import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: 'dataDisplay',
        name: 'DataDisplay',
        component: () => import('../views/DataDisplay.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../views/Order.vue')
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('../views/Shop.vue')
      },
			{
        path: 'business',
        name: 'Business',
        component: () => import('../views/Business.vue')
      },
			{
        path: 'messageInfo',
        name: 'MessageInfo',
        component: () => import('../views/MessageInfo.vue')
      },
      {
        path: 'userInfo',
        name: 'UserInfo',
        component: () => import('../views/UserInfo.vue')
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/paySuccess',
    name: 'paySuccess',
    component: () => import('../views/paySuccess.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
// to 将要访问的路径  from 代表从哪个路径跳转而来  next()放行  next('/login')强制跳转
router.beforeEach((to, from, next) => {

  // 1.如果访问的是登录页login放行
  if (to.path === '/login') return next()
  // 如果要注册，则去注册
  if (to.path === '/register') return next()
  // 2.获取token
  const tokenStr = window.localStorage.userInfo
  // 3.tokenStr不存在强制跳转到登录页login
  if (tokenStr == undefined) return next('/login')
  // 4.tokenStr存在放行
  next()
})

export default router
