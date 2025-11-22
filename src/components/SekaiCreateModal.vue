<template>
  <a-modal
    v-model:visible="visible"
    title="分享我的SEKAI"
    width="600px"
    :maskClosable="false"
    :keyboard="false"
    ok-text="创建"
    @ok="handleOk"
    cancel-text="还是算了"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item
        label="SEKAI ID(玩家ID)"
        name="SEKAIID"
        :rules="[{ required: true, message: '请输入SEKAI ID!' }]"
      >
        <a-input v-model:value="formState.SEKAIID" placeholder="请输入SEKAI ID/玩家ID(好友码)" />
      </a-form-item>

      <a-form-item
        label="SEKAI名称"
        name="sekaiName"
        :rules="[{ required: true, message: '请输入SEKAI名称!' }]"
      >
        <a-input v-model:value="formState.sekaiName" placeholder="请输入SEKAI名称" />
      </a-form-item>

      <a-form-item
        label="服务器地区"
        name="serverRegionId"
        :rules="[{ required: true, message: '请选择服务器地区!' }]"
      >
        <a-select
          v-model:value="formState.serverRegionId"
          placeholder="请选择服务器地区"
          :options="regionOptions"
          :loading="regionsLoading"
        />
      </a-form-item>

      <a-form-item
        label="描述"
        name="description"
      >
        <a-textarea 
          v-model:value="formState.description" 
          placeholder="请输入SEKAI描述" 
          :rows="3" 
        />
      </a-form-item>

      <a-form-item
        label="物品列表"
        name="fixtures"
        :rules="[{ required: true, message: '请选择物品!' }]"
      >
        <a-select
          v-model:value="formState.fixtures"
          mode="multiple"
          placeholder="请选择物品"
          :options="fixtureOptions"
          :loading="fixturesLoading"
          show-search
          :filter-option="filterOption"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import api from '../api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const visible = ref(false)
const formRef = ref()
const fixturesLoading = ref(false)
const regionsLoading = ref(false)
const fixtureOptions = ref([])
const regionOptions = ref([])
const formState = ref({
  SEKAIID: '',
  sekaiName: '',
  serverRegionId: undefined,
  description: '',
  fixtures: []
})


// 物品筛选选项过滤函数
const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  visible.value = newVal
})

// 获取物品列表
const loadFixtures = async () => {
  fixturesLoading.value = true
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
  } finally {
    fixturesLoading.value = false
  }
}

// 获取服务器地区列表
const loadServerRegions = async () => {
  regionsLoading.value = true
  try {
    const response = await api.get('/api/server_regions')
    if (response.data.success) {
      if (response.data.data && response.data.data.length > 0) {
        regionOptions.value = response.data.data.map(region => ({
          label: region.region,
          value: region.serverid  // 注意这里使用serverid而不是id
        }))
      } else {
        // 如果没有服务器地区数据，提供默认选项
        regionOptions.value = [
          { label: '国服', value: 1 },
          { label: '日服', value: 2 },
          { label: '国际服', value: 3 }
        ]
        message.warning('未获取到服务器地区列表，使用默认选项')
      }
    } else {
      message.error('获取服务器地区列表失败: ' + response.data.message)
    }
  } catch (error) {
    // 如果API调用失败，提供默认选项
    regionOptions.value = [
      { label: '国服', value: 1 },
      { label: '日服', value: 2 },
      { label: '国际服', value: 3 }
    ]
    message.warning('获取服务器地区列表失败，使用默认选项')
  } finally {
    regionsLoading.value = false
  }
}

// 提交表单
const handleOk = async () => {
  try {
    await formRef.value.validateFields()
    
    // 检查是否选择了服务器地区
    if (!formState.value.serverRegionId) {
      message.error('请选择服务器地区')
      return
    }
    
    console.log('发送创建SEKAI请求');
    const response = await api.post('/api/add_sekai', {
      SEKAIID: formState.value.SEKAIID,
      sekaiName: formState.value.sekaiName,
      serverRegionId: formState.value.serverRegionId,
      description: formState.value.description,
      fixtures: formState.value.fixtures
    })

    if (response.data.success) {
      message.success('SEKAI分享创建成功')
      resetForm()
      emit('created')
    } else {
      message.error('创建失败: ' + response.data.message)
    }
  } catch (error) {
    console.error('创建SEKAI失败:', error);
    if (error.errorFields) {
      // 表单验证错误
      return
    }
    if (error.response && error.response.status === 401) {
      message.error('创建失败: 请先登录')
    } else {
      message.error('创建失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 取消
const handleCancel = () => {
  resetForm()
  emit('close')
  message.info('kitto todoku hazu')
}

// 重置表单
const resetForm = () => {
  formState.value = {
    SEKAIID: '',
    sekaiName: '',
    serverRegionId: undefined,
    description: '',
    fixtures: []
  }
  formRef.value?.resetFields()
}

onMounted(() => {
  loadFixtures()
  loadServerRegions()
})
</script>

<style scoped>
/* 移动端适配 */
@media (max-width: 768px) {
  .ant-modal {
    max-width: calc(100vw - 32px);
  }
  
  .ant-form-item-label {
    padding-right: 8px;
    white-space: normal;
    text-align: left;
  }
  
  .ant-select-selection-item {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .ant-modal {
    margin: 16px auto;
  }
  
  .ant-modal-header {
    padding: 12px 16px;
  }
  
  .ant-modal-body {
    padding: 16px;
  }
  
  .ant-modal-footer {
    padding: 10px 16px;
  }
  
  .ant-modal-title {
    font-size: 16px;
  }
  
  .ant-form-item-label {
    padding-bottom: 4px;
  }
  
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-select-selector {
    padding: 6px 11px;
  }
  
  .ant-btn {
    height: 32px;
    font-size: 14px;
    padding: 0 15px;
  }
}
</style>
