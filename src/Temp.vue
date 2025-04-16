<template>
<img :src="imgData">
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { loginQrKey } from "@/api/login.ts";

key = ref("")
imgData = ref("");

</script>

<style scoped>
</style>
