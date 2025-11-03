<template>
  <div class="auth-container">
    <a-card title="用户登录" class="auth-card">
      <a-form :model="formState" @finish="handleFinish">
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" placeholder="用户名">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            登录
          </a-button>
        </a-form-item>
        
        <a-form-item>
          <div class="auth-links">
            <router-link to="/register">没有账号？立即注册</router-link>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import api from '../api'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const formState = reactive({
  username: '',
  password: ''
})

const handleFinish = async (values) => {
  loading.value = true
  try {
    // 登录请求
    const response = await api.post('/users/login', values)
    
    if (response.data.success) {
      message.success('登录成功')
      userStore.setUser(response.data.user)
      // 检查是否设置了cookie
      console.log('登录响应中的set-cookie头部:', response.headers['set-cookie'] || '无');
      router.push('/')
    } else {
      message.error('登录失败: ' + response.data.message)
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    if (error.response && error.response.status === 401) {
      message.error('登录失败: 用户名或密码错误')
    } else {
      message.error('登录失败: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-links {
  text-align: center;
}

.auth-links a {
  color: #1890ff;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>