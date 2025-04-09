<template>
  <div class="side-navigation">
    <a-menu
      :style="{ width: '100%' }"
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['sub1']"
      showCollapseButton
    >
      <!-- 主要导航项 -->
      <a-menu-item key="1" @click="router.push('/notes')">
        <template #icon><icon-home /></template>
        所有笔记
      </a-menu-item>
      <a-menu-item key="2" @click="handleFilter('favorite')">
        <template #icon><icon-star /></template>
        收藏
      </a-menu-item>
      <a-menu-item key="3" @click="handleTagsManage">
        <template #icon><icon-tag /></template>
        标签
      </a-menu-item>
      
      <a-divider style="margin: 8px 0" />
      
      <!-- 笔记分类 -->
      <a-sub-menu key="sub1">
        <template #icon><icon-folder /></template>
        <template #title>笔记本</template>
        <a-menu-item key="4" @click="handleCategory('工作文档')">工作文档</a-menu-item>
        <a-menu-item key="5" @click="handleCategory('学习计划')">学习计划</a-menu-item>
        <a-menu-item key="6" @click="handleCategory('个人笔记')">个人笔记</a-menu-item>
      </a-sub-menu>
      
      <a-divider style="margin: 8px 0" />
      
      <!-- 标签列表 -->
      <a-sub-menu key="sub2">
        <template #icon><icon-tags /></template>
        <template #title>标签列表</template>
        <a-menu-item key="7" @click="handleTagFilter('Java学习')">Java学习</a-menu-item>
        <a-menu-item key="8" @click="handleTagFilter('Spring Boot')">Spring Boot</a-menu-item>
        <a-menu-item key="9" @click="handleTagFilter('项目计划')">项目计划</a-menu-item>
      </a-sub-menu>

      <!-- 底部操作按钮 -->
      <div class="sidebar-footer" v-if="!collapsed">
        <a-button type="primary" long @click="createNewNote">
          <template #icon><icon-plus /></template>
          新建笔记
        </a-button>
      </div>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { IconHome, IconStar, IconTag, IconFolder, IconTags, IconPlus } from '@arco-design/web-vue/es/icon';
import { useRouter } from 'vue-router';
import { useNotesStore } from '@/store/notesStore';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const notesStore = useNotesStore();

// 过滤笔记：收藏
const handleFilter = (filter: string) => {
  notesStore.setFilter(filter);
  router.push('/notes');
};

// 过滤笔记：标签
const handleTagFilter = (tag: string) => {
  notesStore.setFilter('byTag', tag);
  router.push('/notes');
};

// 过滤笔记：分类（未实现）
const handleCategory = (category: string) => {
  console.log('按分类筛选:', category);
  // 实际应用中需要按分类筛选笔记
  router.push('/notes');
};

// 标签管理（未实现）
const handleTagsManage = () => {
  console.log('标签管理');
  // 实际应用中需要跳转到标签管理页面
  router.push('/notes');
};

// 创建新笔记
const createNewNote = () => {
  router.push('/notes/edit');
};
</script>

<style scoped>
.side-navigation {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--color-border);
}
</style> 