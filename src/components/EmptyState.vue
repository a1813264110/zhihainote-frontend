<template>
  <div class="empty-state-container">
    <div class="empty-state">
      <div class="empty-icon">
        <slot name="icon">
          <icon-empty />
        </slot>
      </div>
      <div class="empty-title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="empty-description" v-if="description">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <div class="empty-action" v-if="$slots.action">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEmpty } from '@arco-design/web-vue/es/icon';

// 定义组件属性
defineProps({
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.empty-state-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--color-text-4);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--color-text-3);
  margin-bottom: 16px;
  line-height: 1.5;
}

.empty-action {
  margin-top: 16px;
}
</style> 