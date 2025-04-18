import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addTagsUsingPost,
  deleteTagsUsingPost,
  editTagsUsingPost,
  getTagsVoByIdUsingGet,
  listMyTagsVoByPageUsingPost,
  listTagsVoByPageUsingPost,
} from "@/api/tagsController";
import { getNotesByTagIdUsingGet } from "@/api/noteTagsController";
import { Message } from "@arco-design/web-vue";

/**
 * 标签全局状态管理
 */
export const useTagsStore = defineStore("tags", () => {
  // 定义TagsVO接口
  interface TagsVO {
    id?: string;
    name?: string;
    color?: string;
    createTime?: string;
    usageCount?: number;
    userId?: string;
    user?: any;
  }

  // 标签列表
  const tagsList = ref<TagsVO[]>([]);
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
  const sortField = ref("usageCount");
  // 排序方式
  const sortOrder = ref("descend");

  // 获取标签列表
  async function fetchTags() {
    loading.value = true;
    try {
      console.log("发送标签搜索请求，参数：", {
        searchText: searchText.value,
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
        sortField: sortField.value,
        sortOrder: sortOrder.value
      });
      
      // 修改API调用，使用不同的参数名
      const res = await listMyTagsVoByPageUsingPost({
        searchText: searchText.value, // 尝试使用keyword替代searchText
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
      });
      
      console.log("API响应：", res.data);
      
      if (res.data.code === 0) {
        tagsList.value = res.data.data?.records || [];
        pagination.value.total = res.data.data?.total || 0;
      } else {
        Message.error(res.data.message || "获取标签列表失败");
      }
    } catch (error) {
      console.error("获取标签列表失败", error);
      Message.error("获取标签列表失败");
    } finally {
      loading.value = false;
    }
  }

  // 根据ID获取标签详情
  async function fetchTagById(id: string) {
    loading.value = true;
    try {
      const res = await getTagsVoByIdUsingGet({
        id: Number(id),
      });

      if (res.data.code === 0 && res.data.data) {
        return res.data.data;
      } else {
        Message.error(res.data.message || "获取标签详情失败");
        return null;
      }
    } catch (error) {
      console.error("获取标签详情失败", error);
      Message.error("获取标签详情失败");
      return null;
    } finally {
      loading.value = false;
    }
  }

  // 添加标签
  async function addTag(name: string, color?: string) {
    if (!name || name.trim() === "") {
      Message.error("标签名称不能为空");
      return null;
    }

    loading.value = true;
    try {
      // 创建标签请求对象
      const tagRequest = {
        title: name,
        name: name,
      } as any;

      // 如果有颜色参数，也加入请求
      if (color) {
        tagRequest.color = color;
      }

      const res = await addTagsUsingPost(tagRequest);

      if (res.data.code === 0) {
        Message.success("创建标签成功");
        // 刷新标签列表
        await fetchTags();
        return res.data.data;
      } else {
        Message.error(res.data.message || "创建标签失败");
        return null;
      }
    } catch (error) {
      console.error("创建标签失败", error);
      Message.error("创建标签失败");
      return null;
    } finally {
      loading.value = false;
    }
  }

  // 编辑标签
  async function editTag(id: string, name: string, color?: string) {
    if (!id) {
      Message.error("标签ID不能为空");
      return false;
    }

    if (!name || name.trim() === "") {
      Message.error("标签名称不能为空");
      return false;
    }

    loading.value = true;
    try {
      // 创建标签编辑请求对象
      const tagRequest = {
        id,
        title: name,
        name: name,
      } as any;

      // 如果有颜色参数，也加入请求
      if (color) {
        tagRequest.color = color;
      }

      const res = await editTagsUsingPost(tagRequest);

      if (res.data.code === 0) {
        Message.success("更新标签成功");
        // 刷新标签列表
        await fetchTags();
        return true;
      } else {
        Message.error(res.data.message || "更新标签失败");
        return false;
      }
    } catch (error) {
      console.error("更新标签失败", error);
      Message.error("更新标签失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 删除标签
  async function deleteTag(id: string) {
    if (!id) {
      Message.error("标签ID不能为空");
      return false;
    }

    loading.value = true;
    try {
      const res = await deleteTagsUsingPost({
        id,
      });

      if (res.data.code === 0) {
        Message.success("删除标签成功");
        // 从列表中移除
        tagsList.value = tagsList.value.filter((tag) => tag.id !== id);
        return true;
      } else {
        Message.error(res.data.message || "删除标签失败");
        return false;
      }
    } catch (error) {
      console.error("删除标签失败", error);
      Message.error("删除标签失败");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 获取标签关联的笔记ID列表
  async function getNotesByTagId(tagId: string) {
    if (!tagId) {
      Message.error("标签ID不能为空");
      return [];
    }

    loading.value = true;
    try {
      console.log(`调用getNotesByTagIdUsingGet, 参数tagId: ${tagId}, 类型: ${typeof tagId}`);

      const res = await getNotesByTagIdUsingGet({
        tagId,
      });

      console.log("getNotesByTagId API返回原始数据:", res);
      console.log("getNotesByTagId API返回的data字段:", res.data);

      if (res.data.code === 0) {
        const notesData = res.data.data || [];
        console.log("getNotesByTagId 返回的笔记数据:", notesData);

        // 检查返回数据的格式
        if (notesData.length > 0) {
          console.log("第一个返回的笔记ID/项:", notesData[0], "类型:", typeof notesData[0]);

          // 如果是对象，检查其属性
          if (typeof notesData[0] === "object" && notesData[0] !== null) {
            console.log("第一个项的属性:", Object.keys(notesData[0]));
          }
        }

        return notesData;
      } else {
        Message.error(res.data.message || "获取标签关联笔记失败");
        return [];
      }
    } catch (error) {
      console.error("获取标签关联笔记失败", error);
      Message.error("获取标签关联笔记失败");
      return [];
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

  // 重置过滤条件
  function resetFilters() {
    searchText.value = "";
    sortField.value = "usageCount";
    sortOrder.value = "descend";
    pagination.value = {
      current: 1,
      pageSize: 10,
      total: 0,
    };
  }

  return {
    tagsList,
    loading,
    pagination,
    searchText,
    sortField,
    sortOrder,
    fetchTags,
    fetchTagById,
    addTag,
    editTag,
    deleteTag,
    getNotesByTagId,
    setSearchText,
    setSort,
    setPagination,
    resetFilters,
  };
});
