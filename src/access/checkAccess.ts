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
  
  // 如果用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户没登录，那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  
  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果不是管理员，那么无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  
  return true;
}
