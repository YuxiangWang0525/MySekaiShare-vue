<template>
  <div class="home">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="欢迎来到 MySekaiShare">
          <p>这是一个分享MySEKAI的平台。</p>
          <p>你可以在这里：</p>
          <ul>
            <li>浏览其他玩家分享的SEKAI</li>
            <li v-if="userStore.isAuthenticated">分享你自己的SEKAI搭配</li>
            <li v-else>
              <router-link to="/login">登录</router-link> 或 
              <router-link to="/register">注册</router-link> 后分享你自己的SEKAI搭配
            </li>
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
</template>

<script setup>
import { useUserStore } from '../store'
const userStore = useUserStore()
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