<template xmlns="http://www.w3.org/1999/XSL/Transform">
  <div class="home">
    <a-result v-if="isMaintenance" title="正在维护" sub-title="抱歉，网站正在维护中，请稍后再试">
      <template #icon>
        <img :src="isNotonlineImage" alt="维护中" style="width: 200px; height: auto;" />
      </template>
    </a-result>
    <div v-else>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-card title="欢迎来到 MySekaiShare">
            <p>这是一个分享MySEKAI的平台。</p>
            <p>你可以在这里：</p>
            <ul>
              <li>浏览其他玩家分享的SEKAI</li>
              <li v-if="userStore.isAuthenticated">分享你自己的SEKAI</li>
              <li v-else>
                <router-link to="/login">登录</router-link> 或 
                <router-link to="/register">注册</router-link> 后分享你自己的SEKAI
              </li>
              <p style="color:red;">现阶段注册账户并不需要邮箱验证,只是在找回密码的时候需要使用邮箱地址来验证。任何声称自己为MySEKAIShare平台工作人员的人要求你提供邮箱地址或者电话号码的都是诈骗!!!!!</p>
              <p>请各位<del>豆腐</del>老师们不要拘束,如果愿意,可以把好友码(SEKAI ID)分享到平台上。让更多的豆腐人们能够造访你的SEKAI。<del>或者多了一个冲榜搭子</del></p>
            </ul>
            
            <template #actions>
              <router-link to="/sekai-list">
                <a-button type="primary" size="large">
                  浏览SEKAI分享广场
                </a-button>
              </router-link>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store'
import axios from 'axios'
import isNotonlineImage from '../assets/is_notonline.png'

const userStore = useUserStore()
const isMaintenance = ref(false)

const checkBackendStatus = async () => {
  try {
    // 创建一个新的 axios 实例，不使用拦截器
    const instance = axios.create({
      baseURL: 'https://mssapi.sekailand.cn',
      timeout: 10000,
      validateStatus: function (status) {
        // 将所有状态码都视为"成功"，这样就不会抛出异常
        return status >= 200 && status <= 599
      }
    })

    const response = await instance.get('/')
    if (response.status === 502) {
      isMaintenance.value = true
    }
  } catch (error) {
    // 即使如此，某些网络错误仍可能导致异常，我们也可以在这种情况下显示维护消息
    console.error('检查后端状态时发生错误:', error)
    isMaintenance.value = true
  }
}

onMounted(() => {
  checkBackendStatus()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home {
    padding: 15px;
  }
  
  .ant-card-head-title {
    font-size: 18px;
  }
  
  .ant-card-body {
    padding: 12px;
  }
  
  ul {
    padding-left: 15px;
    font-size: 14px;
  }
  
  li {
    margin-bottom: 8px;
  }
}

@media (max-width: 576px) {
  .home {
    padding: 10px;
  }
  
  .ant-card {
    font-size: 12px;
  }
  
  .ant-card-head {
    padding: 8px 12px;
  }
  
  .ant-card-head-title {
    font-size: 16px;
  }
  
  .ant-card-body {
    padding: 10px;
  }
  
  ul {
    padding-left: 12px;
  }
  
  .ant-btn {
    font-size: 12px;
    height: 32px;
  }
}
</style>