<template>
  <div class="list-container">
    <!--     循环设置-->
    <div
        v-for="(song,index) in singleSongList"
        :key="song.id"
        class="list-item"
        @mouseenter="hoveredItem = song.id"
        @mouseleave="hoveredItem = -1"
    >
      <div class="item-content">
        <div class="songTitle">
          {{ getSongTitle(song) }}
        </div>
        <div class="songArtist">
          {{ getSongArtist(song) }}
        </div>
        <div class="album">
          {{ song.album.name }}
        </div>
        <div class="songDuration"
             v-show="hoveredItem !== song.id">
          {{ secondsToMinutes(song.duration / 1000) }}
        </div>
      </div>

      <!-- Hover Overlay -->
      <div
          class="hover-overlay"
          v-show="hoveredItem === song.id">

        <span class="iconfont kongxin-play"
              @click="()=>{const indexInList= addToPlayListWithoutPic(song); handlePlay(indexInList)}"
              title="添加并播放"/>
        <span class="iconfont kongxin-category-add" @click="addToPlayList(song)" title="添加进列表"/>
        <span class="iconfont kongxin-follow" @click="handleFollow(song.id)" title="喜欢"/>
      </div>
    </div>
    <a-pagination hideOnSinglePage
                  show-quick-jumper
                  v-model:current="currentPage"
                  v-model:pageSize="pageSize"
                  :total="totalCount"
                  @change="onChangePage"/>
  </div>
</template>

<script setup lang="ts">
import { search, type SearchApiResponse, SearchType, type SingleSongResultData } from "@/api/search.ts";
import { onMounted, ref, toRefs, watch } from "vue";
import { getSongArtist, getSongTitle, type SongItem } from "@/type/type.ts";
import { secondsToMinutes } from "@/utils/utils.ts";
import { addToPlayList, addToPlayListWithoutPic, handleFollow, handlePlay } from "@/utils/playControl.ts";

const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const singleSongList = ref<SongItem[]>([])
const totalCount = ref(0)
const hoveredItem = ref(-1)
const currentPage = ref(0)
const pageSize = ref(10)

console.log("单曲", keyword, type, totalCount);

// 初始就获取数据并加载, 把count返回给父组件
const loadData = async (keyword: string) => {
  console.log("loadData", keyword);
  let res = await search(keyword, SearchType.SINGLE_SONG) as SearchApiResponse;
  // 直接断言 result 为 SingleSongResultData 类型
  const result = res.result as SingleSongResultData;
  totalCount.value = result.songCount;
  singleSongList.value = result.songs;
  emit("send-count", totalCount.value);
}

function onChangePage(page: number) {
  console.log(page);
}

onMounted(
    () => {
      loadData(keyword.value || '')
    }
)

watch(() => keyword.value, loadData)
watch(type, () => {
  loadData(keyword.value)
})
watch(totalCount, () => {
  emit("send-count", totalCount.value)
})
</script>

<style scoped lang="scss">
$transitionTime: 0.3s;
.list-container {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: min(10px, 1vh) min(10px, 1vw);
  overflow: scroll;
}

.list-item {
  height: 60px;
  position: relative;
  //background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all $transitionTime;
  overflow: hidden;
}

.list-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.item-content {
  display: grid;
  grid-template-columns:  3fr 2fr 1fr;
  grid-template-rows:1fr 1fr;
  grid-template-areas:'songTitle album songDuration' 'songArtist album songDuration';
  grid-auto-flow: row;
  justify-items: start;
  align-items: center;
  z-index: 1;

  .songTitle {
    color: #222f;
    font-weight: bold;
    grid-area: songTitle;
  }

  .songArtist {
    color: gray;
    grid-area: songArtist;
  }

  .album {
    grid-area: album;
  }

  .songDuration {
    width: 100%;
    display: flex;
    grid-area: songDuration;
    justify-content: end;
    justify-items: end;
  }
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px;
  gap: 12px;
  z-index: 2;
  transition: all $transitionTime;

  &:hover {
    background-color: rgba(128, 128, 128, 0.2); /* 半透明灰色 */
  }

  button {
    padding: 6px 12px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }
  }
}

.iconfont {
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 24px;
}

/* 鼠标悬停时变大、颜色加深 */
.iconfont:hover {
  transform: scale(1.1); /* 略微放大 */
  color: #222;
}
</style>