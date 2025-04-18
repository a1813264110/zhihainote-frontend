// @ts-ignore
/* eslint-disable */
import request  from "@/request";

/** addTags POST /api/tags/add */
export async function addTagsUsingPost(body: API.TagsAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseOflong>("/api/tags/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getTagCloud GET /api/tags/cloud */
export async function getTagCloudUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagCloudUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfListOfTagsVO>("/api/tags/cloud", {
    method: "GET",
    params: {
      // limit has a default value: 20
      limit: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteTags POST /api/tags/delete */
export async function deleteTagsUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/tags/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editTags POST /api/tags/edit */
export async function editTagsUsingPost(
  body: API.TagsEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/tags/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getTagsVOById GET /api/tags/get/vo */
export async function getTagsVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagsVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfTagsVO>("/api/tags/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listTagsByPage POST /api/tags/list/page */
export async function listTagsByPageUsingPost(body: API._3, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfTags>("/api/tags/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listTagsVOByPage POST /api/tags/list/page/vo */
export async function listTagsVoByPageUsingPost(body: API._3, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfTagsVO>("/api/tags/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyTagsVOByPage POST /api/tags/my/list/page/vo */
export async function listMyTagsVoByPageUsingPost(body: API._3, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfTagsVO>("/api/tags/my/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** updateTags POST /api/tags/update */
export async function updateTagsUsingPost(
  body: API.TagsUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/tags/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
