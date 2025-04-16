<template>
  <div class="list-container">
    <!--     循环设置-->
    <div
        v-for="(song,index) in playList"
        :key="song.id"
        class="list-item"
        @mouseenter="hoveredItem = song.id"
        @mouseleave="hoveredItem = 0"
    >
      <div class="item-content">
        <div class="songImg">
          <AlbumImg class="cover" :album-id="song.album.id" :pic-url="song.album.picUrl"
                    default-img="@/assets/img/default-cover.png"/>
          <!--                    <img src="@/assets/img/default-cover.png" alt="albumCover" class="cover"/>-->
        </div>
        <div class="songTitle">
          {{ getSongTitle(song) }}
        </div>
        <div class="songArtist">
          {{ getSongArtist(song) }}
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

        <span class="iconfont kongxin-play" @click="handlePlay(index)" title="播放"/>
        <span class="iconfont kongxin-follow" @click="handleFollow(song.id)" title="喜欢"/>
        <span class="iconfont kongxin-delete" @click="handleDelete(song)" title="删除"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { usePlayStateStore } from "@/stores/playState.ts";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { getSongArtist, getSongTitle, type SongItem } from "@/type/type.ts";
import { secondsToMinutes } from "../utils/utils.ts";
import { handleFollow, handlePlay } from "@/utils/playControl.ts";
import AlbumImg from "@/components/AlbumImg.vue";

const store = usePlayStateStore();
const {playList} = storeToRefs(store);
const hoveredItem = ref<number>(0)

// 从播放列表中删除
const handleDelete = (item: SongItem) => {
  playList.value.splice(playList.value.indexOf(item), 1)
}

</script>
<style lang="scss" scoped>
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
  grid-template-columns:  50px 3fr 1fr;
  grid-template-rows:1fr 1fr;
  grid-template-areas:'songImg songTitle songDuration' 'songImg songArtist songDuration';
  grid-auto-flow: row;
  justify-items: start;
  align-items: center;
  z-index: 1;

  .songImg {
    grid-area: songImg;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;

    .cover {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 3px;
    }
  }

  .songTitle {
    color: #222f;
    font-weight: bold;
    grid-area: songTitle;
  }

  .songArtist {
    color: gray;
    grid-area: songArtist;
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
