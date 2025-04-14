import { defineStore } from "pinia";
import { ref } from "vue";
import { 
  getLoginUserUsingGet, 
  userLoginUsingPost, 
  userLogoutUsingPost, 
  userRegisterUsingPost 
} from "@/api/userController";
import ACCESS_ENUM from "@/access/accessEnum";
import { Message } from "@arco-design/web-vue";
import router from "@/router";

// 用户登录状态存储键名
const USER_INFO_KEY = 'zhihainote_user_info';

/**
 * 登录用户信息全局状态
 */

// 定义用户类型
export interface LoginUserVO {
  id: string | number;
  userAccount?: string;
  userName: string;
  userAvatar?: string;
  userRole: string; 
  createTime?: Date | string;
  updateTime?: Date | string;
  token?: string;
}

// 根据API结构模拟用户服务
const mockUserService = {
  getLoginUser: () => {
    return Promise.resolve({
      data: {
        code: 0,
        data: null,
        message: "success"
      }
    });
  },
  login: (params: {userAccount: string, userPassword: string}) => {
    return Promise.resolve({
      data: {
        code: 0,
        data: {
          id: "1",
          userName: params.userAccount,
          userRole: "user"
        },
        message: "success"
      }
    });
  },
  logout: () => {
    return Promise.resolve({
      data: {
        code: 0,
        data: true,
        message: "success"
      }
    });
  },
  register: (params: {userAccount: string, userPassword: string, checkPassword: string}) => {
    return Promise.resolve({
      data: {
        code: 0,
        data: true,
        message: "success"
      }
    });
  }
};

export const useLoginUserStore = defineStore("loginUser", () => {
  // 初始化时尝试从本地存储恢复用户状态
  const getInitialUserState = (): LoginUserVO => {
    try {
      const savedUserInfo = localStorage.getItem(USER_INFO_KEY);
      if (savedUserInfo) {
        return JSON.parse(savedUserInfo);
      }
    } catch (error) {
      console.error('Failed to parse saved user info', error);
    }
    
    return {
      id: 0,
      userName: "未登录",
      userRole: "NOT_LOGIN",
    };
  };

  const loginUser = ref<LoginUserVO>(getInitialUserState());

  function setLoginUser(newLoginUser: LoginUserVO) {
    loginUser.value = newLoginUser;
    
    // 将用户信息保存到本地存储
    if (newLoginUser.id !== 0 && newLoginUser.userRole !== "NOT_LOGIN") {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(newLoginUser));
    } else {
      // 如果是未登录状态，清除本地存储
      localStorage.removeItem(USER_INFO_KEY);
    }
  }

  // 获取当前登录用户
  async function fetchLoginUser() {
    try {
      const res = await getLoginUserUsingGet();
      if (res.data.code === 0 && res.data.data) {
        setLoginUser(res.data.data as LoginUserVO);
      } else {
        // 获取不到用户信息，设为未登录状态
        setLoginUser({ 
          id: 0, 
          userName: "未登录", 
          userRole: "NOT_LOGIN" 
        });
      }
    } catch (error) {
      console.error("获取登录用户信息失败", error);
      setLoginUser({ 
        id: 0, 
        userName: "未登录", 
        userRole: "NOT_LOGIN" 
      });
    }
  }

  // 用户登录
  async function login(userAccount: string, userPassword: string) {
    try {
      const res = await userLoginUsingPost({
        userAccount,
        userPassword,
      });
      
      if (res.data.code === 0 && res.data.data) {
        const userData = res.data.data as LoginUserVO;
        
        // 保存用户信息到 store 和 localStorage
        setLoginUser(userData);
        Message.success("登录成功");
        return true;
      } else {
        Message.error(res.data.message || "登录失败");
        return false;
      }
    } catch (error) {
      console.error("登录失败", error);
      Message.error("登录失败");
      return false;
    }
  }

  // 用户注册
  async function register(userAccount: string, userPassword: string, checkPassword: string) {
    try {
      const res = await userRegisterUsingPost({
        userAccount,
        userPassword,
        checkPassword,
      });
      if (res.data.code === 0) {
        Message.success("注册成功");
        return true;
      } else {
        Message.error(res.data.message || "注册失败");
        return false;
      }
    } catch (error) {
      console.error("注册失败", error);
      Message.error("注册失败");
      return false;
    }
  }

  // 用户注销
  async function logout() {
    try {
      const res = await userLogoutUsingPost();
      
      // 无论后端返回如何，都清除本地存储的用户信息
      setLoginUser({ 
        id: 0, 
        userName: "未登录", 
        userRole: "NOT_LOGIN" 
      });
      
      if (res.data.code === 0) {
        Message.success("注销成功");
        router.push("/user/login");
        return true;
      } else {
        Message.error(res.data.message || "注销失败");
        return false;
      }
    } catch (error) {
      console.error("注销失败", error);
      Message.error("注销失败");
      
      // 即使发生错误，也尝试清除用户状态
      setLoginUser({ 
        id: 0, 
        userName: "未登录", 
        userRole: "NOT_LOGIN" 
      });
      
      return false;
    }
  }
  
  // 检查登录状态
  function isLoggedIn() {
    return loginUser.value.id !== 0 && loginUser.value.userRole !== "NOT_LOGIN";
  }

  return { 
    loginUser, 
    setLoginUser, 
    fetchLoginUser,
    login,
    register,
    logout,
    isLoggedIn
  };
});
