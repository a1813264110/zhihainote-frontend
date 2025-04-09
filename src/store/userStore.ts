import { defineStore } from "pinia";
import { ref } from "vue";
// 由于API可能尚未实现，暂时注释掉API导入
// import { getLoginUserUsingGet } from "@/api/userController";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 登录用户信息全局状态
 */

// 定义用户类型
export interface LoginUserVO {
  id: number;
  userAccount?: string;
  userName: string;
  userAvatar?: string;
  userRole: string; 
  createTime?: Date;
  updateTime?: Date;
  token?: string;
}

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<LoginUserVO>({
    id: 0,
    userName: "未登录",
    userRole: ACCESS_ENUM.NOT_LOGIN,
  });

  function setLoginUser(newLoginUser: LoginUserVO) {
    loginUser.value = newLoginUser;
  }

  async function fetchLoginUser() {
    try {
      // 使用模拟数据
      loginUser.value = { 
        id: 0, 
        userName: "未登录", 
        userRole: ACCESS_ENUM.NOT_LOGIN 
      };
    } catch (error) {
      console.error("获取登录用户信息失败", error);
      loginUser.value = { 
        id: 0, 
        userName: "未登录", 
        userRole: ACCESS_ENUM.NOT_LOGIN 
      };
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});
