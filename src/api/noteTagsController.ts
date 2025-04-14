// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** addTagToNote POST /api/note/tags/add */
export async function addTagToNoteUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addTagToNoteUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/note/tags/add", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getTagsByNoteId GET /api/note/tags/list/by/note */
export async function getTagsByNoteIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagsByNoteIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfListOfTagsVO>("/api/note/tags/list/by/note", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getNotesByTagId GET /api/note/tags/list/notes/by/tag */
export async function getNotesByTagIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotesByTagIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfListOflong>("/api/note/tags/list/notes/by/tag", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** removeTagFromNote POST /api/note/tags/remove */
export async function removeTagFromNoteUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeTagFromNoteUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/note/tags/remove", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
