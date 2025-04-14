<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">用户登录</div>
      <a-form 
        :model="loginForm" 
        @submit="handleSubmit"
        :style="{width: '100%'}"
      >
        <a-form-item field="userAccount" label="账号">
          <a-input 
            v-model="loginForm.userAccount" 
            placeholder="请输入账号"
          />
        </a-form-item>
        <a-form-item field="userPassword" label="密码">
          <a-input-password 
            v-model="loginForm.userPassword" 
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item>
          <a-space direction="vertical" :size="16" fill>
            <a-button type="primary" html-type="submit" long :loading="loading">
              登录
            </a-button>
            <a-button type="text" long @click="toRegister">
              还没有账号？去注册
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useLoginUserStore } from '@/store/userStore';

const router = useRouter();
const userStore = useLoginUserStore();
const loading = ref(false);

const loginForm = reactive({
  userAccount: '',
  userPassword: ''
});

const handleSubmit = async () => {
  if (!loginForm.userAccount || !loginForm.userPassword) {
    Message.error('账号和密码不能为空');
    return;
  }

  loading.value = true;
  try {
    const result = await userStore.login(
      loginForm.userAccount,
      loginForm.userPassword
    );
    if (result) {
      router.push('/notes');
    }
  } finally {
    loading.value = false;
  }
};

const toRegister = () => {
  router.push('/user/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--color-bg-2);
}

.login-card {
  width: 360px;
  padding: 40px;
  border-radius: 8px;
  background-color: var(--color-bg-1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text-1);
  text-align: center;
  margin-bottom: 24px;
}
</style> 