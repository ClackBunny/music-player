<!--
 * 登录组件
 * 
 * @Author: kongxin
 * @Date: 2025/4/18 14:59:34
 * @LastEditors: kongxin
 -->
<template>
  <div class="qr-login-container">
    <img class="qr-img" :src="qrSrc" alt="扫码二维码"/>
    <div class="prompt">
      <template v-if="countdown > 0 && statusMessage.includes('登录成功')">
        登录成功！<span class="countdown">{{ countdown }}</span> 秒后自动关闭
      </template>
      <template v-else>
        {{ statusMessage }}
      </template>
    </div>
    <div class="action-row">
      <a-button type="primary" @click="refresh(Date.now()); setPolling();">刷新二维码</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { loginQrCheck, loginQrCreate, loginQrKey } from "@/api/login";
import { message } from "ant-design-vue";

const props = defineProps(['doneLogin', 'closeLogin']);
const qrSrc = ref('');
const key = ref('');
const statusMessage = ref('等待扫码...');
const countdown = ref(5); // 登录成功后的倒计时

let timer: number | null = null;
let closeTimer: number | null = null;
let countdownTimer: number | null = null;

// 刷新二维码并生成 key
async function refresh(timeStamp: number = 0) {
  const res = await loginQrKey(timeStamp);
  key.value = res.data.unikey;
  const qrRes = await loginQrCreate(key.value);
  qrSrc.value = qrRes.data.qrimg;
  statusMessage.value = '等待扫码...';
}

// 轮询检查扫码状态
async function checkLoginStatus() {
  if (!key.value) return;

  const res = await loginQrCheck(key.value);

  switch (res.code) {
    case 800:
      message.warning("二维码已过期，请重新获取");
      statusMessage.value = "二维码已过期";
      clearPolling();
      break;
    case 801:
      statusMessage.value = "等待扫码...";
      break;
    case 802:
      statusMessage.value = "扫码成功，等待授权...";
      break;
    case 803:
      clearPolling();
      props.doneLogin();
      startAutoClose();
      break;
  }
}

// 开启轮询
function setPolling() {
  if (!timer) {
    timer = setInterval(checkLoginStatus, 3000);
  }
}

// 清除轮询
function clearPolling() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// 登录成功后 5 秒倒计时自动关闭
function startAutoClose() {
  countdown.value = 5;
  statusMessage.value = `登录成功！${countdown.value} 秒后自动关闭`;

  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      message.success("即将关闭页面");
      // 实际关闭逻辑
      props.closeLogin();
    } else {
      statusMessage.value = `登录成功！${countdown.value} 秒后自动关闭`;
    }
  }, 1000);
}

onMounted(() => {
  refresh();
  setPolling();
});

onBeforeUnmount(() => {
  clearPolling();
  if (closeTimer) clearTimeout(closeTimer);
  if (countdownTimer) clearInterval(countdownTimer);
});

</script>

<style scoped lang="scss">
.qr-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  .qr-img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .prompt {
    margin-top: 16px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }

  .action-row {
    margin-top: 16px;
  }

  .countdown {
    font-weight: bold;
    color: #f5222d;
  }

}
</style>
