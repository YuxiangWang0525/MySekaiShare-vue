<template>
  <div class="sekai-list">
    <a-page-header
      title="SEKAI分享广场"
      sub-title="查看其他玩家分享的SEKAI搭配"
    >
      <template #extra>
        <a-button v-if="userStore.isAuthenticated" type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          分享我的SEKAI
        </a-button>
      </template>
    </a-page-header>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <a-card title="筛选条件" size="small">
        <a-form layout="inline" :model="filterForm">
          <a-form-item label="包含物品">
            <a-select
              v-model:value="filterForm.fixtures"
              mode="multiple"
              placeholder="请选择要筛选的物品"
              :options="fixtureOptions"
              :filter-option="filterOption"
              show-search
              style="width: 300px"
            />
          </a-form-item>
          <a-form-item label="服务器">
            <a-select
              v-model:value="filterForm.server"
              placeholder="请选择服务器"
              :options="serverOptions"
              style="width: 120px"
              allow-clear
              :field-names="{ label: 'label', value: 'label' }"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="applyFilter">筛选</a-button>
            <a-button style="margin-left: 8px" @click="resetFilter">重置</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <a-spin :spinning="loading">
      <a-list
        class="sekai-list-content"
        item-layout="vertical"
        size="large"
        :pagination="pagination"
        :data-source="sekaiList"
      >
        <template #renderItem="{ item }">
          <a-list-item key="item.id">
            <a-list-item-meta 
              :description="'心愿主: ' + (item.User?.username || '未知') + ' | 服务器: ' + (item.ServerRegion?.region || '未知')"
            >
              <template #title>
                <a @click="showDetail(item.SEKAIID || item.sekaiId)">{{ item['MySEKAI昵称ID'] || item.sekaiName }}</a>
              </template>
            </a-list-item-meta>
            <div class="sekai-description">
              {{ item['MySEKAI描述'] || item.description || '暂无描述' }}
            </div>
            <div class="sekai-info">
              <span>创建时间: {{ formatDate(item.createdAt) }}</span>
              <span>物品数量: {{ item.SekaiFixtures ? item.SekaiFixtures.length : 0 }}</span>
            </div>
          </a-list-item>
        </template>
      </a-list>
      
      <a-result v-if="!loading && sekaiList.length === 0" status="info" title="暂无SEKAI分享" sub-title="目前还没有用户分享SEKAI，你可以成为第一个分享者">
        <template #extra>
          <a-button v-if="userStore.isAuthenticated" type="primary" @click="showCreateModal">立即分享</a-button>
          <a-button v-else type="primary" @click="router.push('/login')">登录后分享</a-button>
        </template>
      </a-result>
    </a-spin>

    <!-- 创建SEKAI分享的模态框 -->
    <SekaiCreateModal 
      :visible="createModalVisible" 
      @close="closeCreateModal"
      @created="handleSekaiCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '../store'
import api from '../api'
import SekaiCreateModal from '../components/SekaiCreateModal.vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const sekaiList = ref([])
const createModalVisible = ref(false)
const fixtureOptions = ref([])
const serverOptions = ref([])

// 筛选表单
const filterForm = ref({
  fixtures: [],
  server: undefined
})

const pagination = {
  onChange: (page) => {
    console.log(page)
  },
  pageSize: 10
}

// 物品筛选选项过滤函数
const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN')
}

// 显示创建模态框
const showCreateModal = () => {
  createModalVisible.value = true
}

// 关闭创建模态框
const closeCreateModal = () => {
  createModalVisible.value = false
}

// 处理SEKAI创建完成事件
const handleSekaiCreated = () => {
  closeCreateModal()
  loadSekaiList()
  message.success('SEKAI分享创建成功')
}

// 加载SEKAI列表
const loadSekaiList = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/listSekais?qty=100')
    if (response.data.success) {
      sekaiList.value = response.data.data || []
    } else {
      message.error('获取SEKAI列表失败: ' + response.data.message)
      sekaiList.value = []
    }
  } catch (error) {
    message.error('获取SEKAI列表失败: ' + error.message)
    sekaiList.value = []
  } finally {
    loading.value = false
  }
}

// 显示详情
const showDetail = (sekaiId) => {
  if (sekaiId) {
    router.push({
      name: 'SekaiDetail',
      query: { SEKAIID: sekaiId }
    })
  }
}

// 获取物品列表用于筛选
const loadFixtures = async () => {
  try {
    const response = await api.get('/getFixtures')
    if (response.data) {
      fixtureOptions.value = response.data.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    message.error('获取物品列表失败: ' + error.message)
  }
}

// 获取服务器地区列表
const loadServerRegions = async () => {
  try {
    const response = await api.get('/api/server_regions')
    if (response.data.success && response.data.data) {
      serverOptions.value = response.data.data.map(region => ({
        label: region.region,
        value: region.serverid
      }))
    }
  } catch (error) {
    message.error('获取服务器地区列表失败: ' + error.message)
  }
}

// 应用筛选
const applyFilter = async () => {
  if (filterForm.value.fixtures.length === 0 && !filterForm.value.server) {
    // 如果没有筛选条件，加载所有列表
    loadSekaiList()
    return
  }

  loading.value = true
  try {
    const requestBody = {}
    
    // 添加物品筛选条件
    if (filterForm.value.fixtures.length > 0) {
      requestBody.fixtures = filterForm.value.fixtures
    }
    
    // 添加服务器筛选条件
    if (filterForm.value.server) {
      // 由于后端API期望的是serverid而不是region名称，我们需要转换一下
      const server = serverOptions.value.find(option => option.label === filterForm.value.server)
      requestBody.serverid = server ? server.value : filterForm.value.server
    }
    
    const response = await api.post('/api/lookup_sekai_by_fixtures', requestBody)
    
    if (response.data.success) {
      sekaiList.value = response.data.data || []
      message.success(`找到 ${sekaiList.value.length} 个符合条件的SEKAI`)
    } else {
      message.error('筛选失败: ' + response.data.message)
      sekaiList.value = []
    }
  } catch (error) {
    message.error('筛选失败: ' + error.message)
    sekaiList.value = []
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value.fixtures = []
  filterForm.value.server = undefined
  loadSekaiList()
}

onMounted(() => {
  loadSekaiList()
  loadFixtures()
  loadServerRegions()
})
</script>

<style scoped>
.sekai-list {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.sekai-list-content {
  margin-top: 20px;
}

.sekai-description {
  margin-bottom: 10px;
  color: #666;
}

.sekai-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}
</style>