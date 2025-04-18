<template>
  <div class="tag-list-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <a-button type="primary" @click="openCreateTagModal">
          <template #icon>
            <icon-plus />
          </template>
          新建标签
        </a-button>
        <a-dropdown trigger="click">
          <a-button>
            <template #icon>
              <icon-filter />
            </template>
            筛选
          </a-button>
          <template #content>
            <a-doption @click="setSort('usageCount', 'descend')">
              <icon-sort-descending />
              按使用频率排序
            </a-doption>
            <a-doption @click="setSort('createTime', 'descend')">
              <icon-sort-descending />
              按创建时间排序
            </a-doption>
            <a-doption @click="setSort('name', 'ascend')">
              <icon-sort-ascending />
              按名称排序
            </a-doption>
            <a-doption @click="tagsStore.resetFilters">
              <icon-refresh />
              重置筛选
            </a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="right-actions">
        <a-input-search
          v-model="searchText"
          placeholder="搜索标签..."
          search-button
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- 标签内容区域 -->
    <div class="tag-content">
      <!-- 加载状态 -->
      <div class="loading-container" v-if="tagsStore.loading">
        <a-spin dot />
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 空状态 -->
      <div class="empty-container" v-else-if="tagsStore.tagsList.length === 0">
        <a-empty description="暂无标签">
          <template #image>
            <icon-tag style="font-size: 64px; color: #c2c7d0" />
          </template>
          <a-button type="primary" @click="openCreateTagModal">
            创建第一个标签
          </a-button>
        </a-empty>
      </div>

      <!-- 标签卡片视图 -->
      <a-row :gutter="[16, 16]" v-else>
        <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tag in tagsStore.tagsList" :key="tag.id">
          <a-card 
            class="tag-card" 
            :bordered="false"
            :hoverable="true"
            @click="viewTagDetail(tag)"
          >
            <template #title>
              <div class="card-title">
                <a-tag :style="{ backgroundColor: tag.color || '#165DFF' }">
                  {{ tag.name }}
                </a-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="tag-stats">
                <div>使用次数: {{ tag.usageCount || 0 }}</div>
                <div>创建时间: {{ formatDate(tag.createTime) }}</div>
              </div>
            </div>
            <template #actions>
              <a-button-group>
                <a-button type="text" size="small" @click.stop="openEditTagModal(tag)">
                  <template #icon><icon-edit /></template>
                </a-button>
                <a-button type="text" size="small" @click.stop="openDeleteConfirm(tag)">
                  <template #icon><icon-delete /></template>
                </a-button>
              </a-button-group>
            </template>
          </a-card>
        </a-col>
      </a-row>

      <!-- 分页 -->
      <div class="pagination-container" v-if="tagsStore.tagsList.length > 0">
        <a-pagination
          v-model:current="tagsStore.pagination.current"
          v-model:page-size="tagsStore.pagination.pageSize"
          :total="tagsStore.pagination.total"
          show-total
          show-jumper
          show-page-size
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 新建/编辑标签弹窗 -->
    <a-modal
      v-model:visible="tagModalVisible"
      :title="isEditMode ? '编辑标签' : '新建标签'"
      @cancel="closeTagModal"
      @before-ok="handleTagModalOk"
    >
      <a-form :model="tagForm" ref="tagFormRef" auto-label-width>
        <a-form-item field="name" label="标签名称" :rules="[{ required: true, message: '请输入标签名称' }]">
          <a-input v-model="tagForm.name" placeholder="请输入标签名称" allow-clear />
        </a-form-item>
        <a-form-item field="color" label="标签颜色">
          <a-color-picker v-model="tagForm.color" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconFilter,
  IconTag,
  IconSortAscending,
  IconSortDescending,
  IconRefresh
} from '@arco-design/web-vue/es/icon';
import { Message, Modal } from '@arco-design/web-vue';
import { useTagsStore } from '@/store/tagsStore';
import { useLoginUserStore } from '@/store/userStore';

const router = useRouter();
const tagsStore = useTagsStore();
const userStore = useLoginUserStore();

// 搜索文本
const searchText = ref('');
// 标签表单
const tagForm = ref({
  id: '',
  name: '',
  color: '#165DFF'
});
// 标签表单引用
const tagFormRef = ref();
// 标签弹窗可见性
const tagModalVisible = ref(false);
// 是否为编辑模式
const isEditMode = ref(false);

// 页面初始化
onMounted(async () => {
  // 检查用户是否登录
  if (userStore.loginUser.userRole === 'NOT_LOGIN') {
    Message.error('请先登录');
    router.push('/user/login');
    return;
  }
  
  // 加载标签列表
  await tagsStore.fetchTags();
});

// 监听搜索文本变化
watch(searchText, (newValue) => {
  tagsStore.setSearchText(newValue);
});

// 处理搜索
const handleSearch = () => {
  console.log("执行搜索，搜索文本:", searchText.value);
  // 确保更新store中的搜索文本
  tagsStore.setSearchText(searchText.value.trim());
  // 请求标签列表
  tagsStore.fetchTags();
};

