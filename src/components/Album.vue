<template>
  这是专辑{{ keyword }}-{{ type }}
  <div>
    {{ albumList }}
  </div>
</template>

<script setup lang="ts">
import { search } from "@/api/search.ts";
import { onMounted, ref, toRefs } from "vue";
import { type AlbumResultData, SearchType } from "@/type/searchType.ts";
import type { Album } from "@/type/type.ts";

// 定义组件入参props和自定义事件(send-count)
const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const albumList = ref<Album[]>([])
const totalCount = ref(0)

console.log("专辑", keyword, type);

const loadData = async (keyword: string) => {
  let res = (await search(keyword, SearchType.ALBUM)).result as AlbumResultData;
  albumList.value = res.albums;
  totalCount.value = res.albumCount;
  emit("send-count", totalCount.value);
}
onMounted(
    () => {
      loadData(keyword.value)
    }
)
</script>

<style scoped lang="scss">

</style>