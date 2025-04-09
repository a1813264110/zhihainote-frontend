// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 创建笔记链接 POST /notelinks/create */
export async function createNoteLinkUsingPost(
  params: {
    sourceNoteId: string;
    targetNoteId: string;
    linkType: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notelinks/create", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除笔记链接 DELETE /notelinks/delete */
export async function deleteNoteLinkUsingDelete(
  params: {
    sourceNoteId: string;
    targetNoteId: string;
    linkType?: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notelinks/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取笔记的所有链接 GET /notelinks/list */
export async function getNoteLinksUsingGet(
  params: {
    noteId: string;
    linkType?: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListNoteLinks>("/notelinks/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量创建笔记链接（仅管理员可用） POST /notelinks/batch/create */
export async function batchCreateNoteLinksUsingPost(
  params: {
    sourceNoteId: string;
    targetNoteIds: string[];
    linkType: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/notelinks/batch/create", {
    method: "POST",
    params: {
      ...params,
      targetNoteIds: params.targetNoteIds.join(',')
    },
    ...(options || {}),
  });
} 