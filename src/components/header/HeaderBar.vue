<template>
  <div class="header-bar">
    <div class="left-section">
      <a-button class="menu-toggle" type="text" @click="$emit('toggle')">
        <icon-menu />
      </a-button>

      <a-input-search
        class="search-input"
        placeholder="搜索笔记..."
        :style="{ width: '300px' }"
        allow-clear
      />
    </div>

    <div class="right-section">
      <a-space>
        <a-button type="text" shape="circle">
          <template #icon><icon-notification /></template>
        </a-button>

        <a-dropdown trigger="click">
          <a-avatar :size="32" style="background-color: #3370ff; cursor: pointer">
            <icon-user />
          </a-avatar>
          <template #content>
            <a-doption>
              <template #icon><icon-settings /></template>
              设置
            </a-doption>
            <a-doption>
              <template #icon><icon-export /></template>
              退出登录
            </a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconMenu,
  IconUser,
  IconSettings,
  IconExport,
  IconNotification,
} from "@arco-design/web-vue/es/icon";

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle"]);
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 100%;
}

.left-section {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 12px;
}

.search-input {
  margin-left: 12px;
}

.right-section {
  display: flex;
  align-items: center;
}
</style>
