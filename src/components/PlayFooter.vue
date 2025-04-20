<template>
  <div class="music-player">
    <audio
        :src="musicSrc"
        ref="audio"
        :volume="volumeSmall"
        @ended="nextSong"
        @durationchange="durationChange"
        @timeupdate="timeupdate"></audio>
    <!-- 左侧区域 -->
    <div class="left">
      <AlbumImg :album-id="song.albumId" :pic-url="song.coverImgUrl" class="cover"
                :style="{transform: `rotate(-${playState.angle}deg)`,}"/>
      <span class="songTitle">{{ song.title }}</span>
      <span class="songArtist"
            v-show="song.artist">-{{ song.artist }}</span>
    </div>

    <!-- 中间区域 -->
    <div class="center">
      <div class="top">
        <a-button class="button" shape="circle" :icon="h(LeftOutlined)" @click="previousSong"/>
        <a-button class="button"
                  shape="circle"
                  type="primary"
                  size="large"
                  :icon="isPlaying ? pauseIcon : playIcon"
                  @click="togglePlay"
        />
        <a-button class="button" shape="circle" :icon="h(RightOutlined)" @click="nextSong"/>
      </div>
      <div class="bottom">
        <span class="currentTime">{{ currentTime }}</span>
        <a-slider
            class="slider"
            v-model:value="progress"
            :max="playState.duration"
            :tooltipOpen="false"
            @change="(value:number)=>{changingProgress=true}"
            @afterChange="(value:number)=>{changingProgress=false;audio.currentTime=value}"
        />
        <span class="totalTime">{{ totalTime }}</span>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right">
      <a-popover trigger="hover">
        <template #content>
          <div style="display: inline-block; height: 100px;">
            <a-slider v-model:value="playState.volume" :max="100" :min="0" :vertical="true"/>
          </div>
        </template>
        <div class="i-button">
          <span class="volume iconfont"
                :class="playState.volume>0?'kongxin-volume':'kongxin-mute'"
                @click="mute"/>
        </div>
      </a-popover>
      <!--  播放列表按钮-->
      <a-drawer
          v-model:open="isPlayListOpen"
          width="min(70%,500px)"
          root-class-name="drawerRootClass"
          style="color: #787878;"
          :header-style="{padding: '10px'}"
          :body-style="{padding: '0px 0px'}"
          :mask="true"
          title="播放列表"
          placement="right"
          @after-open-change="(bool: boolean)=>{console.log('open', bool);}"
      >
        <template #extra>
          <a-button style="margin-right: 8px" @click="clearPlayList()">清空列表</a-button>
        </template>
        <PlayList/>
      </a-drawer>
      <div class="i-button">
        <span class="iconfont kongxin-gedan playList" @click="isPlayListOpen=!isPlayListOpen"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import { CaretRightOutlined, LeftOutlined, PauseOutlined, RightOutlined, } from '@ant-design/icons-vue'
import PlayList from "@/components/PlayList.vue";

import { usePlayStateStore } from "@/stores/playState.ts";
import { storeToRefs } from "pinia";
import { secondsToMinutes } from "@/utils/utils.ts";
import AlbumImg from "@/components/AlbumImg.vue";
import { clearPlayList, handlePlay, nextSong, previousSong } from "@/utils/playControl.ts";
import { message } from "ant-design-vue";
import { getSongArtist } from "@/type/type.ts";

const song = ref<{
  albumId: number,
  coverImgUrl?: string,
  title: string,
  artist: string,
}>({
  albumId: -1,
  coverImgUrl: '/cover-gem.jpg', // 可替换为真实封面
  title: '未播放歌曲',
  artist: '',
})
// 歌曲相关的存储信息
const store = usePlayStateStore();
const {playState, playList, isPlayListOpen} = storeToRefs(store);
const musicSrc = ref("")
const isPlaying = ref(false)
// 播放进度
const progress = ref(0)
const changingProgress = ref(false)
// 图标
const pauseIcon = h(PauseOutlined);
const playIcon = h(CaretRightOutlined)
// progress最大值是duration,最小值0,step=1
const currentTime = computed(() => secondsToMinutes(playState.value.current))
const totalTime = computed(() => secondsToMinutes(playState.value.duration))


