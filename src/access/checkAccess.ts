import ACCESS_ENUM from "./accessEnum";
import { LoginUserVO } from "@/store/userStore";

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return boolean 有无权限
 */
export default function checkAccess(loginUser: LoginUserVO, needAccess: string): boolean {
  // 获取当前登录用户具有的权限 (如果没有，则默认未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  
  // 如果用户未登录
  if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
    // 任何需要登录的权限都无法访问
    return false;
  }
  
  // 如果用户被封禁
  if (loginUserAccess === ACCESS_ENUM.BAN) {
    return false;
  }
  
  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 只有管理员可以访问
    return loginUserAccess === ACCESS_ENUM.ADMIN;
  }
  
  // 如果需要普通用户权限
  if (needAccess === ACCESS_ENUM.USER) {
    // 管理员和普通用户都可以访问
    return loginUserAccess === ACCESS_ENUM.USER || loginUserAccess === ACCESS_ENUM.ADMIN;
  }
  
  // 默认情况，放行
  return true;
}
