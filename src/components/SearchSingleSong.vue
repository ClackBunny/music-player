<template>
  <div class="list-container">
    <!-- 列表头 -->
    <div class="list-header">
      <div class="number">#</div>
      <div class="songTitle">标题</div>
      <div class="action-buttons"></div>
      <div class="songArtist">歌手</div>
      <div class="album">专辑</div>
      <div class="songDuration">时长</div>
    </div>

    <!-- 列表项 -->
    <div
        v-for="(song,index) in data?.songs"
        :key="song.id"
        class="list-item"
    >
      <div class="number">
        {{ index + 1 }}
      </div>
      <div class="songTitle" :title="getSongTitle(song)">
        {{ getSongTitle(song) }}
      </div>
      <div class="action-buttons">
        <span class="iconfont kongxin-play"
              @click="() => { const indexInList = addToPlayListWithoutPic(song); handlePlay(indexInList) }"
              title="添加并播放"/>
        <span class="iconfont kongxin-category-add" @click="addToPlayList(song)" title="添加进列表"/>
        <span class="iconfont kongxin-follow" @click="handleFollow(song.id)" title="喜欢"/>
      </div>
      <div class="songArtist" :title="getSongArtist(song)">
        {{ getSongArtist(song) }}
      </div>

      <div class="album" :title="song.album.name">
        {{ song.album.name }}
      </div>
      <div class="songDuration">
        {{ secondsToMinutes(song.duration / 1000) }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { getSongArtist, getSongTitle } from "@/type/type.ts";
import { secondsToMinutes } from "@/utils/utils.ts";
import { addToPlayList, addToPlayListWithoutPic, handleFollow, handlePlay } from "@/utils/playControl.ts";
import { type SingleSongResultData } from "@/type/searchType.ts";

const props = defineProps<{ 'keyword': string, 'type': string, data: SingleSongResultData }>();
const {data} = toRefs(props);

</script>

<style scoped lang="scss">
$transitionTime: 0.4s;

.list-item:hover {
  background-color: rgba(128, 128, 128, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  .action-buttons {
    opacity: 1;
    visibility: visible;
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

  .songTitle {
    flex: 3;
    margin: 0 max(12px, 1vw);
  }

  .songArtist {
    flex: 2;
  }

  .album {
    flex: 1;
  }

  .songDuration {
    flex: 0.5;
    min-width: 50px;
    display: flex;
    justify-content: flex-end;
  }

  .songArtist, .album, .songTitle {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

  .action-buttons {
    flex: 1;
    display: flex;
    gap: 10px;
    top: 50%;
    opacity: 0;
    min-width: 102px;
    padding-right: max(10px, 1vw);
    justify-content: end;
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
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    color: #222;
  }
}

.list-item {
  .songTitle {
    color: #222f;
    font-weight: bold;
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
