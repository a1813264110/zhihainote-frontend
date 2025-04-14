<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-title">用户注册</div>
      <a-form 
        :model="registerForm" 
        @submit="handleSubmit"
        :style="{width: '100%'}"
      >
        <a-form-item field="userAccount" label="账号">
          <a-input 
            v-model="registerForm.userAccount" 
            placeholder="请输入账号"
          />
        </a-form-item>
        <a-form-item field="userPassword" label="密码">
          <a-input-password 
            v-model="registerForm.userPassword" 
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item field="checkPassword" label="确认密码">
          <a-input-password 
            v-model="registerForm.checkPassword" 
            placeholder="请再次输入密码"
          />
        </a-form-item>
        <a-form-item>
          <a-space direction="vertical" :size="16" fill>
            <a-button type="primary" html-type="submit" long :loading="loading">
              注册
            </a-button>
            <a-button type="text" long @click="toLogin">
              已有账号？去登录
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

const registerForm = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
});

const handleSubmit = async () => {
  if (!registerForm.userAccount || !registerForm.userPassword || !registerForm.checkPassword) {
    Message.error('账号和密码不能为空');
    return;
  }

  if (registerForm.userPassword !== registerForm.checkPassword) {
    Message.error('两次输入的密码不一致');
    return;
  }

  loading.value = true;
  try {
    const result = await userStore.register(
      registerForm.userAccount,
      registerForm.userPassword,
      registerForm.checkPassword
    );
    if (result) {
      Message.success('注册成功，请登录');
      router.push('/user/login');
    }
  } finally {
    loading.value = false;
  }
};

const toLogin = () => {
  router.push('/user/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--color-bg-2);
}

.register-card {
  width: 360px;
  padding: 40px;
  border-radius: 8px;
  background-color: var(--color-bg-1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text-1);
  text-align: center;
  margin-bottom: 24px;
}
</style> 