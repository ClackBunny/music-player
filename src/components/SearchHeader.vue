<template>
  <div class="container">
    <div class="left">
      <a-button :icon="h(LeftOutlined)"/>
    </div>
    <div class="right">
      <a-input-search
          v-model:value="value"
          placeholder="搜索..."
          enter-button
          @search="onSearch"
          style="max-width: 30vh;display: inline;height: 100%; margin-right:1vh"/>
      <a-button :icon="h(SettingOutlined)"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { LeftOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";


const value = ref<string>('');
const router = useRouter();
const onSearch = function (searchValue: string) {
  searchValue = searchValue.trim();
  router.push({
    path: `/search`,
    query: {
      keyword: searchValue,
      type: "singleSong"
    }
  });
};

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding: 1vh 1vw;

  .left {
    width: 30%;
    display: flex;
  }

  .right {
    width: 70%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