const audio = ref()

function togglePlay() {
  if (playList.value.length <= 0) {
    message.warning("播放列表为空")
    return
  }
  if (!playState.value.musicUrl) {
    handlePlay(0)
    return
  }
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value
}

function mute() {
  // todo 修改音量图标, 静音图标需要别的地方引入
  if (playState.value.volume > 0) {
    playState.value.muteVolume = playState.value.volume;
    playState.value.volume = 0;
  } else if (playState.value.muteVolume >= 0) {
    playState.value.volume = playState.value.muteVolume;
  } else {
    playState.value.volume = 0;
  }
}

function durationChange() {
  playState.value.duration = Math.floor(audio.value.duration)
}

function timeupdate() {
  const temp = Math.floor(audio.value.currentTime)
  playState.value.current = temp;
  if (!changingProgress.value) {
    progress.value = temp;
  }
}

let volumeSmall = computed(() => {
  return playState.value.volume / 100.0
})

// 监听播放状态变化, 旋转封面
watch(
    isPlaying,
    (newVal) => {
      if (playState.value.coverTimer) {
        clearInterval(playState.value.coverTimer);
        playState.value.coverTimer = undefined;
      }
      if (newVal) {
        playState.value.coverTimer = window.setInterval(() => {
          // 每帧旋转角度
          playState.value.angle += 0.3;
          if (playState.value.angle >= 360) playState.value.angle = 0;
        }, 16);
      }
    }
);

// 监听播放地址, 变化了就需要切歌,也需要切换图片和标题
watch(
    () => playState.value.musicUrl,
    (newVal) => {
      console.log(newVal)
      audio.value.pause();
      audio.value.src = newVal;
      audio.value.play();
      isPlaying.value = true;
      // 切换封面和标题
      const songItem = playList.value[playState.value.index];
      song.value.albumId = songItem.album.id;
      song.value.coverImgUrl = songItem.album.picUrl;
      song.value.title = songItem.name;
      song.value.artist = getSongArtist(songItem);
      console.log("给song新值", song.value);
    }
)

onMounted(() => {
})
nextTick(() => {
})

</script>

<style lang="scss" scoped>
$transitionTime: 0.3s;
.music-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  height: 100%;
  padding: 0 10px;
  background-color: #fafafa;
  //border: 1px solid #c9ccd1;

  .left, .right {
    width: 50px;
    flex: 2 1 0;
    display: flex;
    align-items: center;
    align-content: center;
  }

  .left {
    padding-left: 20px;
    justify-content: left;

    .songTitle .songArtist {
      display: inline;
    }

    .songTitle {
      margin-left: 1vh;
    }

    .songArtist {
      color: #c9ccd1;
    }
  }

  .center {
    display: flex;
    max-width: 50vw;
    flex: 5 1 0;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    height: 100%;
    width: 100%;

    .top {
      height: 50%;
      padding-top: 10px;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;

      .button {
        margin: 0 1vw;
      }
    }

    .bottom {
      height: 50%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .slider {
        flex: 1;
      }

      .currentTime,
      .totalTime {
        font-size: 12px;
        color: #999;
        width: 40px;
        text-align: center;
      }

    }
  }

  .right {
    padding-right: 20px;
    justify-content: right;
  }
}

.cover {
  display: inline-block;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.drawerRootClass {
  background-color: mediumpurple;

  .ant-drawer-content-wrapper {
    background-color: orange;
  }
}

.i-button {
  padding: 10px;
  transition: all $transitionTime;
  border-radius: 5px;

  &:hover {

  }

  .iconfont {
    display: block;
    cursor: pointer;
    transition: transform $transitionTime;
    font-size: 25px;
    width: 25px;
    height: 25px;
    line-height: 25px; // 保证字体图标垂直居中
  }

  .iconfont:hover {
    transform: scale(1.2);
    color: #222;
    text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
  }
}

</style>
