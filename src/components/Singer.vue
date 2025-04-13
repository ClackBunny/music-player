<template>
  这是歌手{{keyword}}-{{type}}
  <div>
    {{results}}
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { search, SearchType } from "@/api/search.ts";

const {keyword, type} = defineProps(['keyword', 'type']);
console.log("歌手", keyword, type);
const results = ref([])
const loadData = async (keyword: string) => {
  let res = await search(keyword, SearchType.SINGLE_SONG);
  results.value = res['result'] || []
}
onMounted(
    () => {
      loadData(keyword)
    }
)
</script>

<style scoped lang="scss">

</style>