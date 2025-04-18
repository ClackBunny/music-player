<template>
  <div class="list-header">
    <div class="number">#</div>
    <div class="coverImg">封面</div>
    <div class="albumTitle">标题</div>
    <div class="action-buttons"></div>
    <div class="albumSize">歌曲数</div>
    <div class="albumArtistName">创建者</div>
    <div class="albumPublishTime">发布时间</div>
  </div>

  <!--  歌单的列表-->
  <div class="list-item" v-for="(album,index) in albumList" :key="album.id">
    <div class="number">
      {{ index + 1 }}
    </div>
    <div class="coverImg">
      <img :src="album.picUrl" alt="开头图片">
    </div>

    <div class="albumTitle" :title="getAlbumTitle(album)">
      {{ getAlbumTitle(album) }}
    </div>

    <div class="action-buttons">
        <span class="iconfont kongxin-play"
              @click="console.log('播放专辑');"
              title="播放专辑"/>
      <span class="iconfont kongxin-category-add" @click="console.log('整个专辑添加进列表');" title="添加进列表"/>
    </div>
    <div class="albumSize">
      {{ album.size }}首
    </div>
    <div class="albumArtistName" :title="album.artist?.name">
      {{ album.artist?.name }}
    </div>
    <div class="albumPublishTime">
      {{ transformPublishTime(album.publishTime) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { search } from "@/api/search.ts";
import { onMounted, ref, toRefs } from "vue";
import { type AlbumResultData, SearchType } from "@/type/searchType.ts";
import { type Album, getAlbumTitle } from "@/type/type.ts";
import dayjs from "dayjs";

// 定义组件入参props和自定义事件(send-count)
const props = defineProps<{ 'keyword': string, 'type': string }>();
const {keyword, type} = toRefs(props);
const emit = defineEmits(['send-count']);

const albumList = ref<Album[]>([])
const totalCount = ref(0)

console.log("专辑", keyword, type);

const loadData = async (keyword: string) => {
  let res = (await search(keyword, SearchType.ALBUM)).result as AlbumResultData;
  albumList.value = res.albums;
  totalCount.value = res.albumCount;
  emit("send-count", totalCount.value);
}

function transformPublishTime(timeStamp: number | undefined) {
  return dayjs(timeStamp).format("YYYY-MM-DD");
}

onMounted(
    () => {
      loadData(keyword.value)
    }
)
</script>

<style scoped lang="scss">
$transitionTime: 0.3s;

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
  .albumTitle {
    flex: 2;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap; // 不换行
    text-overflow: ellipsis; //过长显示...
    max-width: 100%;
  }

  /* 其他字段自动伸缩，但保留最小宽度防止内容挤压 */
  .albumSize,
  .albumArtistName,
  .albumPublishTime {
    flex: 1;
    min-width: 60px;
    color: #666;
    justify-content: flex-start;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

  /* 默认按钮隐藏 */
  .action-buttons {
    flex: 1;
    display: flex;
    gap: 10px;
    top: 50%;
    opacity: 0;
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
      color: #222;
    }
  }
}

.list-header {
  border-radius: 0;
}

.list-item {
  .albumTitle {
    font-weight: bold;
    color: #333;
  }
}
</style>