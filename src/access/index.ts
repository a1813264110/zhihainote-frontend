import router from "@/router";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
import { LoginUserVO } from "@/store/userStore";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  // 如果之前没登陆过，自动登录
  if (!loginUserStore.loginUser.userRole) {
    await loginUserStore.fetchLoginUser();
  }
  const { loginUser } = loginUserStore;
  
  // 如果访问的页面不需要权限，则直接放行
  const needAccess = (to.meta?.access as string) ?? "";
  if (!needAccess) {
    next();
    return;
  }
  
  // 使用 checkAccess 进行统一的权限检查
  if (!checkAccess(loginUser, needAccess)) {
    // 如果用户未登录，重定向到登录页面
    if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    
    // 其他情况（已登录但权限不足），跳转到无权限页面
    next("/noAuth");
    return;
  }
  
  // 通过权限检查，放行
  next();
});
