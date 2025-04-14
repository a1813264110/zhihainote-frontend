/**
 * 用户权限枚举
 */
enum ACCESS_ENUM {
  NOT_LOGIN = "NOT_LOGIN", // 未登录
  USER = "USER",           // 普通用户
  ADMIN = "ADMIN",         // 管理员
  BAN = "BAN"              // 被封号
}

export default ACCESS_ENUM;
