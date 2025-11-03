<template>
  <div class="auth-container">
    <a-card title="用户注册" class="auth-card">
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
          name="email"
          :rules="[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '请输入有效的邮箱地址!' }]"
        >
          <a-input v-model:value="formState.email" placeholder="邮箱">
            <template #prefix>
              <MailOutlined />
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
        
        <a-form-item
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码!' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password v-model:value="formState.confirmPassword" placeholder="确认密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <!-- Cloudflare Turnstile 组件 -->
        <a-form-item>
          <div ref="turnstileContainer"></div>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            注册
          </a-button>
        </a-form-item>
        
        <a-form-item>
          <div class="auth-links">
            <router-link to="/login">已有账号？立即登录</router-link>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import api from '../api'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const turnstileContainer = ref(null)
const turnstileToken = ref('')

const formState = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 加载 Turnstile 脚本
const loadTurnstile = () => {
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
  
  script.onload = () => {
    // 渲染 Turnstile 组件
    renderTurnstile()
  }
}

// 渲染 Turnstile 组件
const renderTurnstile = () => {
  if (typeof window.turnstile !== 'undefined' && turnstileContainer.value) {
    window.turnstile.render(turnstileContainer.value, {
      sitekey: '0x4AAAAAAB-VhaLQ3t18hth0',
      callback: function (token) {
        turnstileToken.value = token
      },
      'error-callback': function () {
        message.error('验证码加载失败')
      }
    })
  }
}

onMounted(() => {
  loadTurnstile()
})

onBeforeUnmount(() => {
  if (typeof window.turnstile !== 'undefined'){
    window.turnstile.remove()
  }
})

const validateConfirmPassword = (_, value) => {
  if (!value || value === formState.password) {
    return Promise.resolve()
  }
  return Promise.reject('两次输入的密码不一致!')
}

const handleFinish = async (values) => {
  loading.value = true
  try {
    // 注册请求
    const response = await api.post('/users/register', {
      username: values.username,
      email: values.email,
      password: values.password,
      'cf-turnstile-response': turnstileToken.value
    })
    message.success('注册成功')
    userStore.setUser(response.data.user)
    router.push('/')
  } catch (error) {
    message.error('注册失败: ' + (error.response?.data?.message || error.message))
    // 重置验证码
    if (typeof window.turnstile !== 'undefined') {
      window.turnstile.reset()
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

/* Turnstile 容器样式 */
.cf-turnstile-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}
</style>