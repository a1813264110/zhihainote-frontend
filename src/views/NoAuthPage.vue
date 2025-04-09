<template>
  <div class="no-auth-container">
    <a-result
      status="403"
      title="403"
      subtitle="抱歉，您无权访问此页面"
    >
      <template #extra>
        <a-button type="primary" @click="goHome">
          返回首页
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.no-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style> 