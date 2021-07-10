<template>
  <view :class="['box', { reply: data.isReply }]">
    <view class="left">
      <view class="avatar-box" @tap="userClick">
        <image class="avatar" :src="data.avatar" mode="widthFix"></image>
      </view>
    </view>
    <view class="right">
      <view class="username" @tap="userClick">{{ data.username }}</view>
      <view class="comment-text" @tap="contentClick">{{ data.content }}</view>
      <view class="time">{{ data.createAt }}</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface ICommentData {
  id?: number; // 评论的id
  userId?: number; // 用户的id
  isReply: boolean;
  avatar: string;
  username: string;
  content: string;
  createAt: string;
}

@Component({})
export default class Comment extends Vue {
  @Prop(Object)
  private data!: ICommentData;

  contentClick() {
    this.$emit('contentClick', this.data.content);
  }

  userClick() {
    this.$emit('userClick', this.data.username);
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 20rpx;

  .left {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100rpx;
    height: auto;
    flex-shrink: 0;

    .avatar-box {
      width: 80rpx;
      height: 80rpx;
      overflow: hidden;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 10rpx;

      .avatar {
        width: 100%;
        height: 100%;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 28rpx;

    .username {
      color: #4fb5e1;
      line-height: 50rpx;
      @include ellipsis(400rpx);
    }

    .comment-text {
      line-height: 50rpx;
      font-size: 30rpx;
      word-break: break-all;
    }

    .time {
      line-height: 50rpx;
      color: #cccccc;
    }
  }
}

.reply {
  width: auto;
  box-sizing: border-box;
  margin-left: 100rpx;
  margin-right: 20rpx;
  background: #f4f4f4;
  border-radius: 5rpx;
}
</style>
