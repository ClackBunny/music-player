<template>
  <div class="list-header">
    <div class="number">#</div>
    <div class="coverImg">封面</div>
    <div class="title">标题</div>
    <div class="action-buttons"></div>
    <div class="trackCount">歌曲数</div>
    <div class="creatorName">创建者</div>
    <div class="bookCount">收藏</div>
    <div class="playCount">播放量</div>
  </div>
  <!--  歌单的列表-->
  <div class="list-item" v-for="(songList,index) in data?.playlists" :key="songList.id">
    <div class="number">
      {{ index + 1 }}
    </div>
    <div class="coverImg">
      <img :src="songList.coverImgUrl" alt="开头图片">
    </div>
    <div class="title">
      <div class="songListName" :title="songList.name">
        {{ songList.name }}
      </div>
      <div class="recommendText" :title="songList.recommendText">
        {{ songList.recommendText }}
      </div>
    </div>
    <div class="action-buttons">
        <span class="iconfont kongxin-play"
              @click="playSongList(songList.id,songList.name)"
              title="播放歌单"/>
      <span class="iconfont kongxin-category-add" @click="addSongListToPlaylist(songList.id);" title="添加进列表"/>
    </div>
    <div class="trackCount">
      {{ songList.trackCount }}首
    </div>
    <div class="creatorName">
      {{ songList.creator.nickname }}
    </div>
    <div class="bookCount">
      {{ handleCount(songList.bookCount) }}
    </div>
    <!--    大于10w需要更换单位-->
    <div class="playCount">
      {{ handleCount(songList.playCount) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { type SongListResultData } from "@/type/searchType.ts";
import { addSongListToPlaylist, playSongList } from "@/utils/playControl.ts";
import { handleCount } from "../utils/utils.ts";

const props = defineProps<{ 'keyword': string, 'type': string, data: SongListResultData }>();
const {data} = toRefs(props);

</script>

<style scoped lang="scss">
$transitionTime: 0.4s;

.list-item:hover {
  background-color: rgba(128, 128, 128, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  .action-buttons {
    opacity: 1;
    visibility: visible; /* 鼠标悬浮时显示 */
  }
}

.list-header, .list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  transition: all $transitionTime;
  /* 鼠标悬浮时：显示按钮 + 加阴影 */


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
    width: 50px;
    flex: 0 0 auto;
    margin: 0 12px;
  }

  .coverImg img {
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
  }

  /* 标题部分上下排列，占比更大 */
  .title {
    flex: 5;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }

  .songListName, .recommendText {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
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
    white-space: normal; // 允许换行
    word-break: break-word; // 单词太长时也断开
  }

  /* 默认按钮隐藏 */
  .action-buttons {
    flex: 1;
    display: flex;
    gap: 10px;
    top: 50%;
    opacity: 0;
    min-width: 68px;
    padding-right: max(10px, 1vw);
    justify-content: end;
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
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
      color: #222;
    }
  }
}

.list-header {
  border-radius: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
}

</style>