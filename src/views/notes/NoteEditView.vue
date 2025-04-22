<template>
  <div class="note-edit-container">
    <!-- 标题栏 -->
    <div class="title-bar">
      <div class="title-wrapper">
        <div class="title-decorator"></div>
        <a-input
          v-model="title"
          placeholder="无标题笔记"
          :style="{
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            padding: '0',
            backgroundColor: 'transparent',
          }"
          :max-length="100"
          @change="onContentChange"
        />
      </div>
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
      <!-- Basic Tiptap Toolbar -->
      <div v-if="editor" class="editor-toolbar">
        <a-space>
          <a-button
            size="mini"
            :type="editor.isActive('bold') ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <template #icon><icon-bold /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('italic') ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <template #icon><icon-italic /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('heading', { level: 1 }) ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            <template #icon><icon-h1 /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('heading', { level: 2 }) ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            <template #icon><icon-h2 /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('heading', { level: 3 }) ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            <template #icon><icon-h3 /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('heading', { level: 4 }) ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          >
            <template #icon><icon-h4 /></template>
          </a-button>
          <!-- 列表 -->
          <a-button
            size="mini"
            :type="editor.isActive('bulletList') ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <template #icon><icon-list /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive('orderedList') ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <template #icon><icon-list /></template>
            <!-- Reusing icon for ordered list -->
          </a-button>
          <!-- 左、中、右对齐 -->
          <a-button
            size="mini"
            :type="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'"
            @click="editor.chain().focus().setTextAlign('left').run()"
          >
            <template #icon><icon-align-left /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'"
            @click="editor.chain().focus().setTextAlign('center').run()"
          >
            <template #icon><icon-align-center /></template>
          </a-button>
          <a-button
            size="mini"
            :type="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'"
            @click="editor.chain().focus().setTextAlign('right').run()"
          >
            <template #icon><icon-align-right /></template>
          </a-button>

          <!-- 代码块 -->
          <a-button
            size="mini"
            :type="editor.isActive('codeBlock') ? 'primary' : 'text'"
            @click="editor.chain().focus().toggleCodeBlock().run()"
          >
            <template #icon><icon-code-block /></template>
          </a-button>
        </a-space>
      </div>
      <!-- Tiptap Editor Content Area -->
      <editor-content :editor="editor" class="tiptap-editor" />
    </div>

    <!-- 标签管理弹窗 -->
    <a-modal
      v-model:visible="tagsModalVisible"
      title="管理标签"
      :footer="false"
      @cancel="closeTagsModal"
    >
      <a-space direction="vertical" style="width: 100%">
        <div class="tag-input-container">
          <div class="selected-tags">
            <a-tag
              v-for="tag in tags"
              :key="tag"
              :style="getTagStyle(tag)"
              closable
              @close="removeTag(tag)"
            >
              {{ tag }}
            </a-tag>
          </div>
          <div class="tag-input">
            <a-input
              v-model="tagInput"
              placeholder="输入标签名称，回车添加"
              @keyup.enter="handleTagInputConfirm"
            />
            <div v-if="suggestedTags.length > 0" class="tag-suggestions">
              <div
                v-for="suggestion in suggestedTags"
                :key="suggestion.name"
                class="tag-suggestion-item"
                @click="selectSuggestion(suggestion)"
              >
                <a-tag :style="{ backgroundColor: suggestion.color || '#165DFF' }">
                  {{ suggestion.name }}
                </a-tag>
              </div>
            </div>
          </div>
        </div>
        <a-button type="primary" @click="applyTags"> 应用标签 </a-button>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter, RouteLocationNormalized } from "vue-router";
import { Message, Modal } from "@arco-design/web-vue";
import {
  IconTag,
  IconSave,
  IconCodeBlock,
  IconBold,
  IconItalic,
  IconList,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
} from "@arco-design/web-vue/es/icon";
import { useNotesStore } from "@/store/notesStore";
import { useLoginUserStore } from "@/store/userStore";
import { addTagToNoteUsingPost } from "@/api/noteTagsController";
// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const userStore = useLoginUserStore();

// 笔记ID
const noteId = ref(route.params.noteId as string | undefined);
// 笔记标题
const title = ref("");
// 笔记内容
const content = ref("");
// 标签
const tags = ref<string[]>([]);
// Tiptap editor instance
const editor = useEditor({
  content: content.value, // Initialize with content
  extensions: [
    StarterKit,
    Highlight,
    Typography,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ],
  onUpdate: ({ editor }) => {
    // Sync editor content back to the ref
    content.value = editor.getHTML();
    // Trigger change detection
    onContentChange();
  },
});

