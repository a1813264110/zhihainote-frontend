<template>
  <div class="note-list-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <a-button type="primary" @click="createNewNote">
          <template #icon>
            <icon-plus />
          </template>
          新建笔记
        </a-button>
        <a-dropdown trigger="click">
          <a-button>
            <template #icon>
              <icon-filter />
            </template>
            筛选
          </a-button>
          <template #content>
            <a-doption @click="setSort('updateTime', 'descend')">
              <icon-sort-ascending v-if="notesStore.sortOrder === 'ascend'" />
              <icon-sort-descending v-else />
              按更新时间排序
            </a-doption>
            <a-doption @click="setSort('title', 'ascend')">
              <icon-sort-ascending />
              按标题排序
            </a-doption>
            <a-doption @click="notesStore.resetFilters">
              <icon-refresh />
              重置筛选
            </a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="right-actions">
        <a-radio-group
          type="button"
          v-model="displayMode"
          size="small"
        >
          <a-radio value="card">
            <template #radio="{ checked }">
              <icon-apps :style="{ color: checked ? '#165DFF' : '' }" />
            </template>
          </a-radio>
          <a-radio value="list">
            <template #radio="{ checked }">
              <icon-unordered-list :style="{ color: checked ? '#165DFF' : '' }" />
            </template>
          </a-radio>
        </a-radio-group>
      </div>
    </div>

    <!-- 笔记内容区域 -->
    <div class="note-content">
      <!-- 加载状态 -->
      <div class="loading-container" v-if="notesStore.loading">
        <a-spin dot />
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 空状态 -->
      <div class="empty-container" v-else-if="notesStore.notesList.length === 0">
        <a-empty description="暂无笔记">
          <template #image>
            <icon-file style="font-size: 64px; color: #c2c7d0" />
          </template>
          <a-button type="primary" @click="createNewNote">
            创建第一篇笔记
          </a-button>
        </a-empty>
      </div>

      <!-- 卡片视图 -->
      <div class="card-view" v-else-if="displayMode === 'card'">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="note in notesStore.notesList" :key="note.id">
            <a-card 
              class="note-card" 
              :bordered="false" 
              @click="viewNote(note)"
              :hoverable="true"
            >
              <template #title>
                <div class="card-title">{{ note.title }}</div>
              </template>
              <div class="card-tags" v-if="note.tagList && note.tagList.length">
                <a-tag 
                  v-for="tag in note.tagList" 
                  :key="tag" 
                  size="small"
                  color="arcoblue"
                >
                  {{ tag }}
                </a-tag>
              </div>
              <div class="card-content" v-if="note.content">
                {{ getContentPreview(note.content) }}
              </div>
              <template #actions>
                <a-button-group>
                  <a-button type="text" size="small" @click.stop="editNote(note)">
                    <template #icon><icon-edit /></template>
                  </a-button>
                  <a-button type="text" size="small" @click.stop="openTagsModal(note)">
                    <template #icon><icon-tag /></template>
                  </a-button>
                  <a-button type="text" size="small" @click.stop="deleteNote(note)">
                    <template #icon><icon-delete /></template>
                  </a-button>
                </a-button-group>
              </template>
              <div class="card-footer">
                <div class="update-time">{{ formatDate(note.updateTime) }}</div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 列表视图 -->
      <div class="list-view" v-else>
        <a-table 
          :data="notesStore.notesList" 
          :pagination="tablePagination"
          :loading="notesStore.loading"
          @page-change="onPageChange"
          @page-size-change="onPageSizeChange"
        >
          <template #columns>
            <a-table-column title="标题" data-index="title">
              <template #cell="{ record }">
                <div class="note-title" @click="viewNote(record)">
                  {{ record.title }}
                </div>
              </template>
            </a-table-column>
            <a-table-column title="更新时间" data-index="updateTime">
              <template #cell="{ record }">
                {{ formatDate(record.updateTime) }}
              </template>
            </a-table-column>
            <a-table-column title="标签" data-index="tagList">
              <template #cell="{ record }">
                <div class="tags">
                  <a-tag 
                    v-for="tag in record.tagList" 
                    :key="tag" 
                    size="small"
                    color="arcoblue"
                  >
                    {{ tag }}
                  </a-tag>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="操作" width="150">
              <template #cell="{ record }">
                <a-button-group>
                  <a-button type="text" size="small" @click="editNote(record)">
                    <template #icon><icon-edit /></template>
                  </a-button>
                  <a-button type="text" size="small" @click="openTagsModal(record)">
                    <template #icon><icon-tag /></template>
                  </a-button>
                  <a-button type="text" size="small" @click="deleteNote(record)">
                    <template #icon><icon-delete /></template>
                  </a-button>
                </a-button-group>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 标签管理弹窗 -->
    <a-modal
      v-model:visible="tagsModalVisible"
      title="管理标签"
      :footer="false"
      @cancel="closeTagsModal"
    >
      <div v-if="currentNote">
        <p>为 "{{ currentNote.title }}" 添加或移除标签</p>
        <a-space direction="vertical" style="width: 100%">
          <a-input-tag
            v-model="editingTags"
            placeholder="输入标签名称后回车"
            allow-clear
          />
          <a-button type="primary" @click="saveNoteTags">
            保存
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconFilter, 
  IconTag,
  IconApps,
  IconUnorderedList,
  IconSortAscending,
  IconSortDescending,
  IconRefresh,
  IconFile
} from '@arco-design/web-vue/es/icon';
import { Message, Modal } from '@arco-design/web-vue';
import { useNotesStore } from '@/store/notesStore';
import { useLoginUserStore } from '@/store/userStore';

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();
const userStore = useLoginUserStore();

