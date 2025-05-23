<template>
  <div class="note-item rounded-md shadow-light p-md hover-lift hover-shadow" @click="handleNoteClick">
    <div class="note-content">
      <div class="note-title text-md font-medium text-primary text-ellipsis mb-xs">
        {{ note.title || '无标题笔记' }}
      </div>
      <div class="note-preview text-sm text-secondary mb-sm" v-if="note.content">
        {{ contentPreview }}
      </div>
      <div class="note-meta flex items-center gap-sm flex-wrap">
        <span class="note-time text-xs text-tertiary">{{ formattedTime }}</span>
        <div class="note-tags flex flex-wrap gap-xs" v-if="note.tagList && note.tagList.length">
          <a-tag 
            v-for="tag in note.tagList" 
            :key="tag" 
            size="small"
            @click.stop
          >
            {{ tag }}
          </a-tag>
        </div>
      </div>
    </div>
    <div class="note-actions ml-md" @click.stop>
      <a-space>
        <a-button
          type="text"
          size="small"
          @click="$emit('edit', note)"
        >
          <template #icon><icon-edit /></template>
        </a-button>
        <a-button
          type="text"
          size="small"
          @click="$emit('tag', note)"
        >
          <template #icon><icon-tag /></template>
        </a-button>
        <a-button
          type="text"
          size="small"
          @click="$emit('delete', note)"
        >
          <template #icon><icon-delete /></template>
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconEdit, IconTag, IconDelete } from '@arco-design/web-vue/es/icon';

// 定义组件属性
const props = defineProps({
  note: {
    type: Object,
    required: true
  }
});

// 定义组件事件
const emit = defineEmits(['click', 'edit', 'tag', 'delete']);

// 计算内容预览
const contentPreview = computed(() => {
  if (!props.note.content) return '';
  
  // 移除Markdown语法，只展示纯文本
  const plainText = props.note.content
    .replace(/#+\s/g, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/`(.*?)`/g, '$1') // 代码
    .replace(/```([\s\S]*?)```/g, '') // 代码块
    .replace(/!\[(.*?)\]\(.*?\)/g, '[图片]') // 图片
    .replace(/\n/g, ' '); // 换行替换为空格
  
  return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
});

// 计算格式化时间
const formattedTime = computed(() => {
  if (!props.note.updateTime) return '';
  
  const date = new Date(props.note.updateTime);
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
});

// 处理笔记点击
const handleNoteClick = () => {
  emit('click', props.note);
};
</script>

<style scoped>
.note-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-bottom: var(--spacing-sm);
  background-color: var(--bg-secondary);
}

.note-content {
  flex: 1;
  overflow: hidden;
}

.note-preview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.note-actions {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.note-item:hover .note-actions {
  opacity: 1;
}
</style> 