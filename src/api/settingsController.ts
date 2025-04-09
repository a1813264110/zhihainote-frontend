// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 获取当前用户设置 GET /settings/current */
export async function getCurrentUserSettingsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseSettings>("/settings/current", {
    method: "GET",
    ...(options || {}),
  });
}

/** 更新当前用户设置 POST /settings/update */
export async function updateUserSettingsUsingPost(
  body: API.SettingsUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/settings/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据配置类型获取特定设置 GET /settings/by/type */
export async function getSettingsByTypeUsingGet(
  params: {
    type: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseObject>("/settings/by/type", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新特定类型的设置 POST /settings/update/type */
export async function updateSettingsByTypeUsingPost(
  params: {
    type: string;
  },
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/settings/update/type", {
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