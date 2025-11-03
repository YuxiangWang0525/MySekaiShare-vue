import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
    // baseURL: 'https://mssapi.sekailand.cn',
  baseURL: 'http://localhost:3000', // 根据实际后端地址进行修改
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 添加凭据支持
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 确保每次请求都携带凭证
    config.withCredentials = true
    // 打印请求信息用于调试
    console.log('发送请求:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 打印响应信息用于调试
    console.log('收到响应:', {
      url: response.config.url,
      status: response.status,
      headers: response.headers
    })
    return response
  },
  error => {
    // 检查是否是401错误
    if (error.response && error.response.status === 401) {
      // 可以在这里处理未授权错误，比如重定向到登录页
      console.log('收到401未授权响应')
    }
    console.log('请求错误:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      headers: error.response?.headers
    })
    return Promise.reject(error)
  }
)

export default api