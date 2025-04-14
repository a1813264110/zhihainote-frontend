// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** getBackupById GET /api/backups/get/vo */
export async function getBackupByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBackupByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfBackupsVO>("/api/backups/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getLatestBackup GET /api/backups/latest */
export async function getLatestBackupUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseOfBackupsVO>("/api/backups/latest", {
    method: "GET",
    ...(options || {}),
  });
}

/** listBackupsByPage POST /api/backups/list/page/vo */
export async function listBackupsByPageUsingPost(
  body: API.Pinyin__,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfPageOfBackupsVO>("/api/backups/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
