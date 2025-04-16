<template>
  <div class="list-header">
    <div class="number">#</div>
    <div class="coverImg">封面</div>
    <div class="title">标题</div>
    <div class="action-buttons">按钮</div>
    <div class="trackCount">歌曲数</div>
    <div class="creatorName">创建者</div>
    <div class="bookCount">收藏</div>
    <div class="playCount">播放量</div>
  </div>
  <!--  歌单的列表-->
  <div class="list-item" v-for="(songList,index) in listOfSongLists" :key="songList.id">
    <div class="number">
      {{ index + 1 }}
    </div>
    <div class="coverImg">
      <img :src="songList.coverImgUrl" alt="开头图片">
    </div>
    <div class="title">
      <div class="songListName">
        {{ songList.name }}
      </div>
      <div class="recommendText">
        {{ songList.recommendText }}
      </div>
    </div>
    <div class="action-buttons">
        <span class="iconfont kongxin-play"
              @click="console.log('播放按钮');"
              title="播放歌单"/>
      <span class="iconfont kongxin-category-add" @click="console.log('整个歌单添加进列表');" title="添加进列表"/>
    </div>
    <div class="trackCount">
      {{ songList.trackCount }}首
    </div>
    <div class="creatorName">
      {{ songList.creator.nickname }}
    </div>
    <div class="bookCount">
      {{ songList.bookCount }}
    </div>
    <!--    大于10w需要更换单位-->
    <div class="playCount">
      {{ songList.playCount / 10000 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import { search, SearchType, type SongListResultData } from "@/api/search.ts";
import type { SongListItem } from "@/type/searchType.ts";

const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const listOfSongLists = ref<SongListItem[]>([])
const totalCount = ref(0)

console.log("歌单", keyword, type);
const loadData = async (keyword: string) => {
  // message.loading("加载中")
  const response = await search(keyword, SearchType.SONG_LIST, 0, 30);
  const result = response.result as SongListResultData
  totalCount.value = result.playlistCount;
  listOfSongLists.value = result.playlists
  emit("send-count", totalCount.value);
}
onMounted(
    () => {
      // console.log(keyword, type);
      loadData(keyword.value);
    }
)
</script>

<style scoped lang="scss">
$transitionTime: 0.3s;

.list-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  /* 表头的每个元素布局要跟 list-item 一致 */
  > div {
    display: flex;
    align-items: center;
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .number {
    flex: 0 0 30px;
    justify-content: center;
  }

  .coverImg {
    flex: 0 0 auto;
    margin: 0 12px;
  }

  .title {
    flex: 2;
  }

  .trackCount,
  .creatorName,
  .bookCount,
  .playCount {
    flex: 1;
    min-width: 60px;
  }
}


.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  transition: all $transitionTime;
  /* 鼠标悬浮时：显示按钮 + 加阴影 */
  &:hover {
    background-color: rgba(128, 128, 128, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    .action-buttons {
      opacity: 1;
      visibility: visible; /* 鼠标悬浮时显示 */
    }
  }

  /* 公共样式：每个项横向排，垂直居中 */
  > div {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* 编号最小空间 */
  .number {
    flex: 0 0 30px;
    justify-content: center;
  }

  /* 封面固定大小 */
  .coverImg {
    flex: 0 0 auto;
    margin: 0 12px;
  }

  .coverImg img {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
  }

  /* 标题部分上下排列，占比更大 */
  .title {
    flex: 2;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }

  .songListName {
    font-weight: bold;
    color: #333;
  }

  .recommendText {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }

  /* 其他字段自动伸缩，但保留最小宽度防止内容挤压 */
  .trackCount,
  .creatorName,
  .bookCount,
  .playCount {
    flex: 1;
    min-width: 60px;
    color: #666;
    justify-content: flex-start;
  }

  /* 默认按钮隐藏 */
  .action-buttons {
    flex: 1;
    display: flex;
    gap: 10px;
    top: 50%;
    opacity: 0;
    transition: opacity $transitionTime ease, visibility $transitionTime;
    visibility: hidden;
    /* 按钮样式你可以自定义美化 */
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
}


</style>