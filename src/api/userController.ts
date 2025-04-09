// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 用户注册 POST /user/register */
export async function userRegisterUsingPost(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登录 POST /user/login */
export async function userLoginUsingPost(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLoginUserVO>("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注销 POST /user/logout */
export async function userLogoutUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 获取当前登录用户 GET /user/get/login */
export async function getLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>("/user/get/login", {
    method: "GET",
    ...(options || {}),
  });
}

/** 创建用户（管理员） POST /user/add */
export async function addUserUsingPost(
  body: API.UserAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户（管理员） POST /user/delete */
export async function deleteUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户（管理员） POST /user/update */
export async function updateUserUsingPost(
  body: API.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id获取用户（管理员） GET /user/get */
export async function getUserByIdUsingGet(
  params: {
    id: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUser>("/user/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据id获取用户包装类 GET /user/get/vo */
export async function getUserVOByIdUsingGet(
  params: {
    id: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVO>("/user/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取用户列表（管理员） POST /user/list/page */
export async function listUserByPageUsingPost(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUser>("/user/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户封装列表 POST /user/list/page/vo */
export async function listUserVOByPageUsingPost(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUserVO>("/user/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新个人信息 POST /user/update/my */
export async function updateMyUserUsingPost(
  body: API.UserUpdateMyRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update/my", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
} 