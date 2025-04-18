<!--
 * 登录组件
 * 
 * @Author: kongxin
 * @Date: 2025/4/18 14:59:34
 * @LastEditors: kongxin
 -->
<template>
  <img :src="qrSrc" alt="qrcode">
  <button @click="refresh">生成新的key</button>
  /
  <button @click="handleCheck">检查</button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loginQrCheck, loginQrCreate, loginQrKey } from "@/api/login.ts";
import { message } from "ant-design-vue";

const qrSrc = ref('')
const key = ref("");


async function handleCheck() {
  const res = await loginQrCheck(key.value);
  message.info(res.message);
}

async function refresh() {
  key.value = (await loginQrKey()).data.unikey;
  console.log("refresh, key", key.value);
  const qrRes = await loginQrCreate(key.value);
  console.log("qrres", qrRes);
  qrSrc.value = qrRes.data.qrimg;
  console.log("refresh, qrsrc", qrSrc.value);
}

onMounted(() => {
  refresh()
})
</script>

<style scoped lang="scss">

</style>