// Watch for external changes to content (e.g., loading a note)
watch(content, (newValue) => {
  // Check if editor exists and if the new value is different from the editor's current content
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false); // Update editor content without emitting update event
  }
});

// Ensure editor is destroyed when component unmounts
onBeforeUnmount(() => {
  editor.value?.destroy();
});

// 标签输入值
const tagInput = ref("");
// 标签建议列表
const suggestedTags = ref<any[]>([]);
// 标签颜色映射
const tagColorMap = ref<Record<string, string>>({});
// 内容是否已更改
const contentChanged = ref(false);
// 标签弹窗可见性
const tagsModalVisible = ref(false);
// 加载状态
const loading = ref(false);
// 原始标签
const originalTags = ref<string[]>([]);
// 本地缓存的所有标签列表
const allTagsCache = ref<any[]>([]);

// 当用户访问时检查登录状态
onMounted(async () => {
  if (userStore.loginUser.userRole === "NOT_LOGIN") {
    Message.error("请先登录");
    router.push("/user/login");
    return;
  }

  console.log("NoteEditView组件挂载，路由参数:", route.params);
  console.log("当前笔记ID:", noteId.value, "类型:", typeof noteId.value);

  // 预加载所有标签，避免后续每次输入都请求
  await fetchAllTags();

  // 如果是编辑现有笔记
  if (noteId.value) {
    await loadNoteData(noteId.value);
  } else {
    // 新建笔记时，初始化默认内容
    console.log("创建新笔记模式");
    title.value = "新笔记";
    content.value = "";
    tags.value = [];
    originalTags.value = [];
    // 将内容标记为已修改，这样保存按钮可以点击
    contentChanged.value = true;
  }
});

// 提取笔记加载逻辑到单独的函数，便于重用
const loadNoteData = async (noteId: string) => {
  loading.value = true;
  try {
    console.log("准备获取笔记，ID:", noteId);
    const note = await notesStore.fetchNoteById(noteId);
    console.log("获取到笔记数据:", note);

    if (note) {
      title.value = note.title || "";
      content.value = note.content || "";

      // 获取笔记关联的所有标签
      const noteTags = await notesStore.getTagsByNoteId(noteId);
      console.log("获取到笔记关联的标签:", noteTags);

      // 如果能获取到标签信息，优先使用专门API返回的标签
      if (noteTags && noteTags.length > 0) {
        // 处理标签信息，提取标签名称
        tags.value = noteTags.map((tag) => tag.name || "").filter((name) => name);
      } else if (note.tagList && note.tagList.length > 0) {
        // 否则使用笔记数据中的标签
        tags.value = note.tagList;
      } else {
        tags.value = [];
      }

      // 更新标签颜色映射
      if (noteTags) {
        noteTags.forEach((tag) => {
          if (tag.name && tag.color) {
            tagColorMap.value[tag.name] = tag.color;
          }
        });
      }

      originalTags.value = [...tags.value];
      contentChanged.value = false;
      console.log("笔记数据加载成功，标题:", title.value, "标签:", tags.value);
    } else {
      console.error("未找到笔记数据，ID:", noteId);
      Message.error("获取笔记失败");
      // 延迟跳转，确保信息显示
      setTimeout(() => router.push("/notes"), 100);
    }
  } catch (error) {
    console.error("获取笔记失败", error);
    Message.error("获取笔记失败");
    // 延迟跳转，确保信息显示
    setTimeout(() => router.push("/notes"), 100);
  } finally {
    loading.value = false;
  }
};

