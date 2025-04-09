// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 文件上传 POST /file/upload */
export async function uploadFileUsingPost(
  body: {
    file: File;
  },
  params: {
    biz: string;
  },
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  
  // 添加文件
  if (body.file) {
    formData.append("file", body.file);
  }
  
  return request<API.BaseResponseString>("/file/upload", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      ...params,
    },
    data: formData,
    ...(options || {}),
  });
} 