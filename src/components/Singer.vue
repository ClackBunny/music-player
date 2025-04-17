<template>
  <div class="container">
    <div class="artist-list">
      <div
          class="singer-card"
          v-for="(singer,index) in singerList"
          :key="singer.id"
          @click="handleClick(singer, index, $event)"
          @contextmenu.prevent="handleClick(singer, index, $event)"
      >
        <div class="singerImgWrapper">
          <img :src="singer.picUrl" :alt="singer.name" class="singerImg"/>
          <div class="playIcon">
            <span title="左键播放,右键添加进列表" class="iconfont kongxin-bofang"/>
          </div>
        </div>
        <div class="singerInfo">
          <div class="singerName">{{ singer.name }}</div>
          <div class="singerAlbumSize">专辑：{{ singer.albumSize }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import { search } from "@/api/search.ts";
import { SearchType, type SingerResultData } from "@/type/searchType.ts";
import type { Artist } from "@/type/type.ts";

// 定义组件入参props和自定义事件(send-count)
const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const singerList = ref<Artist[]>([])
const totalCount = ref(0)

console.log("歌手", keyword, type);

const loadData = async (keyword: string) => {
  let res = (await search(keyword, SearchType.SINGER)).result as SingerResultData;
  singerList.value = res.artists;
  totalCount.value = res.artistCount;
  emit("send-count", totalCount.value);
}

function handleClick(singer: Artist, index: number, e: MouseEvent) {
  console.log("点击了第", index, "个歌手：", singer.name);

  if (e.button === 0) {
    console.log("左键点击")
    // 左键
  } else if (e.button === 2) {
    console.log("右键点击")
    // 右键
  }
}

onMounted(
    () => {
      loadData(keyword.value)
    }
)
</script>

<style scoped lang="scss">
$transitionTime: 0.3s;
.container {
  padding: max(10px, 1vw) max(10px, 1vh);
}

.artist-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.singer-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all $transitionTime ease;
  text-align: center;
  padding: 12px;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    border-color: #dcdcdc;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .playIcon {
      opacity: 1;
      visibility: visible;
    }
  }
}

.singerImgWrapper {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;

  .singerImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}


.playIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  // 补偿一点视觉误差(而且这个图标不是完全方正的)
  transform: translate(-47%, -50%);
  padding: 8px;
  border-radius: 50%;
  opacity: 0;
  visibility: hidden;
  transition: all $transitionTime ease;
  display: flex;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
}

.singerInfo {
  margin-top: 16px;

  .singerName {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 4px;
  }

  .singerAlbumSize {
    font-size: 13px;
    color: #777;
  }
}

/* 按钮样式你可以自定义美化 */
.iconfont {
  transition: transform $transitionTime;
  font-size: 40px;
  color: #fff;
}

.iconfont:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>