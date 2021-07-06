<template>
  <view class="news" @touchstart="touchstart" @touchend="touchend">
    <view class="user-avatar">
      <image class="image" :src="data.avatar" mode="aspectFill" lazy-load></image>
    </view>
    <view class="center">
      <view class="username">{{ data.username }}</view>
      <view class="news-content">{{ data.content }}</view>
    </view>
    <view class="right">
      <!--      {{ slide }}-->
      <view class="time">{{ data.time }}</view>
      <view class="unread-count" v-show="data.unreadCount">
        <uni-badge :text="data.unreadCount" type="error"></uni-badge>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue';

@Component({ components: { UniBadge } })
export default class NewsList extends Vue {
  @Prop(Object)
  private data!: { id: number; username: string; content: string; time: string; unreadCount: number; avatar: string };
  private start: number = 0;
  private end: number = 0;
  touchstart(e: { changedTouches: { clientX: number }[] }) {
    this.start = e.changedTouches[0].clientX;
  }

  touchend(e: { changedTouches: { clientX: number }[] }) {
    this.end = e.changedTouches[0].clientX;
  }
  get slide(): string {
    return this.start < this.end ? '右滑' : '左滑';
  }
}
</script>

<style lang="scss" scoped>
.news {
  display: flex;
  align-items: center;
  width: 100%;
  height: 140rpx;
  border-bottom: 1px solid $borderColor;

  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    .image {
      width: 100%;
      height: 100%;
    }
  }

  .center {
    padding-left: 20rpx;

    .username {
      font-size: 32rpx;
    }
    .news-content {
      @include ellipsis(490rpx);
      font-size: 30rpx;
      color: #bdbdbd;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100rpx;
    flex-shrink: 0;

    .time,
    .unread-count {
      display: flex;
      justify-content: center;
    }
    .time {
      color: #bdbdbd;
      font-size: 30rpx;
      margin-bottom: 10rpx;
    }
    .unread-count {
    }
  }
}
</style>
