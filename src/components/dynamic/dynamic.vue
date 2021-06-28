<template>
  <view class="dynamic">
    <view class="title-box">
      <view class="title-left">
        <view class="img-box">
          <image src="~@static/demo/userpic/1.jpg" mode="widthFix" class="img" lazy-load></image>
        </view>
        <view class="username">name</view>
      </view>

      <view class="title-right">
        <view class="attention-btn">+关注</view>
        <view class="close-icon iconfont icon-guanbi" />
      </view>
    </view>
    <view class="text-box">如何用手账改变你的一生?</view>
    <view class="img-box">
      <image class="content-img" src="~@static/demo/datapic/1.jpg" mode="aspectFill" />
    </view>
    <view class="btn-box">
      <view class="btn-left">
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-icon_xiaolian-mian"></text>
          1234
        </view>
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-kulian"></text>
          1234
        </view>
      </view>
      <view class="btn-right">
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-pinglun1"></text>
          1234
        </view>
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-zhuanfa"></text>
          1234
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Dynamic extends Vue {}
</script>

<style lang="scss" scoped>
.dynamic {
  width: 750rpx;
  padding: 20rpx 20rpx 0 20rpx;
  box-sizing: border-box;
  color: #cdcdcd;
  border-bottom: 1rpx solid #ccc;
  short-video .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-left {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;

      .img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #4cd964;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
        }
      }

      .username {
        margin-left: 15rpx;
        font-size: 35rpx;
      }
    }

    .title-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;

      .attention-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000000;
        width: 80rpx;
        height: 40rpx;
        font-size: 20rpx;
        background: #f4f4f4;
        margin-right: 20rpx;
        padding: 0 5rpx;
      }

      .close-icon {
        font-size: 20rpx;
        text-align: center;
        line-height: 40rpx;
      }
    }
  }

  .text-box {
    padding: 20rpx 0;
    color: #000000;
    font-size: 35rpx;
  }

  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;

    .content-img {
      width: 100%;
      height: 350rpx;
    }
  }

  .btn-box {
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 100rpx;

    .btn-left {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
    }

    //.btn-left > .btn-child-box:first-of-type > .smiley-icon {
    //  padding-left: 0;
    //}

    .btn-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
    .btn-right > .btn-child-box:nth-child(2) {
      margin-right: 20rpx;
    }
  }
}

.btn-child-box {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 25rpx;

  > text {
    display: inline;
    padding: 0 10rpx;
  }

  .smiley-icon:before {
    display: inline-block;
    padding-top: 4rpx;
  }
}
</style>
