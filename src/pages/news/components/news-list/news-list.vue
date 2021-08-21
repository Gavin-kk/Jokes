<template>
  <view class="news" @tap="openChat">
    <view class="user-avatar">
      <image class="image" :src="data.avatar" mode="aspectFill" lazy-load></image>
    </view>
    <view class="center">
      <view class="username">{{ data.username }}</view>
      <view class="news-content" v-if="data.content">{{ data.content }}</view>
    </view>
    <view class="right">
      <slot name="right">
        <view class="time">{{ data.time | timeFilter }}</view>
        <view class="unread-count" v-show="isShowTag">
          <uni-badge :text="data.unreadCount" type="error"></uni-badge>
        </view>
      </slot>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue';
import { INews } from '@pages/news/news.vue';
import { timeFilter } from '@common/filters/time.filter';
import { IFans } from '@pages/new-attention/new-attention.vue';

@Component({ components: { UniBadge }, filters: { timeFilter } })
export default class NewsList extends Vue {
  @Prop(Object)
  private data!: INews | IFans;

  get isShowTag(): boolean {
    return (this.data as INews).unreadCount > 0;
  }
  // 打开聊天
  openChat() {
    this.$emit('openChat', (this.data as INews).userId || (this.data as IFans).id);
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
    max-width: 400rpx;

    .username {
      font-size: 32rpx;
    }
    .news-content {
      @include ellipsis(400rpx);
      font-size: 30rpx;
      //
      line-height: 50rpx;
      color: #bdbdbd;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    width: 100rpx;
    flex-grow: 1;

    .time,
    .unread-count {
      display: flex;
      width: 150rpx;
      justify-content: flex-end;
    }
    .time {
      color: #bdbdbd;
      font-size: 30rpx;
      margin-bottom: 10rpx;
      min-width: 180rpx;
    }
  }
}
</style>
