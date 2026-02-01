<template>
  <div class="profile-container">
    <a-card title="个人信息设置" class="profile-card">
      <a-form :model="formState" @finish="handleUpdate">
        <a-form-item
          label="用户名"
          name="username"
        >
          <a-input v-model:value="formState.username" disabled />
        </a-form-item>
        
        <a-form-item
          label="昵称"
          name="nickname"
          :rules="[{ required: true, message: '请输入昵称!' }]"
        >
          <a-input v-model:value="formState.nickname" placeholder="昵称">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          label="新密码"
          name="newPassword"
        >
          <a-input-password v-model:value="formState.newPassword" placeholder="留空则不修改密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item
          label="确认新密码"
          name="confirmNewPassword"
          :rules="[{ validator: validateConfirmPassword }]"
        >
          <a-input-password v-model:value="formState.confirmNewPassword" placeholder="留空则不修改密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            更新信息
          </a-button>
          <a-button style="margin-left: 8px" @click="goHome">
            返回主页
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '../store'
import api from '../api'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const loading = ref(false)
const router = useRouter()

const formState = reactive({
  username: '',
  nickname: '',
  newPassword: '',
  confirmNewPassword: ''
})

onMounted(async () => {
  // 初始化表单数据
  if (userStore.user) {
    formState.username = userStore.user.username
    formState.nickname = userStore.user.nickname
  }
})

const validateConfirmPassword = (_, value) => {
  if (!value) {
    return Promise.resolve()
  }
  if (!formState.newPassword) {
    return Promise.reject('请先输入新密码')
  }
  if (value === formState.newPassword) {
    return Promise.resolve()
  }
  return Promise.reject('两次输入的密码不一致!')
}

const handleUpdate = async (values) => {
  loading.value = true
  try {
    const updateData = {}
    let hasUpdate = false
    
    if (values.nickname && values.nickname !== userStore.user?.nickname) {
      updateData.nickname = values.nickname
      hasUpdate = true
    }
    
    if (values.newPassword) {
      updateData.password = values.newPassword
      hasUpdate = true
    }
    
    if (!hasUpdate) {
      message.warning('请至少修改昵称或密码其中一项')
      return
    }
    
    const response = await api.put('/users/update', updateData)
    
    if (response.data.success) {
      message.success('用户信息更新成功')
      // 更新用户信息
      userStore.setUser(response.data.user, response.data.token)
      // 更新表单数据
      formState.username = response.data.user.username
      formState.nickname = response.data.user.nickname
      
      // 自动返回主页
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      message.error(response.data.message || '更新失败')
    }
  } catch (error) {
    message.error('更新失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.profile-card {
  width: 100%;
  max-width: 500px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
    min-height: calc(100vh - 100px);
  }
  
  .profile-card {
    max-width: 100%;
  }
}
</style>