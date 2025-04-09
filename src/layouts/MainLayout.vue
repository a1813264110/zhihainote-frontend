<template>
  <div class="main-layout">
    <a-layout class="layout-container">
      <!-- 侧边栏 -->
      <a-layout-sider
        class="layout-sider"
        :collapsed="siderCollapsed"
        :collapsible="true"
        :width="240"
        breakpoint="xl"
        @collapse="handleSiderCollapse"
      >
        <div class="app-logo">
          <a-link href="/">
            <h1 class="app-title">知海笔记</h1>
          </a-link>
        </div>
        <side-navigation :collapsed="siderCollapsed" />
      </a-layout-sider>

      <a-layout>
        <!-- 顶部导航 -->
        <a-layout-header class="layout-header">
          <header-bar :collapsed="siderCollapsed" @toggle="toggleSider" />
        </a-layout-header>

        <!-- 主内容区域 -->
        <a-layout-content class="layout-content">
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideNavigation from '@/components/sidebar/SideNavigation.vue';
import HeaderBar from '@/components/header/HeaderBar.vue';

// 侧边栏折叠状态
const siderCollapsed = ref(false);

// 处理侧边栏折叠状态变化
const handleSiderCollapse = (collapsed: boolean) => {
  siderCollapsed.value = collapsed;
};

// 切换侧边栏折叠状态
const toggleSider = () => {
  siderCollapsed.value = !siderCollapsed.value;
};
</script>

<style scoped>
.main-layout {
  height: 100%;
}

.layout-container {
  height: 100%;
}

.layout-sider {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.layout-header {
  background-color: var(--color-bg-1);
  padding: 0;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid var(--color-border);
}

.layout-content {
  padding: 16px;
  background-color: var(--color-bg-2);
  height: calc(100% - 60px);
  overflow: auto;
}

.app-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
}

.app-title {
  color: rgb(var(--primary-6));
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
</style> 