<template>
  <div class="note-list-view">
    <div class="note-list-header">
      <h2>所有笔记</h2>
      <a-button type="primary" @click="createNewNote">
        <template #icon><icon-plus /></template>
        新建笔记
      </a-button>
    </div>

    <div class="note-filter">
      <a-radio-group type="button" v-model="currentFilter" @change="handleFilterChange">
        <a-radio value="all">全部</a-radio>
        <a-radio value="recent">最近更新</a-radio>
        <a-radio value="favorite">已收藏</a-radio>
      </a-radio-group>

      <a-dropdown>
        <a-button>
          排序方式
          <icon-down />
        </a-button>
        <template #content>
          <a-doption @click="setSortBy('createdAt')">创建时间</a-doption>
          <a-doption @click="setSortBy('updatedAt')">修改时间</a-doption>
          <a-doption @click="setSortBy('title')">标题</a-doption>
        </template>
      </a-dropdown>
    </div>

    <a-divider style="margin: 16px 0" />

    <div class="note-list">
      <a-spin :loading="isLoading">
        <a-empty v-if="filteredNotes.length === 0" description="没有找到笔记" />
        <a-list v-else :bordered="false" :data="filteredNotes">
          <template #item="{ item }">
            <a-list-item class="note-item" @click="goToNoteEdit(item.id)">
              <div class="note-content">
                <div class="note-title">{{ item.title }}</div>
                <div class="note-excerpt">{{ item.content.substring(0, 100) }}...</div>
                <div class="note-meta">
                  <span class="note-time">{{ formatDate(item.updatedAt) }}</span>
                  <a-space>
                    <a-tag v-for="tag in item.tags" :key="tag" color="arcoblue" size="small">{{
                      tag
                    }}</a-tag>
                  </a-space>
                </div>
              </div>
              <div class="note-actions">
                <a-button type="text" shape="circle" @click.stop="toggleFavorite(item.id)">
                  <template #icon>
                    <icon-star-fill v-if="item.isFavorite" style="color: #ffb400" />
                    <icon-star v-else />
                  </template>
                </a-button>
                <a-dropdown @select="handleAction($event, item)" trigger="click">
                  <a-button type="text" shape="circle" @click.stop>
                    <template #icon><icon-more-vertical /></template>
                  </a-button>
                  <template #content>
                    <a-doption value="edit">编辑</a-doption>
                    <a-doption value="delete">删除</a-doption>
                  </template>
                </a-dropdown>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  IconPlus,
  IconStar,
  IconStarFill,
  IconMoreVertical,
  IconDown,
} from "@arco-design/web-vue/es/icon";
import { Message, Modal } from "@arco-design/web-vue";
import { useNotesStore } from "@/store/notesStore";

const router = useRouter();
const notesStore = useNotesStore();

// 获取笔记状态
const { notes, isLoading, filteredNotes } = notesStore;
const currentFilter = ref("all");

// 加载笔记数据
onMounted(async () => {
  await notesStore.fetchNotes();
});

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 切换收藏状态
const toggleFavorite = async (noteId: string) => {
  await notesStore.toggleFavorite(noteId);
};

// 处理筛选变化
const handleFilterChange = (value: string) => {
  notesStore.setFilter(value);
};

// 设置排序方式
const setSortBy = (value: string) => {
  notesStore.setSortBy(value);
  Message.info(`已按${value === 'title' ? '标题' : value === 'createdAt' ? '创建时间' : '修改时间'}排序`);
};

// 处理笔记操作
const handleAction = (action: string, note: any) => {
  if (action === "edit") {
    goToNoteEdit(note.id);
  } else if (action === "delete") {
    Modal.warning({
      title: "确认删除",
      content: `确定要删除笔记 "${note.title}" 吗？`,
      okText: "删除",
      cancelText: "取消",
      onOk: async () => {
        const success = await notesStore.deleteNote(note.id);
        if (success) {
          Message.success("笔记已删除");
        }
      }
    });
  }
};

// 创建新笔记
const createNewNote = () => {
  router.push("/notes/edit");
};

// 跳转到笔记编辑页面
const goToNoteEdit = (noteId: string) => {
  router.push(`/notes/edit/${noteId}`);
};
</script>

<style scoped>
.note-list-view {
  padding: 16px;
}

.note-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.note-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.note-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.note-item:hover {
  background-color: var(--color-fill-2);
}

.note-content {
  flex: 1;
}

.note-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.note-excerpt {
  color: var(--color-text-3);
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-4);
  font-size: 12px;
}

.note-actions {
  display: flex;
  align-items: center;
}
</style>
