<template>
  这是歌单{{ keyword }}-{{ type }}
  <div>
    {{ results }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { search, SearchType } from "@/api/search.ts";

const {keyword, type} = defineProps(['keyword', 'type']);

const results = ref([])
console.log("歌单", keyword, type);
const loadData = async (keyword: string, type: SearchType) => {
  const response = await search(keyword, type);
  console.log(response)
  results.value = response['result'] || []
}
onMounted(
    () => {
      // console.log(keyword, type);
      loadData(keyword, SearchType.SONG_LIST);
    }
)
</script>

<style scoped lang="scss">

</style>