// 修改路由参数监听，使用提取的加载函数
watch(
  () => route.params.noteId,
  async (newId, oldId) => {
    console.log("URL参数变化，新ID:", newId, "旧ID:", oldId);

    if (newId !== undefined && newId !== oldId) {
      noteId.value = String(newId);
      console.log("更新noteId.value为:", noteId.value, "类型:", typeof noteId.value);

      // 使用同一个函数加载笔记数据，保持逻辑一致
      await loadNoteData(noteId.value);
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
  const filteredTags = tags.value.filter((tag) => tag && tag.trim() !== "");

  loading.value = true;
  try {
    let noteIdToUse: string = noteId.value || "";

    // 步骤1: 保存笔记内容
    if (noteId.value) {
      // 更新现有笔记内容（不更新标签）
      const contentResult = await notesStore.editNote(
        noteId.value,
        title.value,
        content.value,
        [] // 不通过editNote更新标签，使用专门的标签API
      );

      if (!contentResult) {
        throw new Error("笔记内容保存失败");
      }
    } else {
      // 创建新笔记
      const result = await notesStore.addNote(title.value, content.value, []);

      if (!result) {
        throw new Error("创建笔记失败");
      }

      // 获取新笔记ID
      if (typeof result === "string") {
        noteIdToUse = result;
      } else if (typeof result === "number") {
        noteIdToUse = String(result);
      } else if (result && typeof result === "object" && "id" in result) {
        noteIdToUse = String((result as { id: string | number }).id);
      } else {
        throw new Error("无法获取新笔记ID");
      }

      // 更新URL和本地ID
      router.replace(`/notes/edit/${noteIdToUse}`);
      noteId.value = noteIdToUse;
    }

    // 步骤2: 更新标签关联
    if (filteredTags.length > 0 || originalTags.value.length > 0) {
      console.log("开始更新标签关联");
      try {
        // 确保在更新标签前先获取最新的标签列表
        await fetchAllTags();

        const oldTags = [...originalTags.value];
        const tagsResult = await notesStore.updateNoteTags(
          noteIdToUse,
          filteredTags,
          oldTags,
          tagColorMap.value // 传递标签颜色映射
        );

        if (tagsResult) {
          // 更新原始标签列表
          originalTags.value = [...filteredTags];
          console.log("标签关联更新成功");
        } else {
          console.error("标签关联更新失败");
          // 继续执行，不因标签失败而中断整个保存流程
          Message.warning("笔记已保存，但标签更新失败");
        }
      } catch (tagError) {
        console.error("更新标签关联失败", tagError);
        Message.warning("笔记已保存，但标签更新失败");
      }
    }

    // 尝试刷新笔记列表中的数据
    await notesStore.fetchNotes();
    Message.success("笔记已保存");
    contentChanged.value = false;
  } catch (error) {
    console.error("保存笔记失败", error);
    Message.error(error instanceof Error ? error.message : "保存笔记失败");
  } finally {
    loading.value = false;
  }
};

// 内容变更处理
const onContentChange = () => {
  contentChanged.value = true;
};

// 获取所有标签用于自动补全
const fetchAllTags = async () => {
  try {
    loading.value = true;
    const allTags = await notesStore.getAllTags();
    // 缓存所有标签
    allTagsCache.value = allTags;
    // 建立标签名称到颜色的映射
    allTags.forEach((tag) => {
      if (tag.name) {
        tagColorMap.value[tag.name] = tag.color || "#165DFF";
      }
    });
    console.log("标签颜色映射:", tagColorMap.value);
  } catch (error) {
    console.error("获取标签失败", error);
  } finally {
    loading.value = false;
  }
};

// 处理标签输入变化
const handleTagInputChange = () => {
  if (!tagInput.value) {
    suggestedTags.value = [];
    return;
  }

  // 从本地缓存中过滤标签，不发送网络请求
  suggestedTags.value = allTagsCache.value.filter(
    (tag) =>
      tag.name &&
      tag.name.toLowerCase().includes(tagInput.value.toLowerCase()) &&
      !tags.value.includes(tag.name)
  );
};

// 监听标签输入变化
watch(tagInput, handleTagInputChange);

// 标签输入确认
const handleTagInputConfirm = async () => {
  const inputValue = tagInput.value.trim();
  if (!inputValue) return;

  try {
    loading.value = true;

    // 先检查输入的标签是否已经包含在当前笔记的标签中
    if (tags.value.includes(inputValue)) {
      Message.warning(`标签"${inputValue}"已添加`);
      tagInput.value = "";
      return;
    }

    // 使用tagsController查询标签是否存在
    const allTags = await notesStore.getAllTags();
    const existingTag = allTags.find(
      (tag) => tag.name && tag.name.toLowerCase() === inputValue.toLowerCase()
    );

    // 无论标签是否存在，先添加到UI
    tags.value.push(inputValue);

    // 如果标签已存在，更新颜色映射
    if (existingTag && existingTag.color) {
      tagColorMap.value[inputValue] = existingTag.color;
    } else {
      // 新标签使用默认颜色
      tagColorMap.value[inputValue] = "#165DFF";
    }

    // 标签只在UI中显示，不立即添加到笔记
    console.log(`标签"${inputValue}"已添加到UI，等待应用`);
  } catch (error) {
    console.error("检查标签出错", error);
    Message.error("检查标签失败");
  } finally {
    loading.value = false;
    tagInput.value = "";
    suggestedTags.value = [];
  }
};

// 选择建议的标签
const selectSuggestion = (suggestion: any) => {
  if (suggestion.name && !tags.value.includes(suggestion.name)) {
    // 添加到UI
    tags.value.push(suggestion.name);
    // 更新颜色映射
    const tagColor = suggestion.color || "#165DFF";
    tagColorMap.value[suggestion.name] = tagColor;

    // 如果已有笔记ID，则立即绑定标签，传递标签颜色
    if (noteId.value) {
      addTagToExistingNote(suggestion.name, tagColor);
    }
  }
  tagInput.value = "";
  suggestedTags.value = [];
};

// 添加标签到现有笔记
const addTagToExistingNote = async (tagName: string, color?: string) => {
  if (!noteId.value || !tagName) return;

  try {
    // 显示添加中的加载状态
    loading.value = true;

    // 首先检查本地缓存中是否已存在该标签
    const existingTag = allTagsCache.value.find(
      (tag) => tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
    );

    let result = false;

    if (existingTag && existingTag.id) {
      // 标签已存在，直接调用绑定API
      console.log(`标签"${tagName}"已存在，ID:${existingTag.id}，直接绑定到笔记`);
      try {
        const bindResult = await addTagToNoteUsingPost({
          noteId: noteId.value,
          tagId: existingTag.id,
        });
        result = bindResult.data.code === 0;
      } catch (bindError) {
        console.error("绑定标签时出错", bindError);
        // 绑定出错，可能是因为标签ID无效，尝试使用store方法
        console.log("尝试使用store.addTagToNote方法作为备选");
        result = await notesStore.addTagToNote(noteId.value, tagName, color);
      }
    } else {
      // 标签不存在或本地缓存不完整
      // 尝试使用store方法，它会先检查是否存在，如果不存在则创建
      console.log(`标签"${tagName}"在本地缓存中不存在，使用store方法添加`);
      result = await notesStore.addTagToNote(noteId.value, tagName, color);

      // 添加成功后刷新本地缓存，确保下次能找到这个标签
      if (result) {
        await fetchAllTags();
      }
    }

    if (result) {
      // 更新原始标签列表，用于比较变更
      if (!originalTags.value.includes(tagName)) {
        originalTags.value.push(tagName);
      }
      contentChanged.value = true;
    } else {
      // 如果添加失败，从UI中移除标签
      const index = tags.value.indexOf(tagName);
      if (index !== -1) {
        tags.value.splice(index, 1);
      }
    }
  } catch (error) {
    console.error("标签添加失败", error);
    Message.error("标签添加失败");

    // 从UI中移除标签
    const index = tags.value.indexOf(tagName);
    if (index !== -1) {
      tags.value.splice(index, 1);
    }
  } finally {
    loading.value = false;
  }
};

// 移除标签
const removeTag = async (tag: string) => {
  const index = tags.value.indexOf(tag);
  if (index !== -1) {
    tags.value.splice(index, 1);

    // 如果已有笔记ID，则立即从后端移除标签
    if (noteId.value) {
      try {
        loading.value = true;
        await notesStore.removeTagFromNote(noteId.value, tag);

        // 更新原始标签列表
        const origIndex = originalTags.value.indexOf(tag);
        if (origIndex !== -1) {
          originalTags.value.splice(origIndex, 1);
        }
        contentChanged.value = true;
      } catch (error) {
        console.error("移除标签失败", error);
        Message.error("移除标签失败");
        // 恢复UI中的标签
        tags.value.splice(index, 0, tag);
      } finally {
        loading.value = false;
      }
    }
  }
};

// 获取标签样式
const getTagStyle = (tagName: string) => {
  return {
    backgroundColor: tagColorMap.value[tagName] || "#165DFF",
  };
};

// 标签点击处理
const handleTagsClick = async () => {
  // 获取所有标签以支持自动补全
  await fetchAllTags();
  tagsModalVisible.value = true;
};

// 关闭标签弹窗
const closeTagsModal = () => {
  tagsModalVisible.value = false;
};

// 应用标签 - 将UI中的标签关联到笔记
const applyTags = async () => {
  if (!noteId.value) {
    // 新笔记模式 - 只需标记为已更改，等待保存
    contentChanged.value = true;
    tagsModalVisible.value = false;
    return;
  }

  // 现有笔记模式
  contentChanged.value = true;

  // 过滤掉空标签
  const filteredTags = tags.value.filter((tag) => tag && tag.trim() !== "");

  // 如果过滤后与原始数组长度不同，说明有空标签被移除
  if (filteredTags.length !== tags.value.length) {
    console.log("已移除空标签");
    tags.value = filteredTags;
  }

  try {
    loading.value = true;

    // 找出需要添加和移除的标签
    const oldTags = [...originalTags.value];
    const tagsToAdd = filteredTags.filter((tag) => !oldTags.includes(tag));
    const tagsToRemove = oldTags.filter((tag) => !filteredTags.includes(tag));

    console.log("标签变更情况", {
      tagsToAdd,
      tagsToRemove,
    });

    let success = true;

    // 使用noteTagsController添加新标签
    for (const tagName of tagsToAdd) {
      try {
        // 首先查找标签是否存在(获取tagId)
        const allTags = await notesStore.getAllTags();
        const existingTag = allTags.find(
          (tag) => tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
        );

        if (existingTag && existingTag.id) {
          // 标签已存在，直接关联
          console.log(`关联已存在标签"${tagName}"`);
          const bindResult = await addTagToNoteUsingPost({
            noteId: noteId.value,
            tagId: existingTag.id,
          });

          if (bindResult.data.code !== 0) {
            console.error(`关联标签"${tagName}"失败`, bindResult.data.message);
            success = false;
          }
        } else {
          // 标签不存在，先创建再关联
          console.log(`创建并关联新标签"${tagName}"`);
          const result = await notesStore.addTagToNote(
            noteId.value,
            tagName,
            tagColorMap.value[tagName]
          );
          if (!result) {
            success = false;
          }
        }
      } catch (error) {
        console.error(`添加标签"${tagName}"失败`, error);
        success = false;
      }
    }

    // 移除旧标签
    for (const tagName of tagsToRemove) {
      try {
        const result = await notesStore.removeTagFromNote(noteId.value, tagName);
        if (!result) {
          success = false;
        }
      } catch (error) {
        console.error(`移除标签"${tagName}"失败`, error);
        success = false;
      }
    }

    if (success) {
      // 更新原始标签列表，以便下次比较
      originalTags.value = [...filteredTags];
      Message.success("标签已更新");
    } else {
      Message.error("部分标签更新失败");
    }
  } catch (error) {
    console.error("更新标签失败", error);
    Message.error("更新标签失败");
  } finally {
    loading.value = false;
    tagsModalVisible.value = false;
  }
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
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-3);
  background-color: var(--color-bg-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.title-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 24px;
  padding-left: 16px;
}

.title-decorator {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-primary-light-4), var(--color-primary-6));
  border-radius: 2px;
}

