<template>
  <div class="tag-detail-container">
    <!-- 标签信息区域 -->
    <div class="tag-header">
      <div class="tag-info">
        <a-tag
          :style="{
            backgroundColor: tagDetail.color || '#165DFF',
            fontSize: '18px',
            padding: '8px 16px',
          }"
          size="large"
        >
          {{ tagDetail.name || "加载中..." }}
        </a-tag>
        <div class="tag-meta">
          <span>创建于: {{ formatDate(tagDetail.createTime) }}</span>
          <span>使用次数: {{ tagDetail.usageCount || 0 }}</span>
        </div>
      </div>
      <div class="tag-actions">
        <a-space>
          <a-button type="outline" @click="$router.push('/tags')">
            <template #icon>
              <icon-left />
            </template>
            返回列表
          </a-button>
          <a-button type="primary" @click="openEditTagModal">
            <template #icon>
              <icon-edit />
            </template>
            编辑标签
          </a-button>
          <a-button status="danger" @click="openDeleteConfirm">
            <template #icon>
              <icon-delete />
            </template>
            删除标签
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <a-spin dot />
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 相关笔记 -->
    <div class="related-notes" v-else>
      <h3 class="section-title">包含此标签的笔记</h3>

      <!-- 空状态 -->
      <div class="empty-container" v-if="relatedNotes.length === 0">
        <a-empty description="没有相关笔记">
          <template #image>
            <icon-file style="font-size: 64px; color: #c2c7d0" />
          </template>
        </a-empty>
      </div>

      <!-- 笔记列表 -->
      <a-list :data="relatedNotes" v-else>
        <template #item="{ item: note }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <div class="note-title" @click="viewNote(note)">
                  {{ note.title || "无标题笔记" }}
                </div>
              </template>
              <template #description>
                <div class="note-preview">
                  {{ getContentPreview(note.content) }}
                </div>
                <div class="note-meta">
                  <span class="note-time">{{ formatDate(note.updateTime) }}</span>
                  <div class="note-tags" v-if="note.tagList && note.tagList.length">
                    <a-tag v-for="tag in note.tagList" :key="tag" size="small" color="arcoblue">
                      {{ tag }}
                    </a-tag>
                  </div>
                </div>
              </template>
            </a-list-item-meta>
            <template #extra>
              <a-button-group>
                <a-button type="text" size="small" @click="viewNote(note)">
                  <template #icon><icon-eye /></template>
                </a-button>
                <a-button type="text" size="small" @click="editNote(note)">
                  <template #icon><icon-edit /></template>
                </a-button>
              </a-button-group>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </div>

    <!-- 编辑标签弹窗 -->
    <a-modal
      v-model:visible="tagModalVisible"
      title="编辑标签"
      @cancel="closeTagModal"
      @before-ok="handleTagModalOk"
    >
      <a-form :model="tagForm" ref="tagFormRef" auto-label-width>
        <a-form-item
          field="name"
          label="标签名称"
          :rules="[{ required: true, message: '请输入标签名称' }]"
        >
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IconLeft, IconEdit, IconDelete, IconEye, IconFile } from "@arco-design/web-vue/es/icon";
import { Message, Modal } from "@arco-design/web-vue";
import { useTagsStore } from "@/store/tagsStore";
import { useNotesStore } from "@/store/notesStore";
import { useLoginUserStore } from "@/store/userStore";

const route = useRoute();
const router = useRouter();
const tagsStore = useTagsStore();
const notesStore = useNotesStore();
const userStore = useLoginUserStore();

// 标签ID
const tagId = ref(route.params.tagId as string);
// 标签详情
const tagDetail = ref<any>({});
// 关联的笔记
const relatedNotes = ref<any[]>([]);
// 加载状态
const loading = ref(true);
// 添加一个标识符追踪当前加载操作
const loadingId = ref(0);
// 标签表单
const tagForm = ref({
  tagId: "",
  name: "",
  color: "#165DFF",
});
// 标签表单引用
const tagFormRef = ref();
// 标签弹窗可见性
const tagModalVisible = ref(false);

