// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 创建标签 POST /tags/add */
export async function addTagUsingPost(
  body: API.TagAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/tags/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除标签 DELETE /tags/delete */
export async function deleteTagUsingDelete(
  params: {
    tagId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/tags/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新标签 POST /tags/update */
export async function updateTagUsingPost(
  body: API.TagUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/tags/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID获取标签 GET /tags/get */
export async function getTagByIdUsingGet(
  params: {
    tagId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTags>("/tags/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取标签列表 POST /tags/list/page */
export async function listTagsByPageUsingPost(
  body: API.TagQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageTags>("/tags/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取当前登录用户创建的标签列表 POST /tags/my/list/page */
export async function listMyTagsByPageUsingPost(
  body: API.TagQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageTags>("/tags/my/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取标签云数据 GET /tags/cloud */
export async function getTagCloudUsingGet(
  params?: {
    limit?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTags>("/tags/cloud", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取个人标签云 GET /tags/my/cloud */
export async function getMyTagCloudUsingGet(
  params?: {
    limit?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTags>("/tags/my/cloud", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取热门标签 GET /tags/hot */
export async function getHotTagsUsingGet(
  params?: {
    limit?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTags>("/tags/hot", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据笔记ID获取标签列表 GET /tags/by/note/{noteId} */
export async function getTagsByNoteIdUsingGet(
  params: {
    noteId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTags>(`/tags/by/note/${params.noteId}`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取用户标签使用统计 GET /tags/stats/user */
export async function getUserTagStatsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringInteger>("/tags/stats/user", {
    method: "GET",
    ...(options || {}),
  });
} 