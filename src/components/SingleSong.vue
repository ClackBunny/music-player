<template>
  这是单曲{{ keyword }}-{{ type }}
  <div>
    {{ results }}
  </div>
</template>

<script setup lang="ts">
import { search, SearchType } from "@/api/search.ts";
import { onMounted, reactive, ref } from "vue";

const {keyword, type} = defineProps(['keyword', 'type']);
const results = ref([])
console.log("单曲", keyword, type);
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