// 设置排序
const setSort = (field: string, order: string) => {
  tagsStore.setSort(field, order);
  tagsStore.fetchTags();
};

// 分页变化处理
const handlePageChange = (current: number) => {
  tagsStore.setPagination(current, tagsStore.pagination.pageSize);
  tagsStore.fetchTags();
};

// 每页条数变化处理
const handlePageSizeChange = (pageSize: number) => {
  tagsStore.setPagination(1, pageSize);
  tagsStore.fetchTags();
};

// 打开新建标签弹窗
const openCreateTagModal = () => {
  isEditMode.value = false;
  tagForm.value = {
    id: '',
    name: '',
    color: '#165DFF'
  };
  tagModalVisible.value = true;
};

// 打开编辑标签弹窗
const openEditTagModal = (tag: any) => {
  isEditMode.value = true;
  tagForm.value = {
    id: tag.id || '',
    name: tag.name || '',
    color: tag.color || '#165DFF'
  };
  tagModalVisible.value = true;
};

// 关闭标签弹窗
const closeTagModal = () => {
  tagModalVisible.value = false;
  // 重置表单
  if (tagFormRef.value) {
    tagFormRef.value.resetFields();
  }
};

// 处理标签弹窗确认
const handleTagModalOk = async (done: Function) => {
  // 先获取表单引用，并进行验证
  if (!tagFormRef.value) {
    console.error("表单引用不存在");
    done(false);
    return;
  }
  
  // 输出当前表单值，帮助诊断
  console.log("当前表单值:", tagForm.value);
  
  try {
    // 手动触发表单验证
    await tagFormRef.value.validate();
    
    // 二次检查表单值（确保有值且不全是空格）
    if (!tagForm.value.name || tagForm.value.name.trim() === '') {
      console.error("手动检查发现标签名称为空");
      Message.error('标签名称不能为空');
      done(false);
      return;
    }

    // 记录即将提交的值
    console.log("准备提交标签:", {
      id: tagForm.value.id,
      name: tagForm.value.name,
      color: tagForm.value.color
    });
    
    let result;
    if (isEditMode.value) {
      // 编辑标签
      result = await tagsStore.editTag(
        tagForm.value.id, 
        tagForm.value.name, 
        tagForm.value.color
      );
    } else {
      // 创建标签
      result = await tagsStore.addTag(
        tagForm.value.name, 
        tagForm.value.color
      );
    }

    if (result) {
      done();
    } else {
      done(false);
    }
  } catch (error: any) {
    console.error('表单验证或标签操作失败', error);
    Message.error(error.message || '标签操作失败');
    done(false);
  }
};

// 打开删除确认
const openDeleteConfirm = (tag: any) => {
  Modal.confirm({
    title: '删除标签',
    content: `确定要删除标签 "${tag.name}" 吗？这将移除所有笔记上的该标签。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: {
      status: 'danger',
    },
    onOk: async () => {
      const result = await tagsStore.deleteTag(tag.id);
      if (result) {
        Message.success('标签已删除');
      }
    },
  });
};

// 查看标签详情
const viewTagDetail = (tag: any) => {
  // 添加详细的日志
  console.log("=== viewTagDetail 被调用 ===");
  console.log("传入标签:", tag);
  
  if (!tag || !tag.id) {
    console.error("标签ID无效:", tag);
    Message.error('无效的标签ID');
    return;
  }
  
  // 添加随机标识符，确保是独特的请求
  const randomId = Math.floor(Math.random() * 100000);
  const tagId = String(tag.id);
  
  console.log(`准备导航, 标签ID: ${tagId}, 随机码: ${randomId}`);
  
  // 方法1：使用新的导航URI格式和replace选项
  try {
    console.log("=== 尝试方法1: 使用replace=true ===");
    const path = `/tags/detail/${tagId}?random=${randomId}&method=1`;
    console.log(`导航到: ${path}`);
    
    router.push({
      path: path,
      replace: true // 替换当前历史记录
    });
  } catch (error) {
    console.error("方法1失败:", error);
    
    // 方法2：使用原生window.location
    try {
      console.log("=== 尝试方法2: 使用window.location ===");
      // 构建完整的URL (确保基础URL正确)
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/#/tags/detail/${tagId}?random=${randomId}&method=2`;
      console.log(`导航到: ${fullUrl}`);
      
      // 使用原生JS导航
      window.location.href = fullUrl;
    } catch (secondError) {
      console.error("方法2也失败:", secondError);
      Message.error('导航到标签详情页失败');
    }
  }
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.tag-list-container {
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 10px;
}

.right-actions {
  width: 240px;
}

.tag-content {
  flex: 1;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-text {
  margin-top: 20px;
  color: var(--color-text-3);
}

.empty-container {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.tag-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
}

.tag-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
}

.card-content {
  flex: 1;
}

.tag-stats {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 