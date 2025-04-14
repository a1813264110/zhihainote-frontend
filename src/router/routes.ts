import { RouteRecordRaw } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import NoteListView from "../views/notes/NoteListView.vue";
import NoteEditView from "../views/notes/NoteEditView.vue";
import LoginView from "../views/user/LoginView.vue";
import RegisterView from "../views/user/RegisterView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import NoAuthPage from "../views/NoAuthPage.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "首页",
    component: MainLayout,
    redirect: "/notes",
    children: [
      {
        path: "notes",
        name: "笔记列表",
        component: NoteListView,
        meta: {
          title: "所有笔记",
        },
      },
      {
        path: "notes/edit/:id?",
        name: "编辑笔记",
        component: NoteEditView,
        props: true,
        meta: {
          title: "编辑笔记",
          hideInMenu: true,
          access: ACCESS_ENUM.USER,
        },
      },
    ],
  },
  {
    path: "/user",
    name: "用户",
    component: MainLayout,
    meta: {
      hideInMenu: true,
    },
    children: [
      {
        path: "login",
        name: "登录",
        component: LoginView,
        meta: {
          title: "用户登录",
          hideInMenu: true,
        },
      },
      {
        path: "register",
        name: "注册",
        component: RegisterView,
        meta: {
          title: "用户注册",
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthPage,
    meta: {
      hideInMenu: true,
    },
  },
];