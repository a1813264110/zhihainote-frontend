// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 创建备份 POST /backups/create */
export async function createBackupUsingPost(
  body: API.BackupCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBackups>("/backups/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户备份列表 GET /backups/list */
export async function listBackupsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListBackups>("/backups/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 下载备份 GET /backups/download/{backupId} */
export async function downloadBackupUsingGet(
  params: {
    backupId: string;
  },
  options?: { [key: string]: any }
) {
  return request<any>(`/backups/download/${params.backupId}`, {
    method: "GET",
    responseType: "blob",
    ...(options || {}),
  });
}

/** 从备份恢复 POST /backups/restore */
export async function restoreFromBackupUsingPost(
  body: API.BackupRestoreRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/backups/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除备份 POST /backups/delete/{backupId} */
export async function deleteBackupUsingPost(
  params: {
    backupId: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>(`/backups/delete/${params.backupId}`, {
    method: "POST",
    ...(options || {}),
  });
}

/** 管理员查看所有备份 GET /backups/admin/list */
export async function listAllBackupsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListBackups>("/backups/admin/list", {
    method: "GET",
    ...(options || {}),
  });
} 