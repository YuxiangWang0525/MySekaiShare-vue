import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import SekaiList from '../views/SekaiList.vue'
import SekaiDetail from '../views/SekaiDetail.vue'
import { useUserStore } from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sekai-list',
    name: 'SekaiList',
    component: SekaiList
  },
  {
    path: '/sekai-detail',
    name: 'SekaiDetail',
    component: SekaiDetail
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
    {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 对于需要认证的页面可以在这里添加判断
  // 示例：如果访问需要登录的页面但未登录，则重定向到登录页
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   if (!userStore.isAuthenticated) {
  //     next('/login')
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }
  
  next()
})

export default router