<template>
  <a-layout-sider
      v-model:collapsed="collapsed"
      theme="light"
      :trigger="null"
      style="height: 100%; width: 100%;">
    <div class="container">
      <div class="logo">
        <img src="/logo.png" alt="logo">
        <span id="logoTitle" v-show="!collapsed">空信音乐</span>
      </div>
      <div class="trigger">
        <menu-unfold-outlined
            v-if="collapsed"
            @click="trigger()"
        />
        <menu-fold-outlined v-else @click="trigger()"/>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" :inline-collapsed="collapsed" theme="light" mode="inline"
              @click="clickItem" :items="menuItems">
      </a-menu>

    </div>
  </a-layout-sider>

</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useLayoutSideStore } from "@/stores/layoutSide.ts";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useLayoutSideStore();
const {collapsed, menuItems, routeMap} = storeToRefs(store);
const {trigger, getRoute} = store;
const selectedKeys = ref<string[]>(['1']);

function clickItem(item: any) {
  router.push({path: getRoute(item.key), params: {item}});
}
</script>

<style lang="scss" scoped>
$logoHeight: 32px;

.logo {
  height: $logoHeight;
  display: flex;
  //margin-top: ($logoHeight*0.5);
  margin-bottom: ($logoHeight*0.5);
  justify-content: center;
  align-items: center;
  align-content: center;
  font-size: $logoHeight * 0.625;

  img {
    height: 80%;
  }
}

#logoTitle {
  margin-left: 10px;
}

.container {
  height: 100%;
  padding-top: ($logoHeight*0.5);
  position: relative;
}

.trigger {
  width: 100%;
  margin-bottom: $logoHeight*0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  position: absolute;
  bottom: 0;
}
</style>