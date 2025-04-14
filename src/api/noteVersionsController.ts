// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** cleanupOldVersions POST /api/versions/cleanup */
export async function cleanupOldVersionsUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cleanupOldVersionsUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOflong>("/api/versions/cleanup", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteVersions POST /api/versions/delete */
export async function deleteVersionsUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/versions/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteVersions POST /api/versions/delete/batch */
export async function batchDeleteVersionsUsingPost(
  body: API.DeleteRequest[],
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/versions/delete/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getVersionById GET /api/versions/get/vo */
export async function getVersionByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getVersionByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfNoteVersionsVO>("/api/versions/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listVersionsByPage POST /api/versions/list/page/vo */
export async function listVersionsByPageUsingPost(body: API._1, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfNoteVersionsVO>("/api/versions/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
