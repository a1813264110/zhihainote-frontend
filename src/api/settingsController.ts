// @ts-ignore
/* eslint-disable */
import  request  from "../request";

/** getUserSettings GET /api/settings */
export async function getUserSettingsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseOfSettingsVO>("/api/settings", {
    method: "GET",
    ...(options || {}),
  });
}

/** updateUserSettings PUT /api/settings */
export async function updateUserSettingsUsingPut(
  body: API.SettingsUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOfboolean>("/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
