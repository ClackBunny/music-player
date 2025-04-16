<template>
  <div class="container">
    <div v-if="hasKeywords" class="content-wrapper">
      <a-page-header
          style="border: 0px solid rgb(235, 237, 240); width: 100%;"
      >
        <template #title>
          <div class="title">
            <div class="mainTitle">
              {{ keyword }}
            </div>
            <div class="subTitle">
              的相关搜索如下,找到{{ totalCount }}{{ activeTab().desc }}
            </div>
          </div>
        </template>
      </a-page-header>
      <a-menu v-model:selectedKeys="current" mode="horizontal" :items="menuItems" @click="clickItem"/>
      <div class="tab-content">
        <component :is="activeTab().component" :keyword="keyword" :type="current[0]" @send-count="totalCount=$event"/>
      </div>
    </div>
    <div v-else>
      没有keywords
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useSearchStore } from "@/stores/search.ts";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { queryToString } from "@/utils/utils.ts";
import SingleSong from "@/components/SingleSong.vue";
import Album from "@/components/Album.vue";
import Singer from "@/components/Singer.vue";
import SongList from "@/components/SongList.vue";

const current = ref<string[]>(['']);
const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
let {typeMap} = searchStore;
let {keyword, hasKeywords, menuItems} = storeToRefs(searchStore);
const totalCount = ref(0);

// 选项卡配置
const tabs = [
  {name: 'singleSong', desc: '首单曲', component: SingleSong},
  {name: 'songList', desc: '个歌单', component: SongList},
  {name: 'singer', desc: '个歌手', component: Singer},
  {name: 'album', desc: '个专辑', component: Album}
]
// 计算当前显示的组件
const activeTab = () => {
  return tabs.find(tab => tab.name === current.value[0]) ?? tabs[0]
}

// 首次加载（处理直接访问带参数URL的情况）
function clickItem(item: any) {
  router.push({
    path: '/search',
    query: {
      keyword: keyword.value,
      type: item.key,
    }
  });
}

onMounted(() => {
  if (route.query.keyword) {
    keyword.value = queryToString(route.query.keyword);
    let type = queryToString(route.query.type, "singleSong");
    type = typeMap.has(type) ? type : "singleSong";
    current.value = [type];
  }
})

// 监听关键词变化
watch(
    () => route.query.keyword,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        keyword.value = queryToString(newVal);
      }
    }
)

watch(
    () => route.query.type,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        let type = queryToString(newVal, "singleSong");
        type = typeMap.has(type) ? type : "singleSong";
        current.value = [type];
      }
    }
)
</script>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100%;
  flex-direction: column;
  min-width: 300px;
  min-height: 0;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 修复Safari的flex布局问题 */
}

.ant-page-header-heading-left {
  align-content: baseline;
  align-items: baseline;
}

.title {
  display: flex;
  align-items: baseline;
  font-size: 2rem;

  .mainTitle {
    margin-right: 0.5rem;
  }

  .subTitle {
    font-size: 1rem;
    color: gray;
  }
}

.menu {
  width: 100%;
  //height: 5%;
}

.tab-content {
  overflow: scroll;
}
</style>