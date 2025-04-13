<template>
  <div class="music-player">
    <audio
        :src="musicSrc"
        ref="audio"
        :volume="volumeSmall"
        @ended="()=>{console.log('下一首')}" controls></audio>
    <!-- 左侧区域 -->
    <div class="left">
      <a-avatar :size="50" shape="circle" :src="song.cover"/>
      <span class="songTitle">{{ song.title }}</span>-
      <span class="songArtist">{{ song.artist }}</span>
    </div>
    <!-- 中间区域 -->
    <div class="center">
      <div class="top">
        <a-button class="button" shape="circle" :icon="h(LeftOutlined)" @click="prev"/>
        <a-button class="button"
                  shape="circle"
                  type="primary"
                  size="large"
                  :icon="isPlaying ? pauseIcon : playIcon"
                  @click="togglePlay"
        />
        <a-button class="button" shape="circle" :icon="h(RightOutlined)" @click="next"/>
      </div>
      <div class="bottom">
        <span class="currentTime">{{ currentTime }}</span>
          <a-slider
              class="slider"
              v-model:value="progress"
              :max="duration"
              :tooltip-visible="false"
          />
        <span class="totalTime">{{ totalTime }}</span>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right">
      <a-popover trigger="hover">
        <template #content>
          <div style="display: inline-block; height: 100px;">
            <a-slider v-model:value="volume" :max="100" :min="0" vertical/>
          </div>
        </template>
        <a-button
            class="volume"
            type="text"
            :icon="h(SoundOutlined)"
            @click="mute"
        >
        </a-button>
      </a-popover>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import { CaretRightOutlined, LeftOutlined, PauseOutlined, RightOutlined, SoundOutlined, } from '@ant-design/icons-vue'

const song = ref({
  cover: '/cover-gem.jpg', // 可替换为真实封面
  title: '给你给我',
  artist: '毛不易',
})
// const musicSrc = ref('http://m802.music.126.net/20250413145253/ff3dd447d406879ca4b50f5fb84503de/jd-musicrep-ts/269d/aaf0/55d1/87017b9e9776c6b734db57914770b46a.mp3?vuutv=MkzFk+KpNFHZCVdq3/le/la3zg2ZdEgp9pSitc3mlsg4sIIjqRXq02ztYWiqTnl0j0zTUbVJFe1BtSCqkmwJmGXTkeOwgO5CN/R73PRO65M=')
// const musicSrc = ref("http://m701.music.126.net/20250413145505/b0570132b60cc58c0eb0ca2df404db4e/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481668581/f82f/b22d/c11c/e658eef1e47520540329862a1cbd48b5.mp3?vuutv=bhAFXM1x6t9Eqcjmw4Kn6QIkmTYqxVPhiM1iuEdE0aEkeRRysKGqbWZU+8Py3wWJi3lRPF+VUJTWdRqsnFWrwzQQZWYNi1l/6UDnefCTcOw=")
const musicSrc = ref("http://m701.music.126.net/20250413185523/3b6acd236c8ec62364b167d814e04950/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/26282673735/0572/bf89/90f1/dee906a3929ead546504e7d733fa8c44.flac?vuutv=EwF6K/TQMo9P7ohdRvjZnbSrMC/2mL2OkSBgVxPVeLUov/MSV8bzm/Ops4crWfG5hLn81f8z+JT6UqbQ+bVx8CH1jO+C50HfYGLCmbqSy0Q=")
const isPlaying = ref(false)
const volume = ref(60)
const muteVolume = ref(0)
const progress = ref(80)
const duration = 360
const currentTime = computed(() => formatTime(30))
const totalTime = computed(() => formatTime(duration))

const playIcon = h(CaretRightOutlined)
const pauseIcon = h(PauseOutlined)
const audio = ref()

function togglePlay() {
  console.log(isPlaying.value, audio.value.duration, audio.value.currentTime);
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value
}

function prev() {
  console.log('上一首')
}

function next() {
  console.log('下一首')
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function mute() {
  // todo 修改音量图标, 静音图标需要别的地方引入
  if (volume.value > 0) {
    muteVolume.value = volume.value;
    volume.value = 0;
  } else if (muteVolume.value >= 0) {
    volume.value = muteVolume.value;
  } else {
    volume.value = 0;
  }
}

watch(
    volume,
    (newVal, oldVal) => {
      console.log(newVal, oldVal)
    }
)
let volumeSmall = computed(() => {
  return volume.value / 100.0
})

onMounted(() => {
})
nextTick(() => {

})

</script>

<style lang="scss" scoped>
.music-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  height: 100%;
  padding: 0 10px;
  background-color: #fafafa;
  //border: 1px solid #c9ccd1;

  .left .right {
    width: 50px;
    flex: 2 1 auto;
    display: flex;
    flex-direction: row;
  }

  .left {
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
    max-width: 50vh;
    flex: 5 1 auto;
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
    padding-right: 30px;

    .volume {
      width: 50px;
      height: 50px;
    }
  }
}

#music {

}
</style>
