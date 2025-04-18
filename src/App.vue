<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
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
/* 全局样式已移至src/styles/目录下的相应文件中 */
</style>
