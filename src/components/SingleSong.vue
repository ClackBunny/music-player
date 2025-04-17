<template>
  <div class="list-container">
    <!-- 列表头 -->
    <div class="list-header">
      <div class="songTitle">歌曲标题</div>
      <div class="action-buttons"></div>
      <div class="songArtist">歌手</div>
      <div class="album">专辑</div>
      <div class="songDuration">时长</div>
    </div>

    <!-- 列表项 -->
    <div
        v-for="(song) in singleSongList"
        :key="song.id"
        class="list-item"
    >
      <div class="songTitle">
        {{ getSongTitle(song) }}
      </div>
      <div class="action-buttons">
        <span class="iconfont kongxin-play"
              @click="() => { const indexInList = addToPlayListWithoutPic(song); handlePlay(indexInList) }"
              title="添加并播放"/>
        <span class="iconfont kongxin-category-add" @click="addToPlayList(song)" title="添加进列表"/>
        <span class="iconfont kongxin-follow" @click="handleFollow(song.id)" title="喜欢"/>
      </div>
      <div class="songArtist">
        {{ getSongArtist(song) }}
      </div>

      <div class="album">
        {{ song.album.name }}
      </div>
      <div class="songDuration">
        {{ secondsToMinutes(song.duration / 1000) }}
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
import { search } from "@/api/search.ts";
import { onMounted, ref, toRefs, watch } from "vue";
import { getSongArtist, getSongTitle, type SongItem } from "@/type/type.ts";
import { secondsToMinutes } from "@/utils/utils.ts";
import { addToPlayList, addToPlayListWithoutPic, handleFollow, handlePlay } from "@/utils/playControl.ts";
import { type SearchApiResponse, SearchType, type SingleSongResultData } from "@/type/searchType.ts";

const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const singleSongList = ref<SongItem[]>([])
const totalCount = ref(0)
const currentPage = ref(0)
const pageSize = ref(10)

console.log("单曲", keyword, type, totalCount);
// 初始就获取数据并加载, 把count返回给父组件
const loadData = async (keyword: string) => {
  console.log("loadData", keyword);
  let res = await search(keyword, SearchType.SINGLE_SONG) as SearchApiResponse;
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
}


.list-item {
  height: 60px;
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  color: gray;
  border-bottom: 1px solid #eee;
  transition: all $transitionTime;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: rgba(128, 128, 128, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    .action-buttons {
      opacity: 1;
      visibility: visible;
    }
  }

  .songTitle {
    flex: 3;
    color: #222f;
    font-weight: bold;
  }

  .songArtist {
    flex: 2;
  }

  .album {
    flex: 1;
  }

  .songDuration {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .action-buttons {
    flex: 1;
    display: flex;
    gap: 10px;
    top: 50%;
    opacity: 0;
    transition: opacity $transitionTime ease, visibility $transitionTime;
    visibility: hidden;
  }

  .iconfont {
    cursor: pointer;
    transition: transform 0.4s;
    font-size: 24px;
  }

  .iconfont:hover {
    opacity: 1;
    transform: scale(1.1);
    color: #222;
  }
}

.list-header {
  height: 60px;
  position: sticky;
  background-color: white;
  top: 0;
  z-index: 10;
  padding: 12px 16px;
  border-bottom: 2px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .songTitle {
    flex: 3;
  }

  .songArtist {
    flex: 2;
  }

  .album {
    flex: 1;
  }

  .songDuration {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .action-buttons {
    flex: 1;
  }
}
</style>
