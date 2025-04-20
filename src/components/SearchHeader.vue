<template>
  <div class="container">
    <div class="left">
      <a-button :icon="h(LeftOutlined)" @click="router.back()"/>
    </div>
    <div class="right">
      <a-input-search
          v-model:value="value"
          placeholder="搜索..."
          enter-button
          @search="onSearch"
          style="max-width: 30vh;display: inline;height: 100%; margin-right:1vh"/>
      <a-popover
          trigger="click"
          v-model:open="isUserInfoOpen"
          placement="bottomRight"
          :arrow="false"
      >
        <template #content>
          <MyInfo :showLogin="showLogin" :hasLogin="hasLogin" :logout="logout" :myInfo="myInfo"/>
        </template>
        <a-button :icon="h(SettingOutlined)" @click="isUserInfoOpen=!isUserInfoOpen"/>
      </a-popover>
    </div>
    <!-- 登录弹窗 -->
    <a-modal
        v-model:open="isLoginOpen"
        title="扫码登录"
        centered
        :destroyOnClose="true"
        :footer="null"
        @cancel="isUserInfoOpen = true"
    >
      <Login :doneLogin="doneLogin" :closeLogin="closeLogin"/>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { h, onMounted, ref, watch } from 'vue';
import { LeftOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";
import MyInfo from "@/components/MyInfo.vue";
import Login from "@/components/Login.vue";
import { loginStatus } from "@/api/login.ts";
import { getUserDetail } from "@/api/user.ts";
import Cookies from "js-cookie";

const value = ref<string>('');
const router = useRouter();
const isUserInfoOpen = ref(false);
const isLoginOpen = ref(false)
const hasLogin = ref(false);
// 登录信息
export type myInfoType = {
  userId: number,
  nickname: string
  avatarUrl: string,
  eventCount: number,
  followCount: number,
  followedCount: number,
}
// 登录信息初始值
const initialUserInfo: myInfoType = {
  userId: 0,
  nickname: "请登录",
  avatarUrl: "/logo.png",
  eventCount: 0,
  followCount: 0,
  followedCount: 0
};
const myInfo = ref<myInfoType>({...initialUserInfo});
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


function logout() {
  hasLogin.value = false;
  Cookies.remove("MUSIC_U");
  Cookies.remove("__csrf");
  Cookies.remove("NMTID");
}

function showLogin() {
  isLoginOpen.value = true;
  isUserInfoOpen.value = false;
}

function doneLogin() {
  hasLogin.value = true;
}

function closeLogin() {
  isLoginOpen.value = false;
}

async function getUserInfo() {
  let res = await loginStatus(Date.now());
  console.log(res);
  if (res.data.profile) {
    myInfo.value.userId = res.data.profile.userId;
    myInfo.value.nickname = res.data.profile.nickname;
    myInfo.value.avatarUrl = res.data.profile.avatarUrl;
    let user = (await getUserDetail(res.data.profile.userId)).profile;
    myInfo.value.eventCount = user.eventCount;
    myInfo.value.followCount = user.follows;
    myInfo.value.followedCount = user.followeds;
    hasLogin.value = true;
    console.log("更新userInfo done");
  } else {
    //myInfo恢复成初始值
    myInfo.value = {...initialUserInfo};
  }
}

onMounted(async () => {
  await getUserInfo();
})
watch(() => hasLogin.value, (newVal) => {
  console.log("登录状态变化了");
  getUserInfo()
},)
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

.myInfoPopover {
  padding: 0;
}
</style>

