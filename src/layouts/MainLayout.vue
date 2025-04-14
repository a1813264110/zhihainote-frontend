<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider
      :collapsed="collapsed"
      collapsible
      class="layout-sider"
      :width="240"
    >
      <div class="logo">
        <img 
          src="@/assets/logo.png" 
          alt="知海笔记" 
          v-if="false"
        />
        <span class="logo-text" v-if="!collapsed">知海笔记</span>
      </div>
      <a-menu
        :selected-keys="selectedKeys"
        :default-open-keys="['notes']"
        @menu-item-click="handleMenuItemClick"
        class="layout-menu"
      >
        <a-menu-item key="all-notes">
          <template #icon><icon-file /></template>
          所有笔记
        </a-menu-item>
        <a-menu-item key="tags">
          <template #icon><icon-tag /></template>
          标签管理
        </a-menu-item>
        <a-menu-item key="templates">
          <template #icon><icon-bookmark /></template>
          模板管理
        </a-menu-item>
        <a-menu-item key="trash">
          <template #icon><icon-delete /></template>
          回收站
        </a-menu-item>
        <a-menu-item key="settings">
          <template #icon><icon-settings /></template>
          设置
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <a-button
            class="collapse-btn"
            type="text"
            @click="toggleCollapse"
          >
            <icon-menu-fold v-if="!collapsed" />
            <icon-menu-unfold v-else />
          </a-button>
          <a-breadcrumb :routes="breadcrumbRoutes">
            <template #item="{ route }">
              {{ route.breadcrumbName }}
            </template>
          </a-breadcrumb>
        </div>
        <div class="header-right">
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="搜索笔记..."
            allow-clear
            @search="onSearch"
          />
          <a-dropdown trigger="click">
            <a-avatar 
              :style="{ backgroundColor: '#165DFF', marginLeft: '20px', cursor: 'pointer' }"
            >
              {{ userStore.loginUser.userName.substring(0, 1) }}
            </a-avatar>
            <template #content>
              <a-doption>
                <a-space>
                  <icon-user />
                  <span>{{ userStore.loginUser.userName }}</span>
                </a-space>
              </a-doption>
              <a-doption>
                <a-space @click="onProfile">
                  <icon-user-add />
                  <span>个人资料</span>
                </a-space>
              </a-doption>
              <a-doption>
                <a-space @click="onLogout">
                  <icon-poweroff />
                  <span>退出登录</span>
                </a-space>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconFile, 
  IconTag, 
  IconDelete, 
  IconSettings, 
  IconBookmark,
  IconMenuFold,
  IconMenuUnfold,
  IconUser,
  IconUserAdd,
  IconPoweroff
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { useLoginUserStore } from '@/store/userStore';

const router = useRouter();
const route = useRoute();
const userStore = useLoginUserStore();

// 控制侧边栏的展开/收起
const collapsed = ref(false);
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

// 计算当前选中的菜单项
const selectedKeys = computed(() => {
  const path = route.path;
  if (path.includes('/notes')) return ['all-notes'];
  if (path.includes('/tags')) return ['tags'];
  if (path.includes('/templates')) return ['templates'];
  if (path.includes('/trash')) return ['trash'];
  if (path.includes('/settings')) return ['settings'];
  return ['all-notes'];
});

// 计算面包屑
const breadcrumbRoutes = computed(() => {
  const routeName = route.meta.title || route.name || '首页';
  return [
    {
      path: '/',
      breadcrumbName: '首页',
    },
    {
      path: route.path,
      breadcrumbName: routeName as string,
    },
  ];
});

// 菜单项点击处理
const handleMenuItemClick = (key: string) => {
  switch (key) {
    case 'all-notes':
      router.push('/notes');
      break;
    case 'tags':
      router.push('/tags');
      break;
    case 'templates':
      router.push('/templates');
      break;
    case 'trash':
      router.push('/trash');
      break;
    case 'settings':
      router.push('/settings');
      break;
    default:
      break;
  }
};

// 搜索处理
const onSearch = (searchValue: string) => {
  router.push({
    path: '/notes',
    query: searchValue ? { search: searchValue } : {}
  });
};

// 个人资料
const onProfile = () => {
  router.push('/user/profile');
};

// 退出登录
const onLogout = async () => {
  const result = await userStore.logout();
  if (result) {
    router.push('/user/login');
  }
};

// 监听路由变化，更新面包屑
watch(
  () => route.path,
  (newPath) => {
    // 可以根据需要在路由变化时执行一些操作
  }
);

onMounted(() => {
  // 检查用户登录状态
  if (userStore.loginUser.userRole === 'NOT_LOGIN') {
    userStore.fetchLoginUser();
  }
});
</script>

<style scoped>
.layout-container {
  height: 100%;
  width: 100%;
  display: flex;
  background-color: var(--color-bg-2);
}

.layout-sider {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.logo img {
  height: 32px;
  margin-right: 10px;
}

.logo-text {
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 500;
}

.layout-menu {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.layout-header {
  background-color: var(--color-bg-2);
  padding: 0 20px;
  height: 64px;
  line-height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px 0 rgba(29, 35, 41, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  margin-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.layout-content {
  padding: 20px;
  margin-left: 240px;
  transition: margin-left 0.2s;
  min-height: calc(100vh - 64px);
}

.layout-container:has(.layout-sider.arco-layout-sider-collapsed) .layout-content {
  margin-left: 48px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 