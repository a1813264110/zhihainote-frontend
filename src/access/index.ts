import router from "@/router";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
import { LoginUserVO } from "@/store/userStore";

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
  
  // 如果需要登录
  if (needAccess === "user") {
    // 如果没登录，跳转到登录页面
    if (!loginUser || !loginUser.userRole || loginUser.userRole === "notLogin") {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登陆了，但是权限不足，那么跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
