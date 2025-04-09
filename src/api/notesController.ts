// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 创建核心笔记 POST /notes/add */
export async function addNotesUsingPost(
  body: API.NotesAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/notes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除核心笔记 POST /notes/delete */
export async function deleteNotesUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notes/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新核心笔记（仅管理员可用） POST /notes/update */
export async function updateNotesUsingPost(
  body: API.NotesUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notes/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id获取核心笔记（封装类） GET /notes/get/vo */
export async function getNotesVOByIdUsingGet(
  params: {
    id: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseNotesVO>("/notes/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取核心笔记列表（仅管理员可用） POST /notes/list/page */
export async function listNotesByPageUsingPost(
  body: API.NotesQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageNotes>("/notes/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取核心笔记列表（封装类） POST /notes/list/page/vo */
export async function listNotesVOByPageUsingPost(
  body: API.NotesQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageNotesVO>("/notes/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取当前登录用户创建的核心笔记列表 POST /notes/my/list/page/vo */
export async function listMyNotesVOByPageUsingPost(
  body: API.NotesQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageNotesVO>("/notes/my/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑核心笔记（给用户使用） POST /notes/edit */
export async function editNotesUsingPost(
  body: API.NotesEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notes/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
} 