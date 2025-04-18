// @ts-ignore
/* eslint-disable */
import request  from "@/request";

/** addTemplates POST /api/templates/add */
export async function addTemplatesUsingPost(
  body: API.TemplatesAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOflong>("/api/templates/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteTemplates POST /api/templates/delete */
export async function deleteTemplatesUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/templates/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editTemplates POST /api/templates/edit */
export async function editTemplatesUsingPost(
  body: API.TemplatesEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/templates/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** exportTemplate GET /api/templates/export */
export async function exportTemplateUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.exportTemplateUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfstring>("/api/templates/export", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getTemplatesVOById GET /api/templates/get/vo */
export async function getTemplatesVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTemplatesVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfTemplatesVO>("/api/templates/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** importTemplate POST /api/templates/import */
export async function importTemplateUsingPost(body: string, options?: { [key: string]: any }) {
  return request<API.BaseResponseOflong>("/api/templates/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listTemplatesByPage POST /api/templates/list/page */
export async function listTemplatesByPageUsingPost(body: API._4, options?: { [key: string]: any }) {
  return request<API.BaseResponseOfPageOfTemplates>("/api/templates/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listTemplatesVOByPage POST /api/templates/list/page/vo */
export async function listTemplatesVoByPageUsingPost(
  body: API._4,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfPageOfTemplatesVO>("/api/templates/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyTemplatesVOByPage POST /api/templates/my/list/page/vo */
export async function listMyTemplatesVoByPageUsingPost(
  body: API._4,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfPageOfTemplatesVO>("/api/templates/my/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** previewTemplate POST /api/templates/preview */
export async function previewTemplateUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.previewTemplateUsingPOSTParams,
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfstring>("/api/templates/preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** getRecommendedTemplates GET /api/templates/recommend */
export async function getRecommendedTemplatesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecommendedTemplatesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfListOfTemplatesVO>("/api/templates/recommend", {
    method: "GET",
    params: {
      // limit has a default value: 10
      limit: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** testFieldMapping GET /api/templates/test/field-mapping */
export async function testFieldMappingUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseOfstring>("/api/templates/test/field-mapping", {
    method: "GET",
    ...(options || {}),
  });
}

/** updateTemplates POST /api/templates/update */
export async function updateTemplatesUsingPost(
  body: API.TemplatesUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/templates/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
