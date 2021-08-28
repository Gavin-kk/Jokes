<template>
  <view class="user-box" @tap="openDetail">
    <view class="left">
      <view class="avatar-box">
        <image class="avatar" :src="avatar" mode="aspectFill" lazy-load></image>
      </view>
    </view>
    <view class="right">
      <view class="right-left">
        <view class="username">{{ usernameOrNickname }}</view>
        <view class="visitor-count">总访客 {{ data.totalVisitors }} 今日 {{ data.todaySVisitor }}</view>
      </view>
      <view class="right-right iconfont icon-jinru"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IUser } from '@store/module/user';

@Component({})
export default class User extends Vue {
  @Prop({
    type: Object,
    default: {
      username: '',
      nickname: '',
      totalVisitors: 0,
      todaySVisitor: 0,
    },
  })
  private data!: IUser;

  get usernameOrNickname(): string {
    return this.data.nickname ? this.data.nickname : this.data.username;
  }

  openDetail() {
    uni.navigateTo({
      url: '/pages/personal-space/personal-space',
    });
  }

  get avatar(): string {
    return this.data.avatar
      ? this.data.avatar
      : 'http://localhost:5000/static/304d7fa6-91d8-477b-ac75-58f2bfcd3dcf.png';
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