// 提取标签数据加载逻辑到单独的函数
const loadTagData = async (tagId: string) => {
  console.log(`开始加载标签数据, 标签ID: ${tagId}, 类型: ${typeof tagId}`);

  // 重置数据，避免显示旧数据
  tagDetail.value = {};
  relatedNotes.value = [];

  loading.value = true;
  try {
    // 获取标签详情
    const tag = await tagsStore.fetchTagById(tagId);
    if (!tag) {
      Message.error("找不到标签信息");
      router.push("/tags");
      return;
    }
    tagDetail.value = tag;
    console.log("加载标签详情成功:", tag);

    // 获取标签关联的笔记ID列表
    console.log(`调用getNotesByTagId, 参数: ${tagId}`);
    const noteIds = await tagsStore.getNotesByTagId(tagId);
    console.log("获取到标签关联的笔记IDs:", noteIds);

    // 获取笔记详情
    const notes = [];
    if (Array.isArray(noteIds)) {
      for (let i = 0; i < noteIds.length; i++) {
        const noteId = noteIds[i];
        console.log(`处理第${i + 1}个笔记ID: ${noteId}, 类型: ${typeof noteId}`);

        try {
          // 如果是对象，尝试提取可能的ID字段
          if (typeof noteId === "object" && noteId !== null) {
            console.log(`笔记ID是对象, 属性: ${Object.keys(noteId)}`);
            // 可能的ID字段名
            const possibleIdFields = ["id", "noteId", "note_id", "notes"];
            for (const field of possibleIdFields) {
              if (noteId[field]) {
                console.log(`从对象中找到可能的ID字段 ${field}: ${noteId[field]}`);
              }
            }
            continue; // 跳过对象类型
          }

          // 检查ID的合理性
          const idStr = String(noteId);
          if (idStr.length < 10) {
            // 假设真实ID至少10位
            console.warn(`笔记ID格式可能不正确: ${idStr}, 长度过短`);
            continue; // 跳过明显不正确的ID
          }

          console.log(`尝试获取笔记, ID: ${idStr}`);
          const note = await notesStore.fetchNoteById(idStr);

          if (note) {
            notes.push(note);
            console.log(`成功获取笔记: ${note.title}, ID: ${note.id}`);
          } else {
            console.warn(`未找到ID为 ${idStr} 的笔记`);
          }
        } catch (err) {
          console.error(`获取笔记失败，ID: ${noteId}`, err);
          // 继续处理下一个笔记，不中断流程
        }
      }
    } else {
      console.error("getNotesByTagId返回的不是数组:", noteIds);
    }

    relatedNotes.value = notes;
    console.log("加载标签关联笔记完成, 成功加载数量:", notes.length);
  } catch (error) {
    console.error("加载标签数据失败", error);
    Message.error("加载标签数据失败");
  } finally {
    loading.value = false;
  }
};

// 添加路由参数监听
watch(
  () => route.params.tagId,
  async (newId, oldId) => {
    console.log("标签ID变化, 旧ID:", oldId, "新ID:", newId);
    if (newId && newId !== oldId) {
      tagId.value = String(newId);
      // 重新加载数据
      await loadTagData(tagId.value);
    }
  }
);

// 查看笔记
const viewNote = (note: any) => {
  if (!note || !note.id) {
    Message.error("无效的笔记ID");
    return;
  }
  router.push(`/notes/edit/${note.id}`);
};

// 编辑笔记
const editNote = (note: any) => {
  if (!note || !note.id) {
    Message.error("无效的笔记ID");
    return;
  }
  router.push(`/notes/edit/${note.id}`);
};

// 打开编辑标签弹窗
const openEditTagModal = () => {
  tagForm.value = {
    tagId: tagDetail.value.id || "",
    name: tagDetail.value.name || "",
    color: tagDetail.value.color || "#165DFF",
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
  if (!tagForm.value.name || tagForm.value.name.trim() === "") {
    Message.error("标签名称不能为空");
    done(false);
    return;
  }

  try {
    const result = await tagsStore.editTag(
      tagForm.value.tagId,
      tagForm.value.name,
      tagForm.value.color
    );

    if (result) {
      // 更新本地标签详情
      tagDetail.value = {
        ...tagDetail.value,
        name: tagForm.value.name,
        color: tagForm.value.color,
      };
      done();
    } else {
      done(false);
    }
  } catch (error) {
    console.error("更新标签失败", error);
    Message.error("更新标签失败");
    done(false);
  }
};

// 打开删除确认
const openDeleteConfirm = () => {
  Modal.confirm({
    title: "删除标签",
    content: `确定要删除标签 "${tagDetail.value.name}" 吗？这将移除所有笔记上的该标签。`,
    okText: "删除",
    cancelText: "取消",
    okButtonProps: {
      status: "danger",
    },
    onOk: async () => {
      const result = await tagsStore.deleteTag(tagDetail.value.id);
      if (result) {
        Message.success("标签已删除");
        router.push("/tags");
      }
    },
  });
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};

// 获取内容预览
const getContentPreview = (content?: string) => {
  if (!content) return "";

  // 移除Markdown语法，只展示纯文本
  const plainText = content
    .replace(/#+\s/g, "") // 标题
    .replace(/\*\*(.*?)\*\*/g, "$1") // 粗体
    .replace(/\*(.*?)\*/g, "$1") // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 链接
    .replace(/`(.*?)`/g, "$1") // 代码
    .replace(/```([\s\S]*?)```/g, "") // 代码块
    .replace(/!\[(.*?)\]\(.*?\)/g, "[图片]") // 图片
    .replace(/\n/g, " "); // 换行替换为空格

  return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText;
};
</script>

<style scoped>
.tag-detail-container {
  padding: 20px;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.tag-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-meta {
  display: flex;
  gap: 20px;
  color: var(--color-text-3);
  font-size: 14px;
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

.section-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
}

.empty-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.note-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
  cursor: pointer;
}

.note-title:hover {
  color: rgb(var(--primary-6));
}

.note-preview {
  margin: 4px 0;
  color: var(--color-text-3);
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
}

.note-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
