<template>
  <a-config-provider
      :theme="{
      token: {
        colorPrimary: '#fc3d49',
      },
    }"
  >
    <div class="common-layout">
      <!--      <a-layout style="min-height: 100vh">-->
      <!--          <a-layout-header style="background: #fff; padding: 0;">-->
      <!--            <search-header/>-->
      <!--          </a-layout-header>-->
      <!--          <a-layout-content style="background: #fff; padding: 0;margin: 0 1px;">-->
      <!--            <Menu/>-->
      <!--            <router-view></router-view>-->
      <!--          </a-layout-content>-->
      <!--          <a-layout-footer style="padding: 0;height:15vh;max-height: 100px">-->
      <!--            <PlayFooter/>-->
      <!--          </a-layout-footer>-->
      <!--        </a-layout>-->
      <a-layout style="height: 100%;min-width: 700px;min-height: 500px;">
        <a-layout-content style="height: 100%;">
          <a-layout style="height: 100%;">
            <Menu/>
            <a-layout>
              <a-layout-header :style="{ margin: '1px 1px', padding:'0px', background: '#fff' }">
                <SearchHeader/>
              </a-layout-header>
              <a-layout-content
                  :style="{ margin: '1px 1px', padding: '0px', background: '#fff', minHeight: '280px',height:'100%' }">
                <router-view/>
              </a-layout-content>
            </a-layout>
          </a-layout>
        </a-layout-content>
        <a-layout-footer style="margin: 1px 1px; padding: 0px;height:15vh;max-height: 100px">
          <PlayFooter/>
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import PlayFooter from "@/components/PlayFooter.vue";
import Menu from "@/components/Menu.vue";
import { ref } from "vue";
import SearchHeader from "@/components/SearchHeader.vue";

const selectedKeys = ref<string[]>(['1']);

let collapsed = ref<boolean>(false);
</script>

<style lang="scss" scoped>
.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #c9ccd1;
  min-height: 100vh;
  min-width: 100vw;

  div {
    background: #fff;
    //border: 2px solid #000000;
  }
}


html, body {
  width: 100%;
  height: 100%;
  min-height: 100%;
  min-width: 100%;
}

</style>
