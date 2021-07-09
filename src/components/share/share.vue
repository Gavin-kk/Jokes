<template>
  <view
    @tap.self="touchShareMask"
    v-show="show"
    :class="['share-box', 'animate__animated', animationBoxClassName]"
    style="animation-duration: 200ms"
  >
    <view :class="['share', 'animate__animated', animationClassName]" style="animation-duration: 200ms">
      <view class="title">分享到</view>
      <view class="center">
        <view class="item-box">
          <view class="iconfont icon-weixin"></view>
          <view class="text">微信好友</view>
        </view>
        <view class="item-box">
          <view class="pyq">
            <image class="pyq-image" src="/static/icon-pyq.png" mode="aspectFit"></image>
          </view>
          <view class="text">朋友圈</view>
        </view>
        <view class="item-box">
          <view class="iconfont icon-xinlangweibo"></view>
          <view class="text">新浪微博</view>
        </view>
        <view class="item-box">
          <view class="iconfont icon-QQ"></view>
          <view class="text">QQ好友</view>
        </view>
      </view>
      <view class="cancel">取消</view>
    </view>
  </view>
</template>

<script lang="ts">
// 分享组件
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Share extends Vue {
  @Prop({ type: Boolean, default: false })
  private isShow!: boolean;

  private show: boolean = false;

  @Watch('isShow')
  watchIsShow(newIsShow: boolean) {
    if (!newIsShow) {
      setTimeout(() => {
        this.show = newIsShow;
      }, 200);
    } else {
      this.show = newIsShow;
    }
  }

  touchShareMask() {
    this.$emit('touchShareMask');
  }

  get animationClassName(): string {
    return this.isShow ? 'animate__fadeInUp' : 'animate__fadeOutDownBig';
  }
  get animationBoxClassName(): string {
    return this.isShow ? 'animate__fadeIn' : 'animate__fadeOut';
  }
}
</script>

<style lang="scss" scoped>
.share-box {
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;

  .share {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 750rpx;
    background: #ffffff;
    z-index: 10;

    .title {
      @include centered;
      height: 100rpx;
      width: 100%;
      font-size: 32rpx;
    }

    .center {
      display: flex;

      .item-box {
        @include centered;
        flex-direction: column;
        flex: 1;

        .text {
          font-size: 30rpx;
          line-height: 60rpx;
        }

        .pyq {
          @include centered;
          width: 100rpx;
          height: 100rpx;
          background: #514d4c;
          border-radius: 50%;
          .pyq-image {
            width: 70%;
            height: 70%;
          }
        }

        .iconfont {
          @include centered;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          font-size: 65rpx;
          color: #ffffff;
        }

        .icon-weixin {
          background: #2ad19b;
        }

        .icon-xinlangweibo {
          background: #ee5e5e;
        }

        .icon-QQ {
          background: #5280ce;
        }
      }
    }

    .cancel {
      @include centered;
      height: 100rpx;
      width: 100%;
      font-size: 32rpx;
    }
  }
}
</style>
