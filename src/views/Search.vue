<template>
  <div class="container">
    <div v-if="hasKeywords" class="contentWrapper">
      <a-page-header
          style="border: 0 solid rgb(235, 237, 240); width: 100%;"
      >
        <template #title>
          <div class="title">
            <div class="mainTitle">
              {{ keyword }}
            </div>
            <div class="subTitle">
              的相关搜索如下,找到{{ totalCount }}{{ findTab().desc }}
            </div>
          </div>
        </template>
      </a-page-header>
      <a-menu v-model:selectedKeys="current" mode="horizontal" :items="menuItems" @click="clickItem"/>
      <div class="tabContentWrapper">
        <div v-if="totalCount > 0" class="tabContent">
          <component v-if="apiData" :is="findTab().component" :keyword="keyword" :type="current[0]"
                     :data="apiData as any"/>
        </div>
        <a-empty v-else :image="simpleImage">
          <template #description>
            <span> 暂无数据,请换个关键词搜索试试</span>
          </template>
        </a-empty>
        <div v-if="totalCount > 0" class="pagination-wrapper">
          <a-pagination
              :current="page"
              :page-size="pageSize"
              :total="totalCount"
              show-size-changer
              :page-size-options="['10','20','30','50']"
              @change="onPageChange"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <a-empty :image="simpleImage">
        <template #description>
          <span> 暂无数据,请输入关键词搜索</span>
        </template>
      </a-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSearchStore } from "@/stores/search.ts";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { queryToString } from "@/utils/utils.ts";
import SearchSingleSong from "@/components/SearchSingleSong.vue";
import SearchAlbum from "@/components/SearchAlbum.vue";
import SearchSinger from "@/components/SearchSinger.vue";
import SearchSongList from "@/components/SearchSongList.vue";
import { Empty } from 'ant-design-vue';
import {
  type AlbumResultData,
  type SearchApiResponse,
  SearchType,
  type SingerResultData,
  type SingleSongResultData,
  type SongListResultData
} from "@/type/searchType.ts";
import { search } from "@/api/search.ts";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const current = ref<string[]>(['']);  //当前是那个页签起作用
const apiData = ref<SingleSongResultData | SongListResultData | AlbumResultData | SingerResultData>();
const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const {typeMap} = searchStore;
const {menuItems} = storeToRefs(searchStore);
const keyword = ref<string>("");
const totalCount = ref(0);
const hasKeywords = computed(() => {
  return !!keyword?.value?.length
})
// 选项卡配置
const tabs = [
  {name: 'singleSong', desc: '首单曲', component: SearchSingleSong, searchType: SearchType.SINGLE_SONG},
  {name: 'songList', desc: '个歌单', component: SearchSongList, searchType: SearchType.SONG_LIST},
  {name: 'singer', desc: '个歌手', component: SearchSinger, searchType: SearchType.SINGER},
  {name: 'album', desc: '个专辑', component: SearchAlbum, searchType: SearchType.ALBUM}
]

// 分页相关设置
const page = ref(1);
const pageSize = ref(30);

function onPageChange(newPage: number, newSize?: number) {
  page.value = newPage;
  if (newSize !== undefined) {
    pageSize.value = newSize;
  }
  loadData(keyword.value);
}


// 计算当前显示的组件
const findTab = (name: string = current.value[0]) => {
  return tabs.find(tab => tab.name === name) ?? tabs[0]
}

function clickItem(item: any) {
  router.push({
    path: '/search',
    query: {
      keyword: keyword.value,
      type: item.key,
    }
  });
}

async function loadData(keyword: string) {
  const offset = (page.value - 1) * pageSize.value;
  let res = await search(keyword, findTab().searchType, offset, pageSize.value) as SearchApiResponse;
  apiData.value = res.result;
  switch (current.value[0]) {
    case "songList":
      totalCount.value = (res.result as SongListResultData).playlistCount;
      break;
    case "singer":
      totalCount.value = (res.result as SingerResultData).artistCount;
      break;
    case "album":
      totalCount.value = (res.result as AlbumResultData).albumCount;
      break;
    case "singleSong":
    default:
      totalCount.value = (res.result as SingleSongResultData).songCount;
  }

}

// 首次加载（处理直接访问带参数URL的情况）
onMounted(async () => {
  if (route.query.keyword) {
    keyword.value = queryToString(route.query.keyword);
    let type = queryToString(route.query.type, "singleSong");
    type = typeMap.has(type) ? type : "singleSong";
    current.value = [type];
    await loadData(keyword.value);
  } else {
    keyword.value = "";
  }
})

// 监听关键词变化
watch(
    () => route.query,
    (newVal, oldVal) => {
      if (newVal.keyword !== oldVal?.keyword || newVal.type !== oldVal?.type) {
        keyword.value = queryToString(newVal.keyword);
        let type = queryToString(newVal.type, "singleSong");
        current.value = [typeMap.has(type) ? type : 'singleSong'];
        if (keyword.value) {
          loadData(keyword.value.trim());
        }
      }
    }
);


</script>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100%;
  flex-direction: column;
  min-width: 300px;
  min-height: 0;
}

.contentWrapper {
  flex: 1;
  width: 100%;
  height: 100%;
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


.tabContentWrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.tabContent {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.pagination-wrapper {
  padding: 16px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #eee;

  // 修复省略号居中
  :deep(.ant-pagination-item-ellipsis),
  :deep(.ant-pagination-item-link) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
  }

  // 修复页码按钮的统一高度
  :deep(.ant-pagination-item) {
    height: 32px;
    line-height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
}

</style>