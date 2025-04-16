<template>
  <div class="song-list">
    <!-- 歌单数量展示 -->
    <div v-if="playlistCount !== undefined" class="playlist-count">
      共找到 {{ playlistCount }} 个歌单
    </div>

    <!-- 歌单列表展示 -->
    <div v-for="songList in playlists" :key="songList.id" class="playlist-item">
      <div class="playlist-header">
        <img :src="songList.coverImgUrl" alt="cover" class="cover-img"/>
        <div class="playlist-info">
          <h3>{{ songList.name }}</h3>
          <p>{{ songList.description }}</p>
          <div class="playlist-details">
            <span>歌曲数: {{ songList.trackCount }}</span>
            <span>播放数: {{ songList.playCount }}</span>
          </div>
        </div>
      </div>

      <!-- 歌单中的第一首歌曲展示 -->
      <div v-if="songList.track" class="song-preview">
        <p>当前歌曲: {{ songList.track.name }} - {{ songList.track.artists[0].name }}</p>
        <img :src="songList.track.album.picUrl" alt="song album" class="album-img"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  playCount: number;
  description: string;
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album: { picUrl: string };
  };
}

export default defineComponent({
  name: 'SongList',
  props: {
    playlists: {
      type: Array as PropType<Playlist[]>,
      required: true,
    },
    playlistCount: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style scoped>
.song-list {
  padding: 20px;
}

.playlist-count {
  font-size: 14px;
  color: #555;
}

.playlist-item {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.cover-img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  object-fit: cover;
}

.playlist-info {
  margin-left: 15px;
}

h3 {
  font-size: 18px;
  font-weight: bold;
}

.playlist-details {
  color: #888;
  font-size: 14px;
}

.song-preview {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.album-img {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 5px;
  object-fit: cover;
}
</style>
