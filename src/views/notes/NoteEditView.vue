<template>
  <div class="note-edit-view">
    <div class="note-edit-header">
      <div class="header-left">
        <a-button type="text" @click="handleBack">
          <template #icon><icon-left /></template>
          返回
        </a-button>
      </div>
      <div class="header-right">
        <a-space>
          <a-button @click="handleBack">取消</a-button>
          <a-button type="primary" :loading="isLoading" @click="saveNote">保存</a-button>
        </a-space>
      </div>
    </div>
    
    <a-spin :loading="isLoading" class="note-edit-content">
      <div class="title-wrapper">
        <a-input
          v-model="noteTitle"
          :style="{ width: '100%' }"
          placeholder="请输入标题..."
          allow-clear
          size="large"
          :max-length="100"
        />
      </div>
      
      <div class="tags-wrapper">
        <a-space>
          <a-tag 
            v-for="tag in noteTags" 
            :key="tag" 
            color="arcoblue" 
            closable
            @close="removeTag(tag)"
          >{{ tag }}</a-tag>
          <a-input
            v-if="showTagInput"
            v-model="newTagValue"
            size="mini"
            :style="{ width: '100px' }"
            placeholder="添加标签"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
            ref="tagInputRef"
          />
          <a-button v-else size="small" @click="showInput">
            <template #icon><icon-plus /></template>
            添加标签
          </a-button>
        </a-space>
      </div>
      
      <div class="editor-toolbar">
        <a-space>
          <a-button-group>
            <a-tooltip content="加粗">
              <a-button type="text" @click="insertMarkdown('**', '**')">
                <template #icon><icon-bold /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="斜体">
              <a-button type="text" @click="insertMarkdown('*', '*')">
                <template #icon><icon-italic /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="标题">
              <a-button type="text" @click="insertMarkdown('# ', '')">
                <template #icon><icon-h-1 /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
          
          <a-button-group>
            <a-tooltip content="无序列表">
              <a-button type="text" @click="insertMarkdown('- ', '')">
                <template #icon><icon-unordered-list /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="有序列表">
              <a-button type="text" @click="insertMarkdown('1. ', '')">
                <template #icon><icon-ordered-list /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
          
          <a-button-group>
            <a-tooltip content="链接">
              <a-button type="text" @click="insertMarkdown('[', '](链接地址)')">
                <template #icon><icon-link /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="图片">
              <a-button type="text" @click="insertMarkdown('![', '](图片链接)')">
                <template #icon><icon-image /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="代码块">
              <a-button type="text" @click="insertMarkdown('```\n', '\n```')">
                <template #icon><icon-code /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
        </a-space>
      </div>
      
      <div class="editor-container">
        <a-textarea
          v-model="noteContent"
          :style="{ width: '100%', height: '100%' }"
          placeholder="在此输入Markdown格式的笔记内容..."
          allow-clear
        />
      </div>
      
      <div class="editor-footer">
        <a-checkbox v-model="showPreview" @change="togglePreview">实时预览</a-checkbox>
        <div class="word-count">{{ noteContent.length }} 字符</div>
      </div>
    </a-spin>
    
    <a-modal v-model:visible="showPreviewModal" title="预览" fullscreen>
      <template #footer>
        <a-button @click="showPreviewModal = false">关闭</a-button>
      </template>
      <div class="markdown-preview">
        <!-- 实际项目可使用Markdown解析器 -->
        <pre>{{ noteContent }}</pre>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { 
  IconLeft, 
  IconPlus, 
  IconBold, 
  IconItalic, 
  IconH1,
  IconUnorderedList, 
  IconOrderedList, 
  IconLink, 
  IconImage, 
  IconCode 
} from '@arco-design/web-vue/es/icon';
import { useNotesStore, Note } from '@/store/notesStore';

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();

// 编辑状态
const isNewNote = computed(() => !route.params.id);
const noteId = computed(() => route.params.id as string);
const isLoading = ref(false);

