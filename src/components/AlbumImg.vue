<template>
  <img
      v-show="currentSrc"
      v-bind="{ alt: 'albumImg', ...$attrs }"
      :src="currentSrc"
      @error="handleError"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getAlbumPicUrl } from "@/api/album.ts";

// Props：增加 defaultImg 让调用者自定义默认图
const props = defineProps<{
  albumId: number;
  picUrl?: string;
  defaultImg?: string;
}>()
const currentSrc = ref<string>('')
const attemptedNew = ref(false)

/**
 * 加载失败时尝试获取新图或使用默认图
 */
function handleError(): void {
  console.log("加载图片出错了, currentSrc", currentSrc.value,)
  if (!attemptedNew.value) {
    fetchNewPic()
  } else {
    currentSrc.value = props.defaultImg || './logo.png'
  }
}

/**
 * 异步获取新图
 */
async function fetchNewPic(): Promise<void> {
  try {
    const newUrl = await getAlbumPicUrl(props.albumId)
    if (newUrl) {
      currentSrc.value = newUrl
      attemptedNew.value = true
    } else {
      currentSrc.value = props.defaultImg || './logo.png'
    }
  } catch (error) {
    currentSrc.value = props.defaultImg || './logo.png'
  }
}

// 初始化设置图
onMounted(() => {
  if (props.picUrl) {
    currentSrc.value = props.picUrl
  } else {
    fetchNewPic()
  }
})

watch(() => props.albumId, () => {
  attemptedNew.value = false
  currentSrc.value = props.picUrl || ''
})
</script>
