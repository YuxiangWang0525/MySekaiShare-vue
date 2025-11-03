<template>
  <a-layout class="layout">
    <!-- 页头 -->
    <a-layout-header class="header">
      <div class="logo">MySekaiShare</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="home">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="sekai-list">
          <router-link to="/sekai-list">分享广场</router-link>
        </a-menu-item>
        <a-menu-item key="about">
          <router-link to="/about">关于</router-link>
        </a-menu-item>
      </a-menu>
      <div class="user-actions">
        <template v-if="userStore.isAuthenticated">
          <span>欢迎, {{ userStore.user?.username }}</span>
          <a-button type="link" @click="handleLogout">退出</a-button>
        </template>
        <template v-else>
          <router-link to="/login">登录</router-link>
          <router-link to="/register" class="register-link">注册</router-link>
        </template>
      </div>
    </a-layout-header>
    
    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider v-if="userStore.isAuthenticated" width="200" class="sider" v-show="false">
        <a-menu
          mode="inline"
          :default-selected-keys="['1']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="1">
            <template #icon>
              <UserOutlined />
            </template>
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="2">
            <template #icon>
              <FileTextOutlined />
            </template>
            <span>我的分享</span>
          </a-menu-item>
          <a-menu-item key="3">
            <template #icon>
              <SettingOutlined />
            </template>
            <span>设置</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      
      <!-- 主内容区域 -->
      <a-layout-content class="content-wrapper">
        <a-watermark 
          v-if="showWatermark" 
          :content="watermarkContent" 
          :font="{ color: 'rgba(0, 0, 0, .15)' }"
          :gap="[100, 100]"
        >
          <div class="content">
            <router-view />
          </div>
        </a-watermark>
        <div v-else class="content">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>

    <!-- 页脚 -->
    <a-layout-footer class="footer">
      <div class="footer-content">
        <p>MySekaiShare &copy;2025 SekaiLand 版权所有.本站与SEGA、Colorful Palette、CFM无关.</p>
        <p>侵权申述邮箱:riverfrozer@dreameriver.cn</p>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './store'
import { message } from 'ant-design-vue'
import { 
  UserOutlined, 
  FileTextOutlined, 
  SettingOutlined 
} from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const selectedKeys = ref(['home'])

// 控制水印显示的变量，开发人员可以手动修改这个值来启禁用水印
const showWatermark = ref(true)

// 生成水印内容
const watermarkContent = computed(() => {
  const username = userStore.user?.username || '未知用户'
  const now = new Date()
  const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  
  return [
    '内部测试',
    '不代表最终品质请勿分享',
    username,
    timeString
  ]
})

const handleLogout = async () => {
  try {
    await userStore.logout()
    message.success('已退出登录')
    router.push('/login')
  } catch (error) {
    message.error('登出失败: ' + error.message)
  }
}

onMounted(() => {
  // 初始化时可以根据当前路由设置选中的菜单项
  const path = router.currentRoute.value.path
  if (path === '/') {
    selectedKeys.value = ['home']
  } else if (path === '/sekai-list') {
    selectedKeys.value = ['sekai-list']
  } else if (path === '/about') {
    selectedKeys.value = ['about']
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  padding-top: 64px; /* 添加顶部padding以补偿固定的header高度 */
}

.header {
  position: fixed; /* 改为fixed定位 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保header在其他元素之上 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  float: left;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.user-actions {
  float: right;
  color: white;
}

.user-actions a {
  color: white;
  margin-left: 15px;
  text-decoration: none;
}

.register-link {
  margin-left: 10px !important;
}

.sider {
  background: #fff;
  overflow: auto;
  height: calc(100vh - 64px - 70px); /* 高度减去 header 和 footer */
  position: fixed;
  left: 0;
  top: 64px; /* 调整位置以适应固定的header */
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 64px - 70px - 40px);
  background: #fff;
  margin-top: 0; /* 移除可能存在的margin-top */
}

.content {
  height: 100%;
}

.footer {
  text-align: center;
  background: #f0f2f5;
  padding: 10px 0;
}

.footer-content p {
  margin: 0;
}
</style>