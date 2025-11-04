<template>
  <div class="sekai-detail">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="sekaiData['MySEKAI昵称ID'] || sekaiData.sekaiName || 'SEKAI详情'"
      :sub-title="'心愿主: ' + (sekaiData.User?.username || '未知')"
      @back="() => router.go(-1)"
    >
      <template #extra>
        <a-button v-if="isOwner" @click="showEditModal">编辑</a-button>
        <a-button>收藏</a-button>
        <a-button type="primary">复制</a-button>
      </template>
      
      <template #footer>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="基本信息" />
          <a-tab-pane key="2" tab="物品详情" />
        </a-tabs>
      </template>
    </a-page-header>
    
    <a-spin :spinning="loading">
      <a-card v-if="sekaiData && Object.keys(sekaiData).length > 0" class="sekai-content">
        <a-descriptions title="SEKAI信息" :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
          <a-descriptions-item label="SEKAI ID">
            {{ sekaiData.SEKAIID || sekaiData.sekaiId || '未知' }}
          </a-descriptions-item>
          <a-descriptions-item label="服务器地区">
            {{ sekaiData.ServerRegion?.region || '未知' }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ formatDate(sekaiData.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ formatDate(sekaiData.updatedAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="物品数量">
            {{ sekaiData.SekaiFixtures?.length || 0 }}
          </a-descriptions-item>
        </a-descriptions>
        
        <a-divider />
        
        <div class="sekai-description">
          <h3>描述</h3>
          <p>{{ sekaiData['MySEKAI描述'] || sekaiData.description || '暂无描述' }}</p>
        </div>
        
        <a-divider />
        
        <div class="sekai-fixtures">
          <h3>物品列表</h3>
          <a-list
            :grid="{ gutter: 16, column: 4 }"
            :data-source="sekaiData.SekaiFixtures || []"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card style="min-width: 240px">
                  <template #title>
                    <div class="fixture-title">{{ getFixtureName(item['物品id'] || item.fixtureId) }}</div>
                  </template>
                  <p>物品ID: {{ item['物品id'] || item.fixtureId }}</p>
                  <a :href="'https://sekai.best/mysekai/fixture/'+(item['物品id'] || item.fixtureId)" target="_blank">在Sekai Viewer查看</a>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-card>
      
      <a-result v-else title="SEKAI未找到" sub-title="抱歉，没有找到对应的SEKAI信息">
        <template #icon>
          <img :src="miku25ji404" alt="404 Not Found" style="width: 200px; height: auto;" />
        </template>
        <template #extra>
          <a-button type="primary" @click="router.push('/sekai-list')">返回分享广场</a-button>
        </template>
      </a-result>
    </a-spin>

    <!-- 编辑SEKAI信息的模态框 -->
    <SekaiEditModal 
      :visible="editModalVisible" 
      :sekai-data="sekaiData"
      @close="closeEditModal"
      @updated="handleSekaiUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '../store'
import api from '../api'
import SekaiEditModal from '../components/SekaiEditModal.vue'
import miku25ji404 from '../assets/404.png'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const sekaiData = ref({})
const fixtureMap = ref({})
const editModalVisible = ref(false)

// 判断当前用户是否为SEKAI的所有者
const isOwner = computed(() => {
  return userStore.isAuthenticated && 
         sekaiData.value.userId && 
         userStore.user && 
         userStore.user.id === sekaiData.value.userId
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN')
}

// 获取物品名称
const getFixtureName = (fixtureId) => {
  if (!fixtureId) return '未知物品'
  return fixtureMap.value[fixtureId] || `物品 ${fixtureId}`
}

// 显示编辑模态框
const showEditModal = () => {
  editModalVisible.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
}

// 处理SEKAI更新完成事件
const handleSekaiUpdated = () => {
  closeEditModal()
  loadSekaiDetail()
  message.success('SEKAI信息更新成功')
}

// 加载物品映射
const loadFixtureMap = async () => {
  try {
    const response = await api.get('/getFixtures')
    if (response.data) {
      fixtureMap.value = response.data.reduce((map, item) => {
        map[item.id] = item.name
        return map
      }, {})
    }
  } catch (error) {
    message.error('获取物品列表失败: ' + error.message)
  }
}

// 加载SEKAI详情
const loadSekaiDetail = async () => {
  loading.value = true
  try {
    const sekaiId = route.query.SEKAIID
    if (!sekaiId) {
      message.error('缺少SEKAI ID参数')
      router.push('/sekai-list')
      return
    }

    const response = await api.get(`/api/get_sekai_detail?SEKAIID=${sekaiId}`)
    if (response.data.success) {
      sekaiData.value = response.data.data
    } else {
      message.error('获取SEKAI详情失败: ' + response.data.message)
    }
  } catch (error) {
    message.error('获取SEKAI详情失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFixtureMap()
  loadSekaiDetail()
})
</script>

<style scoped>
.sekai-detail {
  padding: 20px;
}

.sekai-content {
  margin-top: 20px;
}

.sekai-description h3,
.sekai-fixtures h3 {
  margin-bottom: 16px;
}

.sekai-description p {
  font-size: 16px;
  line-height: 1.5;
}

:deep(.ant-card-head-title) {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  word-break: break-all;
}

.fixture-title {
  word-break: break-all;
  white-space: normal;
}

/* 移动端适配 */
@media (max-width: 992px) {
  .sekai-fixtures .ant-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .sekai-fixtures .ant-list-item {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .sekai-detail {
    padding: 12px;
  }
}

@media (max-width: 576px) {
  .sekai-detail {
    padding: 8px;
  }
  
  .sekai-fixtures .ant-list-item {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .fixture-title {
    font-size: 14px;
  }
  
  .ant-card-body p {
    font-size: 12px;
  }
  
  .ant-page-header-heading-title {
    font-size: 16px;
  }
  
  .ant-page-header-heading-sub-title {
    font-size: 12px;
  }
}

@media (max-width: 375px) {
  .fixture-title {
    font-size: 13px;
  }
  
  .ant-card-body p {
    font-size: 11px;
  }
}
</style>