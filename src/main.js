import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { useUserStore } from './store'

// 创建应用实例
const app = createApp(App)

// 检查系统主题偏好并设置主题
const savedTheme = localStorage.getItem('preferred-theme')
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

// 设置初始主题
let initialTheme = 'light'
if (savedTheme) {
  initialTheme = savedTheme
} else {
  initialTheme = systemPrefersDark ? 'dark' : 'light'
}

// 将主题设置到body标签
document.body.setAttribute('data-theme', initialTheme)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)

// 初始化用户存储状态
const userStore = useUserStore()
userStore.initStore()

// 挂载应用
app.mount('#app')