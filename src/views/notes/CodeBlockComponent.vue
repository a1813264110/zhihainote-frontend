<template>
  <node-view-wrapper class="code-block">
    <!-- 语言选择器 -->
    <select contenteditable="false" v-model="selectedLanguage" @change="updateLanguage">
      <option :value="null">auto</option>
      <option disabled>—</option>
      <option v-for="(language, index) in languages" :value="language" :key="index">
        {{ language }}
      </option>
    </select>
    <!-- Tiptap 渲染代码内容的地方 -->
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-3";
import { ref, computed } from "vue";

const props = defineProps(nodeViewProps);

// 获取支持的语言列表 (从 lowlight 实例获取)
const languages = computed(() => {
  // Make sure extension and lowlight are available
  if (!props.extension || !props.extension.options || !props.extension.options.lowlight) {
    return [];
  }
  return props.extension.options.lowlight.listLanguages();
});

// 当前选中的语言，与节点的 language 属性绑定
const selectedLanguage = computed({
  get: () => props.node.attrs.language,
  set: (language) => {
    props.updateAttributes({ language });
  },
});

// 更新语言的方法 (虽然 v-model 已经处理了，但保留以防需要更复杂逻辑)
const updateLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedLanguage.value = target.value || null; // Set to null if 'auto' is selected
};
</script>

<style scoped>
.code-block {
  position: relative;
  /* background-color: #f5f5f5; /* Optional: background for the whole block */
  /* border-radius: 4px; */
  /* margin: 1em 0; */
}

select {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.8rem;
  padding: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  opacity: 0.8; /* Make it slightly transparent */
  transition: opacity 0.2s;
}

select:hover,
select:focus {
  opacity: 1; /* Fully visible on hover/focus */
}

/* Ensure pre takes the full width and respects the theme */
pre {
  margin: 0; /* Remove default margin if needed */
  width: 100%;
  box-sizing: border-box; /* Include padding in width calculation */
}

/* Ensure node-view-content is block level for proper layout inside pre > code */
:deep(code) {
  display: block;
}
</style>
