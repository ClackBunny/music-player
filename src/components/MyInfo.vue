<!--
 * 用来展示登录用户的信息
 *
 * @Author: kongxin
 * @Date: 2025/4/19 15:22:37
 * @LastEditors: kongxin
 -->
<template>
  <div class="container">
    <!-- 退出登录按钮放在左上角 -->
    <a-button
        v-if="props.hasLogin"
        class="logout-btn"
        title="退出登录"
        type="link"
        :icon="h(LogoutOutlined)"
        @click="props.logout"
    >
    </a-button>
    <div class="avatar">
      <img :src="myInfo.avatarUrl" alt="头像"/>
    </div>
    <div
        class="nickname"
        :data-userId="myInfo.userId"
        :class="{ clickable: ! props.hasLogin }"
        :style="{ pointerEvents: props.hasLogin ? 'none' : 'auto' }"
        @click="handleClick"
    >
      {{ myInfo.nickname }}
    </div>
    <div class="detail">
      <div class="info-item">
        <div class="count">{{ myInfo.eventCount }}</div>
        <div class="name">动态</div>
      </div>
      <div class="info-item">
        <div class="count">{{ myInfo.followCount }}</div>
        <div class="name">关注</div>
      </div>
      <div class="info-item">
        <div class="count">{{ myInfo.followedCount }}</div>
        <div class="name">粉丝</div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { h, toRefs } from "vue";
import type { myInfoType } from "@/components/SearchHeader.vue";
import { LogoutOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  showLogin: () => void;
  logout: () => void;
  hasLogin: boolean;
  myInfo: myInfoType;
}>();
const {myInfo} = toRefs(props)

function handleClick() {
  if (!props.hasLogin) {
    props.showLogin();
  }
}

</script>

<style scoped lang="scss">
$divingLineLength: 60%;

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  max-width: 300px;
  margin: 0 auto;

  .logout-btn {
    position: absolute; /* 绝对定位 */
    top: 10px; /* 离顶部10px */
    right: 10px; /* 离左边10px */
    font-size: 14px;
    color: #f56c6c;
    padding: 0;
  }

  .avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .nickname {
    margin-top: 12px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    text-align: center;
  }

  .detail {
    display: flex;
    margin-top: min(10px, 1vh);
    background: #fff;
    border-radius: 8px;
    overflow: hidden;

    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 min(15px, 2vw);
      text-align: center;
      position: relative;

      // 定义线条高度变量
      --line-height: 60%;

      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: calc((100% - var(--line-height)) / 2); // 自动居中
        height: var(--line-height); // 使用变量控制长度
        width: 1px;
        background-color: #ccc;
      }

      &:last-child::after {
        display: none;
      }

      .count {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }

      .name {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }
  }

}

/* 仅在可以点击的时候应用这个 class */
.clickable {
  cursor: pointer;
  transition: all 0.2s;
}

.clickable:hover {
  color: #409eff; /* 鼠标移上去加个效果也行 */
}
</style>