.actions {
  display: flex;
  gap: 8px;
}

.editor-container {
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex; /* Make container flex */
  flex-direction: column; /* Stack toolbar and editor vertically */
}

/* Style for the Tiptap toolbar */
.editor-toolbar {
  padding: 8px;
  border: 1px solid var(--color-border-2);
  border-bottom: none; /* Remove bottom border to merge with editor */
  border-top-left-radius: var(--border-radius-medium);
  border-top-right-radius: var(--border-radius-medium);
  background-color: var(--color-fill-2);
}

/* Style for the Tiptap editor content area */
.tiptap-editor :deep(.ProseMirror) {
  /* Use :deep to target ProseMirror internals */
  height: 100%; /* Make editor fill container height */
  min-height: 300px; /* Ensure a minimum height */
  padding: 12px;
  border: 1px solid var(--color-border-2);
  border-bottom-left-radius: var(--border-radius-medium);
  border-bottom-right-radius: var(--border-radius-medium);
  background-color: var(--color-bg-1);
  outline: none;
  overflow-y: auto; /* Allow scrolling within the editor */
}

/* Add some basic styling for common elements */
.tiptap-editor :deep(p) {
  margin-bottom: 0.75em;
}

.tiptap-editor :deep(h1, h2, h3, h4) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.tiptap-editor :deep(ul, ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

.tiptap-editor :deep(li > p) {
  margin-bottom: 0.25em; /* Reduce spacing inside list items */
}

.tag-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag-input {
  position: relative;
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  z-index: 100;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tag-suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.tag-suggestion-item:hover {
  background-color: var(--color-fill-2);
}

/* Added pre and pre code styles here inside :deep() */
.tiptap-editor :deep(pre) {
  background: #0d0d0d; /* 更深的黑色 */
  color: #fff;
  font-family: "JetBrainsMono", monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.tiptap-editor :deep(pre code) {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}

/* 添加语法高亮相关样式 (如果使用CodeBlockLowlight) */
.tiptap-editor :deep(.hljs-comment),
.tiptap-editor :deep(.hljs-quote) {
  color: #616161;
}

.tiptap-editor :deep(.hljs-variable),
.tiptap-editor :deep(.hljs-tag) {
  color: #f98181;
}
</style>