// 笔记数据
const noteTitle = ref('');
const noteContent = ref('');
const noteTags = ref<string[]>([]);
const originalNote = ref<Note | null>(null);

// 标签编辑
const showTagInput = ref(false);
const newTagValue = ref('');
const tagInputRef = ref();

// 预览
const showPreview = ref(false);
const showPreviewModal = ref(false);

onMounted(async () => {
  // 如果是编辑已有笔记
  if (!isNewNote.value) {
    await loadNote(noteId.value);
  }
});

// 加载笔记数据
const loadNote = async (id: string) => {
  isLoading.value = true;
  try {
    const note = await notesStore.fetchNoteDetail(id);
    if (note) {
      originalNote.value = note;
      noteTitle.value = note.title;
      noteContent.value = note.content;
      noteTags.value = [...note.tags];
    } else {
      Message.error('笔记不存在');
      router.push('/notes');
    }
  } catch (error) {
    console.error('加载笔记失败:', error);
    Message.error('加载笔记失败');
  } finally {
    isLoading.value = false;
  }
};

// 保存笔记
const saveNote = async () => {
  if (!noteTitle.value.trim()) {
    Message.warning('标题不能为空');
    return;
  }

  isLoading.value = true;
  try {
    const noteData = {
      title: noteTitle.value,
      content: noteContent.value,
      tags: noteTags.value,
      isFavorite: originalNote.value?.isFavorite || false,
    };

    let success = false;
    if (isNewNote.value) {
      // 创建新笔记
      const newNote = await notesStore.createNote(noteData);
      success = !!newNote;
    } else {
      // 更新已有笔记
      success = await notesStore.updateNote(noteId.value, noteData);
    }

    if (success) {
      Message.success('笔记保存成功');
      router.push('/notes');
    }
  } catch (error) {
    console.error('保存笔记失败:', error);
    Message.error('保存笔记失败');
  } finally {
    isLoading.value = false;
  }
};

// 返回列表
const handleBack = () => {
  router.push('/notes');
};

// 显示标签输入框
const showInput = () => {
  showTagInput.value = true;
  nextTick(() => {
    tagInputRef.value?.focus();
  });
};

// 处理标签输入确认
const handleInputConfirm = () => {
  if (newTagValue.value && !noteTags.value.includes(newTagValue.value)) {
    noteTags.value.push(newTagValue.value);
  }
  showTagInput.value = false;
  newTagValue.value = '';
};

// 移除标签
const removeTag = (tag: string) => {
  const index = noteTags.value.indexOf(tag);
  if (index !== -1) {
    noteTags.value.splice(index, 1);
  }
};

// 切换预览
const togglePreview = (checked: boolean) => {
  if (checked) {
    showPreviewModal.value = true;
  }
};

// 插入Markdown语法
const insertMarkdown = (prefix: string, suffix: string) => {
  const textarea = document.querySelector('.editor-container textarea') as HTMLTextAreaElement;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = noteContent.value.substring(start, end);
  
  const beforeText = noteContent.value.substring(0, start);
  const afterText = noteContent.value.substring(end);
  
  noteContent.value = beforeText + prefix + selected + suffix + afterText;
  
  nextTick(() => {
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length + selected.length;
  });
};
</script>

<style scoped>
.note-edit-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border);
}

.note-edit-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title-wrapper {
  margin-bottom: 16px;
}

.tags-wrapper {
  margin-bottom: 16px;
}

.editor-toolbar {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: var(--color-bg-1);
  border-radius: 4px;
}

.editor-container {
  flex: 1;
  overflow: hidden;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 8px 0;
  color: var(--color-text-3);
}

.markdown-preview {
  padding: 16px;
  overflow: auto;
  max-height: 80vh;
  white-space: pre-wrap;
  font-family: var(--font-family);
}
</style> 