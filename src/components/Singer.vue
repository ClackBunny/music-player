<template>
  这是歌手{{ keyword }}-{{ type }}
  <div>
    {{ singerList }}
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import { search } from "@/api/search.ts";
import { SearchType, type SingerResultData } from "@/type/searchType.ts";
import type { Artist } from "@/type/type.ts";

// 定义组件入参props和自定义事件(send-count)
const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const singerList = ref<Artist[]>([])
const totalCount = ref(0)

console.log("歌手", keyword, type);

const loadData = async (keyword: string) => {
  let res = (await search(keyword, SearchType.SINGER)).result as SingerResultData;
  singerList.value = res.artists;
  totalCount.value = res.artistCount;
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