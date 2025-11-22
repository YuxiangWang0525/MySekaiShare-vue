<template>
  <a-layout class="layout">
    <!-- 页头 -->
    <a-layout-header class="header">
      <div class="logo">MySekaiShare</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        class="nav-menu"
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
          <span class="username-text" style="white-space: nowrap;">欢迎, {{ userStore.user?.username }}</span>
          <a-button type="link" @click="handleLogout" class="logout-button">退出</a-button>
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
        <p>侵权申述邮箱:riverfrozer@dreameriver.cn 严禁将本站任何内容用于商业用途(包括但不限于:售卖本站地址、本站数据、或将本站含地址在内的任何信息作为任何有偿的售卖赠品)</p>
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
    '灰度公测',
    '不代表最终品质',
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

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
};
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-actions {
  float: right;
  color: white;
  display: flex;
  align-items: center;
  min-width: 0; /* 允许flex子项收缩 */
}

.user-actions a {
  color: white;
  margin-left: 15px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 0 10px;
  }
  
  .logo {
    font-size: 18px;
    max-width: 40%;
  }
  
  .user-actions {
    max-width: 60%;
  }
  
  .user-actions a {
    margin-left: 8px;
    font-size: 14px;
    max-width: 50%;
  }
  
  .username-text {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .logout-button {
    font-size: 14px;
    padding: 0 8px;
  }
  
  .content-wrapper {
    padding: 12px;
  }
  
  .footer-content {
    font-size: 12px;
    padding: 0 10px;
  }
}

@media (max-width: 576px) {
  .layout {
    padding-top: 50px;
  }
  
  .header {
    padding: 0 8px;
    height: 50px !important;
    line-height: 50px !important;
  }
  
  .logo {
    font-size: 16px;
    max-width: 35%;
  }
  
  .user-actions {
    max-width: 65%;
  }
  
  .user-actions a {
    margin-left: 5px;
    font-size: 12px;
    max-width: 45%;
  }
  
  .username-text {
    font-size: 12px;
    max-width: 60%;
  }
  
  .logout-button {
    font-size: 12px;
    padding: 0 5px;
  }
  
  .nav-menu {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
  }
  
  .nav-menu::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  
  .nav-menu .ant-menu-item {
    flex: 0 0 auto;
    padding: 0 8px !important;
    font-size: 14px;
  }
  
  .content-wrapper {
    padding: 8px;
  }
  
  .footer {
    padding: 8px 0;
  }
  
  .footer-content p {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 15px;
    max-width: 30%;
  }
  
  .user-actions {
    max-width: 70%;
  }
  
  .user-actions a {
    font-size: 11px;
    margin-left: 3px;
  }
  
  .username-text {
    font-size: 11px;
  }
  
  .logout-button {
    font-size: 11px;
  }
  
  .nav-menu .ant-menu-item {
    padding: 0 5px !important;
    font-size: 12px;
  }
}

@media (max-width: 375px) {
  .logo {
    font-size: 14px;
    max-width: 25%;
  }
  
  .user-actions {
    max-width: 75%;
  }
  
  .user-actions a {
    font-size: 10px;
    margin-left: 2px;
  }
  
  .username-text {
    font-size: 10px;
  }
  
  .logout-button {
    font-size: 10px;
    padding: 0 3px;
  }
  
  .nav-menu .ant-menu-item {
    padding: 0 4px !important;
    font-size: 11px;
  }
}
</style>