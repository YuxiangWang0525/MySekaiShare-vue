import { defineStore } from 'pinia'
import api from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    setUser(user, token) {
      this.user = user
      this.isAuthenticated = true
      // 保存到 localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      if (token) {
        localStorage.setItem('token', token)
      }
    },
    
    async logout() {
      try {
        // 调用后端登出接口
        await api.post('/users/logout')
      } catch (error) {
        console.error('登出接口调用失败:', error)
      }
      
      this.user = null
      this.isAuthenticated = false
      // 从 localStorage 中清除
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('token')
    },
    
    // 初始化时从 localStorage 恢复状态
    async initStore() {
      const savedUser = localStorage.getItem('user')
      const savedAuthState = localStorage.getItem('isAuthenticated')
      const token = localStorage.getItem('token')
      
      if (savedUser && savedAuthState === 'true' && token) {
        this.user = JSON.parse(savedUser)
        this.isAuthenticated = true
        
        // 验证服务端登录状态是否仍然有效
        try {
          const response = await api.get('/users/me')
          if (!response.data.success) {
            // 如果服务端状态无效，则清除本地状态
            console.log('服务端认证状态无效，清除本地状态')
            this.logout()
          } else {
            // 更新用户信息
            this.user = response.data.user
          }
        } catch (error) {
          // 如果验证失败，也清除本地状态
          console.log('验证服务端认证状态失败:', error)
          if (error.response && error.response.status === 401) {
            this.logout()
          }
        }
      } else if (!token && (savedUser || savedAuthState === 'true')) {
        // 如果没有token但有其他认证信息，也需要清理
        this.logout()
      }
    }
  }
})