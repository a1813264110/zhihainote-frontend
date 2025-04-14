<template>
  <div class="note-edit-container">
    <!-- 标题栏 -->
    <div class="title-bar">
      <a-input
        v-model="title"
        placeholder="无标题笔记"
        :style="{ fontSize: '20px', border: 'none', padding: '0' }"
        :max-length="100"
        @change="onContentChange"
      />
      <div class="actions">
        <a-space>
          <a-button type="text" @click="handleTagsClick">
            <template #icon>
              <icon-tag />
            </template>
            标签
          </a-button>
          <a-button type="primary" @click="saveNote" :disabled="!contentChanged">
            <template #icon>
              <icon-save />
            </template>
            保存
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container">
      <a-textarea
        v-model="content"
        placeholder="开始输入笔记内容..."
        :auto-size="{ minRows: 15, maxRows: 20 }"
        allow-clear
        @change="onContentChange"
      />
    </div>

    <!-- 标签管理弹窗 -->
    <a-modal
      v-model:visible="tagsModalVisible"
      title="管理标签"
      :footer="false"
      @cancel="closeTagsModal"
    >
      <a-space direction="vertical" style="width: 100%">
        <a-input-tag v-model="tags" placeholder="输入标签名称后回车" allow-clear />
        <a-button type="primary" @click="applyTags"> 应用标签 </a-button>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter, RouteLocationNormalized } from "vue-router";
import { Message, Modal } from "@arco-design/web-vue";
import { IconTag, IconSave } from "@arco-design/web-vue/es/icon";
import { useNotesStore } from "@/store/notesStore";
import { useLoginUserStore } from "@/store/userStore";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const userStore = useLoginUserStore();

// 笔记ID
const noteId = ref(route.params.id as string | undefined);
// 笔记标题
const title = ref("");
// 笔记内容
const content = ref("");
// 标签
const tags = ref<string[]>([]);
// 内容是否已更改
const contentChanged = ref(false);
// 标签弹窗可见性
const tagsModalVisible = ref(false);
// 加载状态
const loading = ref(false);
// 原始标签
const originalTags = ref<string[]>([]);

// 当用户访问时检查登录状态
onMounted(async () => {
  if (userStore.loginUser.userRole === "NOT_LOGIN") {
    Message.error("请先登录");
    router.push("/user/login");
    return;
  }

  console.log("组件挂载，笔记ID:", noteId.value);

  // 如果是编辑现有笔记
  if (noteId.value) {
    loading.value = true;
    try {
      console.log("准备获取笔记，ID:", noteId.value);
      const note = await notesStore.fetchNoteById(noteId.value);
      console.log("获取到笔记数据:", note);
      
      if (note) {
        title.value = note.title || "";
        content.value = note.content || "";
        tags.value = note.tagList || [];
        originalTags.value = [...tags.value];
        contentChanged.value = false;
      } else {
        console.error("未找到笔记数据，ID:", noteId.value);
        Message.error("获取笔记失败");
        router.push("/notes");
      }
    } catch (error) {
      console.error("获取笔记失败", error);
      Message.error("获取笔记失败");
      router.push("/notes");
    } finally {
      loading.value = false;
    }
  } else {
    // 新建笔记时，初始化默认内容
    title.value = "新笔记";
    content.value = "";
    tags.value = [];
    originalTags.value = [];
    // 将内容标记为已修改，这样保存按钮可以点击
    contentChanged.value = true;
  }
});

// 监听URL变化
watch(
  () => route.params.id,
  async (newId) => {
    console.log("URL参数变化，新ID:", newId, "当前ID:", noteId.value);
    
    if (newId !== undefined && newId !== noteId.value) {
      noteId.value = newId as string;
      console.log("更新noteId.value为:", noteId.value);
      
      // 加载新的笔记数据
      loading.value = true;
      try {
        console.log("准备获取新笔记，ID:", noteId.value);
        const note = await notesStore.fetchNoteById(noteId.value);
        console.log("获取到新笔记数据:", note);
        
        if (note) {
          title.value = note.title || "";
          content.value = note.content || "";
          tags.value = note.tagList || [];
          originalTags.value = [...tags.value];
          contentChanged.value = false;
        } else {
          console.error("未找到新笔记数据，ID:", noteId.value);
        }
      } catch (error) {
        console.error("获取新笔记失败", error);
      } finally {
        loading.value = false;
      }
    }
  }
);

