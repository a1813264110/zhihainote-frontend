<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import "@arco-design/web-vue/dist/arco.css";
import { useLoginUserStore } from '@/store/userStore';
import { useNotesStore } from '@/store/notesStore';

const route = useRoute();
const router = useRouter();
const userStore = useLoginUserStore();
const notesStore = useNotesStore();

const doInit = async () => {
  console.log("知海笔记应用初始化");
  
  // 加载用户信息
  await userStore.fetchLoginUser();
  
  // 预加载笔记数据
  if (route.path === '/notes' || route.path === '/') {
    await notesStore.fetchNotes();
  }
};

onMounted(() => {
  doInit();
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:root {
  --primary-color: rgb(var(--primary-6));
  --border-radius-small: 2px;
  --border-radius-medium: 4px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
}
</style>
