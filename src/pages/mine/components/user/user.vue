<template>
  <view class="user-box" @tap="openDetail">
    <view class="left">
      <view class="avatar-box">
        <image class="avatar" src="/static/demo/userpic/1.jpg" mode="aspectFill" lazy-load></image>
      </view>
    </view>
    <view class="right">
      <view class="right-left">
        <view class="username">{{ data.username }}</view>
        <view class="visitor-count">总访客 {{ data.totalVisitors }} 今日 {{ data.todayVisitor }}</view>
      </view>
      <view class="right-right iconfont icon-jinru"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface IUserinfo {
  username: string;
  totalVisitors: number;
  todayVisitor: number;
}

@Component({})
export default class User extends Vue {
  @Prop({
    type: Object,
    default: {
      username: '',
      totalVisitors: 0,
      todayVisitor: 0,
    },
  })
  private data!: IUserinfo;

  openDetail() {
    uni.navigateTo({
      url: '/pages/personal-space/personal-space',
    });
  }
}
</script>

<style lang="scss" scoped>
// 已登录
.user-box {
  @include bothSides;
  box-sizing: border-box;
  padding: 20rpx 20rpx;
  width: 100%;

  .left {
    .avatar-box {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      .avatar {
        will-change: transform;
        width: 100%;
        height: 100%;
      }
    }
  }

  .right {
    @include bothSides;
    flex: auto;
    margin-left: 20rpx;

    .right-left {
      .username {
        line-height: 50rpx;
        font-size: 34rpx;
      }
      .visitor-count {
        line-height: 50rpx;
        color: #c9c9c9;
        font-size: $fontSize;
      }
    }
  }
}
</style>