// 保存笔记
const saveNote = async () => {
  if (!title.value && !content.value) {
    Message.warning("标题和内容不能都为空");
    return;
  }

  // 过滤掉空标签
  const filteredTags = tags.value.filter(tag => tag && tag.trim() !== '');
  
  // 如果过滤后与原始数组长度不同，说明有空标签被移除
  if (filteredTags.length !== tags.value.length) {
    console.log('已移除空标签');
    tags.value = filteredTags;
  }

  loading.value = true;
  try {
    if (noteId.value) {
      // 更新现有笔记内容（不更新标签）
      const contentResult = await notesStore.editNote(
        noteId.value,
        title.value,
        content.value,
        []  // 不通过editNote更新标签，使用专门的标签API
      );
      
      if (contentResult) {
        // 单独更新标签
        const oldTags = [...originalTags.value];
        const tagsResult = await notesStore.updateNoteTags(
          noteId.value,
          filteredTags,
          oldTags
        );
        
        if (tagsResult) {
          // 更新原始标签列表
          originalTags.value = [...filteredTags];
        } else {
          console.error("标签更新失败");
        }
        
        // 尝试刷新笔记列表中的数据
        notesStore.fetchNotes();
        Message.success("笔记已保存");
        contentChanged.value = false;
      }
    } else {
      // 创建新笔记
      try {
        // 先创建不带标签的笔记
        const result = await notesStore.addNote(title.value, content.value, []);
        
        if (result) {
          // 根据返回类型安全地获取ID
          let newNoteId: string | number = "";
          
          if (typeof result === "string") {
            newNoteId = result;
          } else if (typeof result === "number") {
            newNoteId = result;
          } else if (result && typeof result === "object" && "id" in result) {
            newNoteId = (result as { id: string | number }).id;
          }
          
          if (newNoteId) {
            // 更新URL以反映新的笔记ID
            router.replace(`/notes/edit/${newNoteId}`);
            noteId.value = String(newNoteId);
            
            // 单独添加标签
            if (filteredTags.length > 0) {
              const tagsResult = await notesStore.updateNoteTags(
                String(newNoteId),
                filteredTags,
                []
              );
              
              if (tagsResult) {
                // 更新原始标签列表
                originalTags.value = [...filteredTags];
              } else {
                console.error("标签添加失败");
              }
            }
            
            // 尝试刷新笔记列表中的数据
            notesStore.fetchNotes();
            Message.success("笔记已创建");
            contentChanged.value = false;
          } else {
            console.error("无法获取笔记ID", result);
          }
        }
      } catch (error) {
        console.error("创建笔记失败", error);
        // 不显示错误弹窗，只在控制台记录错误
      }
    }
  } catch (error) {
    console.error("保存笔记失败", error);
    // 不显示错误弹窗，只在控制台记录错误
  } finally {
    loading.value = false;
  }
};

// 内容变更处理
const onContentChange = () => {
  contentChanged.value = true;
};

// 标签点击处理
const handleTagsClick = () => {
  tagsModalVisible.value = true;
};

// 关闭标签弹窗
const closeTagsModal = () => {
  tagsModalVisible.value = false;
};

// 应用标签
const applyTags = async () => {
  contentChanged.value = true;
  
  // 过滤掉空标签
  const filteredTags = tags.value.filter(tag => tag && tag.trim() !== '');
  
  // 如果过滤后与原始数组长度不同，说明有空标签被移除
  if (filteredTags.length !== tags.value.length) {
    console.log('已移除空标签');
    tags.value = filteredTags;
  }
  
  // 如果已经有笔记ID，立即保存标签更改
  if (noteId.value) {
    try {
      // 首先保存笔记内容，确保笔记存在
      const saveResult = await notesStore.editNote(
        noteId.value,
        title.value,
        content.value,
        []  // 不通过editNote更新标签，使用专门的标签API
      );
      
      if (saveResult) {
        // 保存笔记后，使用专门的标签API更新标签
        const oldTags = [...originalTags.value]; // 使用保存的原始标签列表
        const result = await notesStore.updateNoteTags(
          noteId.value,
          filteredTags,
          oldTags
        );
        
        if (result) {
          // 更新原始标签列表，以便下次比较
          originalTags.value = [...filteredTags];
          Message.success("标签已更新");
        } else {
          Message.error("标签更新失败");
        }
      }
    } catch (error) {
      console.error("更新标签失败", error);
      Message.error("更新标签失败");
    }
  }
  
  tagsModalVisible.value = false;
};

// 离开页面前询问是否保存
const beforeRouteLeave = (
  to: RouteLocationNormalized, 
  from: RouteLocationNormalized, 
  next: Function
) => {
  if (contentChanged.value) {
    Modal.confirm({
      title: "是否保存更改",
      content: "您的笔记内容已更改，是否保存？",
      okText: "保存",
      cancelText: "不保存",
      okButtonProps: {
        status: "success",
      },
      async onOk() {
        await saveNote();
        next();
      },
      onCancel() {
        next();
      },
    });
  } else {
    next();
  }
};
</script>

<style scoped>
.note-edit-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-2);
}

.title-bar {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-3);
}

.actions {
  display: flex;
  gap: 8px;
}

.editor-container {
  flex: 1;
  padding: 16px 0;
  overflow: auto;
}
</style>
