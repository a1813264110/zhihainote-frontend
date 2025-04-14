// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** getApiExample GET /api/api/docs/${param0} */
export async function getApiExampleUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiExampleUsingGETParams,
  options?: { [key: string]: any }
) {
  const { apiName: param0, ...queryParams } = params;
  return request<API.BaseResponseOfMapOfstringAndobject>(`/api/api/docs/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** getApiList GET /api/api/docs/list */
export async function getApiListUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseOfArrayOfstring>("/api/api/docs/list", {
    method: "GET",
    ...(options || {}),
  });
}
