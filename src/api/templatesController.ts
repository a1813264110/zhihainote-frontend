// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 创建模板 POST /templates/add */
export async function addTemplateUsingPost(
  body: API.TemplateAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/templates/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取模板详情 GET /templates/get/{templateId} */
export async function getTemplateByIdUsingGet(
  params: {
    templateId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTemplates>(`/templates/get/${params.templateId}`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取模板列表（分页） POST /templates/list */
export async function listTemplatesUsingPost(
  body: API.TemplateQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageTemplates>("/templates/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取热门模板列表 GET /templates/list/popular */
export async function getPopularTemplatesUsingGet(
  params?: {
    limit?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTemplates>("/templates/list/popular", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前登录用户创建的模板列表 POST /templates/my/list */
export async function listMyTemplatesUsingPost(
  body: API.TemplateQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageTemplates>("/templates/my/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新模板 PUT /templates/update */
export async function updateTemplateUsingPut(
  body: API.TemplateUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/templates/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除模板 DELETE /templates/delete/{templateId} */
export async function deleteTemplateUsingDelete(
  params: {
    templateId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>(`/templates/delete/${params.templateId}`, {
    method: "DELETE",
    ...(options || {}),
  });
}

/** 使用模板（记录使用次数） POST /templates/use/{templateId} */
export async function useTemplateUsingPost(
  params: {
    templateId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>(`/templates/use/${params.templateId}`, {
    method: "POST",
    ...(options || {}),
  });
} 