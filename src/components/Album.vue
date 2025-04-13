<template>
  这是专辑{{keyword}}-{{type}}
  <div>
    {{results}}
  </div>
</template>

<script setup lang="ts">
import { search, SearchType } from "@/api/search.ts";
import { onMounted, ref } from "vue";

const {keyword, type} = defineProps(['keyword', 'type']);
console.log("专辑", keyword, type);
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