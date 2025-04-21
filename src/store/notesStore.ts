import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  addNotesUsingPost,
  deleteNotesUsingPost,
  editNotesUsingPost,
  getNotesVoByIdUsingGet,
  listMyNotesVoByPageUsingPost,
  moveToTrashUsingPost,
  restoreFromTrashUsingPost,
  permanentDeleteUsingPost,
  listTrashNotesUsingPost,
} from "@/api/notesController";
import {
  addTagToNoteUsingPost,
  removeTagFromNoteUsingPost,
  getTagsByNoteIdUsingGet,
} from "@/api/noteTagsController";
import { addTagsUsingPost, listMyTagsVoByPageUsingPost } from "@/api/tagsController";
import { Message } from "@arco-design/web-vue";

/**
 * 笔记全局状态管理
 */
export const useNotesStore = defineStore("notes", () => {
  // 定义NotesVO接口
  interface NotesVO {
    id?: string;
    title?: string;
    content?: string;
    createTime?: string;
    updateTime?: string;
    userId?: string;
    tagList?: string[];
    user?: any;
  }

  // 笔记列表
  const notesList = ref<NotesVO[]>([]);
  // 回收站笔记列表
  const trashNotes = ref<NotesVO[]>([]);
  // 加载状态
  const loading = ref(false);
  // 分页信息
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // 搜索关键词
  const searchText = ref("");
  // 排序字段
  const sortField = ref("updateTime");
  // 排序方式
  const sortOrder = ref("descend");
  // 已选中的目录路径
  const selectedDirectory = ref("");
  // 已选中的标签
  const selectedTags = ref<string[]>([]);

  // 获取笔记列表
  async function fetchNotes() {
    loading.value = true;
    try {
      const res = await listMyNotesVoByPageUsingPost({
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        searchText: searchText.value,
        directoryPath: selectedDirectory.value,
        tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
      });

      if (res.data.code === 0) {
        notesList.value = res.data.data?.records || [];
        pagination.value.total = res.data.data?.total || 0;
      } else {
        Message.error(res.data.message || "获取笔记列表失败");
      }
    } catch (error) {
      console.error("获取笔记列表失败", error);
      Message.error("获取笔记列表失败");
    } finally {
      loading.value = false;
    }
  }

  // 获取回收站笔记列表
  async function fetchTrashNotes() {
    loading.value = true;
    try {
      const res = await listTrashNotesUsingPost({
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        searchText: searchText.value,
      });

      if (res.data.code === 0) {
        trashNotes.value = res.data.data?.records || [];
        pagination.value.total = res.data.data?.total || 0;
      } else {
        Message.error(res.data.message || "获取回收站笔记列表失败");
      }
    } catch (error) {
      console.error("获取回收站笔记列表失败", error);
      Message.error("获取回收站笔记列表失败");
    } finally {
      loading.value = false;
    }
  }

  // 根据ID获取笔记
  async function fetchNoteById(noteId: string) {
    loading.value = true;
    try {
      console.log("获取笔记详情，原始ID:", noteId, "类型:", typeof noteId);

      // 确保id不为空
      if (!noteId) {
        console.error("笔记ID为空");
        return null;
      }

      // 确保ID为字符串类型
      const stringId = String(noteId);
      console.log("转换为字符串ID:", stringId);

      // 尝试先直接使用字符串ID获取
      try {
        console.log("尝试使用字符串ID获取笔记:", stringId);
        const res = await getNotesVoByIdUsingGet({
          id: stringId as any,
        });

        console.log("使用字符串ID获取笔记响应:", res.data);

        if (res.data.code === 0 && res.data.data) {
          console.log("成功获取笔记数据:", res.data.data);
          return res.data.data;
        }

        // 如果字符串ID失败，尝试转换为数字
        const numericId = Number(noteId);
        if (!isNaN(numericId)) {
          console.log("尝试使用数字ID获取笔记:", numericId);
          const numRes = await getNotesVoByIdUsingGet({
            id: numericId,
          });

          console.log("使用数字ID获取笔记响应:", numRes.data);

          if (numRes.data.code === 0 && numRes.data.data) {
            console.log("成功获取笔记数据:", numRes.data.data);
            return numRes.data.data;
          }
        }

        // 如果两种方式都失败，显示详细错误信息
        console.error("获取笔记详情失败，ID:", noteId, "响应:", res.data);
        Message.error("获取笔记详情失败: " + (res.data.message || "未知错误"));
        return null;
      } catch (apiError) {
        console.error("API调用失败:", apiError);
        Message.error("获取笔记详情失败：API调用异常");
        return null;
      }
    } catch (error) {
      console.error("获取笔记详情失败，未处理异常:", error);
      Message.error("获取笔记详情失败");
      return null;
    } finally {
      loading.value = false;
    }
  }

  // 添加笔记
  async function addNote(title: string, content: string, tags?: string[]) {
    loading.value = true;
    try {
      // 确保参数有效
      const payload = {
        title: title || "新笔记",
        content: content || "",
        tags: tags || [],
      };

      const res = await addNotesUsingPost(payload);

      if (res.data.code === 0) {
        // 成功时静默处理，不显示消息
        return res.data.data;
      } else {
        // 错误时静默处理，只记录日志
        console.error("创建笔记失败", res.data.message);
        return null;
      }
    } catch (error) {
      console.error("创建笔记失败", error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // 编辑笔记
  async function editNote(id: string, title: string, content: string, tags?: string[]) {
    loading.value = true;
    try {
      const res = await editNotesUsingPost({
        id,
        title,
        content,
        tags,
      });

      if (res.data.code === 0) {
        Message.success("编辑笔记成功");
        return true;
      } else {
        Message.error(res.data.message || "编辑笔记失败");
        return false;
      }
    } catch (error) {
      console.error("编辑笔记失败", error);
      Message.error("编辑笔记失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 移动到回收站
  async function moveToTrash(id: string) {
    loading.value = true;
    try {
      const res = await moveToTrashUsingPost({
        id,
      });

      if (res.data.code === 0) {
        Message.success("移动到回收站成功");
        // 从列表中移除
        notesList.value = notesList.value.filter((note: NotesVO) => note.id !== id);
        return true;
      } else {
        Message.error(res.data.message || "移动到回收站失败");
        return false;
      }
    } catch (error) {
      console.error("移动到回收站失败", error);
      Message.error("移动到回收站失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 从回收站恢复
  async function restoreFromTrash(id: string) {
    loading.value = true;
    try {
      const res = await restoreFromTrashUsingPost({
        id,
      });

      if (res.data.code === 0) {
        Message.success("从回收站恢复成功");
        // 从回收站列表中移除
        trashNotes.value = trashNotes.value.filter((note: NotesVO) => note.id !== id);
        return true;
      } else {
        Message.error(res.data.message || "从回收站恢复失败");
        return false;
      }
    } catch (error) {
      console.error("从回收站恢复失败", error);
      Message.error("从回收站恢复失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 永久删除
  async function permanentDelete(id: string) {
    loading.value = true;
    try {
      const res = await permanentDeleteUsingPost({
        id,
      });

      if (res.data.code === 0) {
        Message.success("永久删除成功");
        // 从回收站列表中移除
        trashNotes.value = trashNotes.value.filter((note: NotesVO) => note.id !== id);
        return true;
      } else {
        Message.error(res.data.message || "永久删除失败");
        return false;
      }
    } catch (error) {
      console.error("永久删除失败", error);
      Message.error("永久删除失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 设置搜索文本
  function setSearchText(text: string) {
    searchText.value = text;
  }

  // 设置排序
  function setSort(field: string, order: string) {
    sortField.value = field;
    sortOrder.value = order;
  }

  // 设置分页
  function setPagination(current: number, pageSize: number) {
    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
  }

  // 设置当前目录
  function setDirectory(directoryPath: string) {
    selectedDirectory.value = directoryPath;
  }

  // 设置选中的标签
  function setTags(tags: string[]) {
    selectedTags.value = tags;
  }

  // 重置过滤条件
  function resetFilters() {
    searchText.value = "";
    selectedDirectory.value = "";
    selectedTags.value = [];
    sortField.value = "updateTime";
    sortOrder.value = "descend";
    pagination.value = {
      current: 1,
      pageSize: 10,
      total: 0,
    };
  }

  // 更新笔记列表中的单个笔记标签（本地更新，不调用API）
  function updateNoteTagsInList(noteId: string, tags: string[]) {
    if (!noteId) return;

    // 查找笔记在列表中的索引
    const noteIndex = notesList.value.findIndex((note) => note.id === noteId);

    // 如果找到笔记，更新其标签
    if (noteIndex !== -1) {
      console.log(`更新笔记${noteId}的标签:`, tags);
      notesList.value[noteIndex].tagList = [...tags];
    }
  }

  // 获取所有标签列表
  async function getAllTags() {
    loading.value = true;
    try {
      // 注意：必须提供要求的所有参数，确保符合API._3类型定义
      const res = await listMyTagsVoByPageUsingPost({
        current: 1,
        pageSize: 1000, // 设置较大值以获取所有标签
        sortField: "createTime",
        sortOrder: "descend",
      });

      if (res.data.code === 0) {
        return res.data.data?.records || [];
      } else {
        console.error("获取标签列表失败", res.data.message);
        return [];
      }
    } catch (error) {
      console.error("获取标签列表失败", error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 根据标签名称查找或创建标签ID
   * @param tagName 标签名称
   * @param color 标签颜色（可选）
   * @returns 标签ID或null
   */
  async function getOrCreateTagId(tagName: string, color?: string) {
    if (!tagName || tagName.trim() === "") {
      Message.warning("标签名称不能为空");
      return null;
    }

    try {
      // 首先查找标签是否已存在
      const allTags = await getAllTags();
      // 忽略大小写进行比较
      const existingTag = allTags.find(
        (tag) => tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
      );

      if (existingTag && existingTag.id) {
        console.log(`标签 "${tagName}" 已存在，ID: ${existingTag.id}`);
        return existingTag.id;
      }

      // 标签不存在，创建新标签
      try {
        // 如果没有提供颜色，生成一个随机颜色
        const tagColor = color || generateRandomColor();

        // 创建标签请求，根据API定义的TagsAddRequest类型
        const tagRequest: API.TagsAddRequest = {
          title: tagName,
          color: tagColor,
        };

        // 添加颜色参数
        // 由于TagsAddRequest类型中没有包含color字段，需要使用类型断言
        (tagRequest as any).color = tagColor;

        console.log(`准备创建新标签 "${tagName}"`);
        const res = await addTagsUsingPost(tagRequest);

        if (res.data.code === 0 && res.data.data) {
          console.log(`标签 "${tagName}" 创建成功，ID: ${res.data.data}`);
          return res.data.data;
        } else {
          // 如果创建失败，可能是因为标签已存在但未在初始请求中返回
          // 尝试再次获取所有标签并检查
          console.warn(`创建标签失败，错误: ${res.data.message}，尝试再次检查标签是否存在`);
          const retryTags = await getAllTags();
          const retryExistingTag = retryTags.find(
            (tag) => tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
          );

          if (retryExistingTag && retryExistingTag.id) {
            console.log(`重试后发现标签 "${tagName}" 已存在，ID: ${retryExistingTag.id}`);
            return retryExistingTag.id;
          }

          Message.error(res.data.message || "创建标签失败");
          return null;
        }
      } catch (error: any) {
        // 检查是否是重复键错误
        if (error && error.message && error.message.includes("Duplicate entry")) {
          console.warn("检测到重复标签错误，尝试获取已存在的标签");
          // 尝试再次获取所有标签
          const retryTags = await getAllTags();
          const retryExistingTag = retryTags.find(
            (tag) => tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
          );

          if (retryExistingTag && retryExistingTag.id) {
            console.log(`在错误处理中找到已存在标签 "${tagName}"，ID: ${retryExistingTag.id}`);
            return retryExistingTag.id;
          }
        }

        console.error("创建标签失败", error);
        Message.error("创建标签失败，请稍后重试");
        return null;
      }
    } catch (outerError) {
      console.error("获取或创建标签过程中出错", outerError);
      Message.error("标签操作失败，请稍后重试");
      return null;
    }
  }

  /**
   * 生成随机颜色（十六进制格式）
   * @returns 颜色十六进制值
   */
  function generateRandomColor() {
    // 预定义一组舒适的颜色
    const colors = [
      "#165DFF", // 默认蓝色
      "#0FC6C2", // 青色
      "#722ED1", // 紫色
      "#F5222D", // 红色
      "#FAAD14", // 橙色
      "#52C41A", // 绿色
      "#EB2F96", // 粉色
      "#FA8C16", // 深橙色
      "#A0D911", // 淡绿色
      "#1677FF", // 天蓝色
      "#F759AB", // 亮粉色
    ];

    // 随机选择一个颜色
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 添加标签到笔记
   * @param noteId 笔记ID
   * @param tagName 标签名称
   * @param color 标签颜色（可选）
   * @returns 操作是否成功
   */
  async function addTagToNote(noteId: string, tagName: string, color?: string) {
    loading.value = true;
    try {
      if (!noteId || !tagName) {
        Message.warning("笔记ID和标签名称不能为空");
        return false;
      }

      // 步骤1: 获取或创建标签ID，传递颜色参数
      const tagId = await getOrCreateTagId(tagName, color);

      if (!tagId) {
        return false; // getOrCreateTagId已经处理了错误消息
      }

      // 步骤2: 将标签绑定到笔记
      const res = await addTagToNoteUsingPost({
        noteId,
        tagId,
      });

      if (res.data.code === 0) {
        return true;
      } else {
        Message.error(res.data.message || "添加标签失败");
        return false;
      }
    } catch (error) {
      console.error("添加标签失败", error);
      Message.error("添加标签失败，请稍后重试");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 从笔记中移除标签
  async function removeTagFromNote(noteId: string, tagName: string) {
    loading.value = true;
    try {
      console.log(`准备从笔记 ${noteId} 移除标签 ${tagName}`);

      // 获取标签ID（但不创建新标签）
      const allTags = await getAllTags();
      const existingTag = allTags.find((tag) => tag.name === tagName);

      if (!existingTag || !existingTag.id) {
        console.error(`找不到标签 ${tagName} 的ID`);
        return false;
      }

      const tagId = existingTag.id;

      console.log(`从笔记 ${noteId} 移除标签 ${tagName}(ID: ${tagId})`);
      const res = await removeTagFromNoteUsingPost({
        noteId,
        tagId,
      });

      if (res.data.code === 0) {
        console.log("移除标签成功");
        return true;
      } else {
        console.error("移除标签失败", res.data.message);
        return false;
      }
    } catch (error) {
      console.error("移除标签失败", error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 获取笔记的标签
  async function getTagsByNoteId(noteId: string) {
    loading.value = true;
    try {
      console.log(`获取笔记 ${noteId} 的标签`);
      const res = await getTagsByNoteIdUsingGet({
        noteId,
      });

      if (res.data.code === 0) {
        console.log("获取标签成功", res.data.data);
        return res.data.data || [];
      } else {
        console.error("获取标签失败", res.data.message);
        return [];
      }
    } catch (error) {
      console.error("获取标签失败", error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  // 更新笔记标签（比较新旧标签，添加/移除差异部分）
  async function updateNoteTags(
    noteId: string,
    newTags: string[],
    oldTags: string[] = [],
    tagColorMap: Record<string, string> = {}
  ) {
    if (!noteId) return false;

    console.log(`更新笔记 ${noteId} 的标签`, {
      oldTags,
      newTags,
    });

    // 找出需要添加的标签（在newTags中但不在oldTags中）
    const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag));

    // 找出需要移除的标签（在oldTags中但不在newTags中）
    const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

    console.log("标签变更情况", {
      tagsToAdd,
      tagsToRemove,
    });

    let success = true;

    // 添加新标签
    for (const tagName of tagsToAdd) {
      // 从颜色映射中获取标签颜色，如果没有则使用默认颜色
      const tagColor = tagColorMap[tagName] || "#165DFF";
      const result = await addTagToNote(noteId, tagName, tagColor);
      if (!result) {
        success = false;
      }
    }

    // 移除旧标签
    for (const tagName of tagsToRemove) {
      const result = await removeTagFromNote(noteId, tagName);
      if (!result) {
        success = false;
      }
    }

    // 更新本地笔记列表中的标签
    if (success) {
      updateNoteTagsInList(noteId, newTags);
    }

    return success;
  }

  return {
    notesList,
    trashNotes,
    loading,
    pagination,
    searchText,
    sortField,
    sortOrder,
    selectedDirectory,
    selectedTags,
    fetchNotes,
    fetchTrashNotes,
    fetchNoteById,
    addNote,
    editNote,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    setSearchText,
    setSort,
    setPagination,
    setDirectory,
    setTags,
    resetFilters,
    updateNoteTagsInList,
    addTagToNote,
    removeTagFromNote,
    getTagsByNoteId,
    updateNoteTags,
    getAllTags,
    getOrCreateTagId,
  };
});
