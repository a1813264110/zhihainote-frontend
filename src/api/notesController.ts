// @ts-ignore
/* eslint-disable */
import  request  from "../request";

/** addNotes POST /api/notes/add */
export async function addNotesUsingPost(
  body: API.NotesAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOflong>("/api/notes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteNotes POST /api/notes/delete */
export async function deleteNotesUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** permanentDelete POST /api/notes/delete/permanent */
export async function permanentDeleteUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/delete/permanent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editNotes POST /api/notes/edit */
export async function editNotesUsingPost(
  body: API.NotesEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getNotesVOById GET /api/notes/get/vo */
export async function getNotesVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotesVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfNotesVO>("/api/notes/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listNotesByDirectory GET /api/notes/list/directory */
export async function listNotesByDirectoryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listNotesByDirectoryUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfListOfNotesVO>("/api/notes/list/directory", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listNotesByPage POST /api/notes/list/page */
export async function listNotesByPageUsingPost(body: API._2, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfNotes>("/api/notes/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listNotesVOByPage POST /api/notes/list/page/vo */
export async function listNotesVoByPageUsingPost(body: API._2, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfNotesVO>("/api/notes/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listTrashNotes POST /api/notes/list/trash */
export async function listTrashNotesUsingPost(body: API._2, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfNotesVO>("/api/notes/list/trash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyNotesVOByPage POST /api/notes/my/list/page/vo */
export async function listMyNotesVoByPageUsingPost(body: API._2, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfNotesVO>("/api/notes/my/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** restoreFromTrash POST /api/notes/restore */
export async function restoreFromTrashUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** moveToTrash POST /api/notes/trash */
export async function moveToTrashUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/trash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** updateNotes POST /api/notes/update */
export async function updateNotesUsingPost(
  body: API.NotesUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/notes/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