// 笔记展示模式：卡片或列表
const displayMode = ref('card');

// 标签管理
const tagsModalVisible = ref(false);
const currentNote = ref<any>(null);
const editingTags = ref<string[]>([]);

// 分页
const tablePagination = computed(() => {
  return {
    current: notesStore.pagination.current,
    pageSize: notesStore.pagination.pageSize,
    total: notesStore.pagination.total,
    showTotal: true,
    showPageSize: true,
  };
});

// 页面初始化
onMounted(async () => {
  // 从URL获取搜索参数
  const searchQuery = route.query.search as string;
  if (searchQuery) {
    notesStore.setSearchText(searchQuery);
  }
  
  // 加载笔记列表
  await notesStore.fetchNotes();
});

// 当组件被keep-alive缓存后重新激活时触发
onActivated(async () => {
  console.log('笔记列表页面被激活，刷新数据');
  // 重新获取笔记列表，确保显示最新数据
  await notesStore.fetchNotes();
});

// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    const searchQuery = newQuery.search as string;
    notesStore.setSearchText(searchQuery || '');
    notesStore.fetchNotes();
  }
);

// 创建新笔记
const createNewNote = () => {
  // 检查用户是否登录
  if (userStore.loginUser.userRole === 'NOT_LOGIN') {
    router.push('/user/login');
    return;
  }
  
  // 直接跳转到新建笔记页面，让编辑页面处理初始化
  router.push('/notes/edit');
};

// 查看笔记
const viewNote = (note: any) => {
  console.log("查看笔记:", note);
  if (!note || !note.id) {
    Message.error('无效的笔记ID');
    return;
  }
  // 确保ID为字符串
  const noteId = String(note.id);
  console.log("跳转到笔记编辑页面，ID:", noteId);
  router.push(`/notes/edit/${noteId}`);
};

// 编辑笔记
const editNote = (note: any) => {
  console.log("编辑笔记:", note);
  if (!note || !note.id) {
    Message.error('无效的笔记ID');
    return;
  }
  // 确保ID为字符串
  const noteId = String(note.id);
  console.log("跳转到笔记编辑页面，ID:", noteId);
  router.push(`/notes/edit/${noteId}`);
};

// 删除笔记
const deleteNote = (note: any) => {
  Modal.confirm({
    title: '删除笔记',
    content: `确定要删除笔记 "${note.title}" 吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: {
      status: 'danger',
    },
    onOk: async () => {
      const result = await notesStore.moveToTrash(note.id!);
      if (result) {
        Message.success('笔记已移至回收站');
      }
    },
  });
};

// 打开标签管理弹窗
const openTagsModal = (note: any) => {
  currentNote.value = note;
  editingTags.value = [...(note.tagList || [])];
  tagsModalVisible.value = true;
};

// 关闭标签管理弹窗
const closeTagsModal = () => {
  currentNote.value = null;
  editingTags.value = [];
  tagsModalVisible.value = false;
};

// 保存笔记标签
const saveNoteTags = async () => {
  if (!currentNote.value) return;

  try {
    // 过滤掉空标签
    const filteredTags = editingTags.value.filter(tag => tag && tag.trim() !== '');
    
    // 如果过滤后与原始数组长度不同，说明有空标签被移除
    if (filteredTags.length !== editingTags.value.length) {
      console.log('已移除空标签');
      editingTags.value = filteredTags;
    }
    
    // 如果没有有效标签，不进行操作
    if (filteredTags.length === 0 && (currentNote.value.tagList || []).length === 0) {
      Message.info('没有添加任何标签');
      closeTagsModal();
      return;
    }
    
    // 获取当前笔记的原有标签
    const oldTags = [...(currentNote.value.tagList || [])];

    // 使用新的标签更新方法
    const result = await notesStore.updateNoteTags(
      currentNote.value.id,
      filteredTags,
      oldTags
    );

    if (result) {
      Message.success('标签更新成功');
      
      // 更新当前笔记对象的标签列表
      currentNote.value.tagList = [...filteredTags];
      
      // 重新获取笔记列表，确保数据最新
      notesStore.fetchNotes();
      
      closeTagsModal();
    } else {
      Message.error('标签更新失败');
    }
  } catch (error) {
    console.error('更新标签失败', error);
    Message.error('更新标签失败');
  }
};

// 设置排序
const setSort = (field: string, order: string) => {
  notesStore.setSort(field, order);
  notesStore.fetchNotes();
};

// 分页变化处理
const onPageChange = (current: number) => {
  notesStore.setPagination(current, notesStore.pagination.pageSize);
  notesStore.fetchNotes();
};

// 每页条数变化处理
const onPageSizeChange = (pageSize: number) => {
  notesStore.setPagination(1, pageSize);
  notesStore.fetchNotes();
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours} 小时前`;
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
};

// 获取内容预览
const getContentPreview = (content: string) => {
  // 移除Markdown语法，只展示纯文本
  const plainText = content
    .replace(/#+\s/g, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/`(.*?)`/g, '$1') // 代码
    .replace(/```([\s\S]*?)```/g, '') // 代码块
    .replace(/!\[(.*?)\]\(.*?\)/g, '[图片]') // 图片
    .replace(/\n/g, ' '); // 换行替换为空格
  
  return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
};
</script>

<style scoped>
.note-list-container {
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

.note-content {
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

.note-card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
}

.note-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tags {
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.card-content {
  color: var(--color-text-3);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: 14px;
  flex: 1;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
}

.update-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.note-title {
  color: var(--color-text-1);
  cursor: pointer;
  font-weight: 500;
}

.note-title:hover {
  color: rgb(var(--primary-6));
}
</style> 