<template>
  <view>
    <uni-nav-bar :status-bar="isStatusBar">
      <view class="nav-left" slot="left">
        <view class="iconfont icon-qiandao"></view>
      </view>
      <block slot="default">
        <view class="nav-center">
          <view :class="['item', 'follow', { active: isActive }]" @tap="changeActive(true)">关注</view>
          <view :class="['item', 'topic', { active: !isActive }]" @tap="changeActive(false)">话题</view>
        </view>
      </block>
      <view class="nav-right" slot="right">
        <view class="iconfont icon-bianji1"></view>
      </view>
    </uni-nav-bar>
    <!--   列表组件-->
    <view class="moment">
      <view class="left">
        <view class="avatar-box">
          <image class="avatar" src="/static/demo/userpic/8.jpg" mode="scaleToFill"></image>
        </view>
      </view>
      <view class="right">
        <view class="title">
          <view class="title-left">
            <view class="username">三元先生</view>
            <view class="grade"><view class="iconfont icon-nan">26</view></view>
          </view>
          <view class="title-right">
            <view class="attention">关注</view>
            <view class="iconfont icon-guanbi"></view>
          </view>
        </view>
        <view class="content">六道快手家常菜，11111111好吃又下饭，家人都喜欢</view>
        <view class="image">
          <image class="content-img" src="/static/demo/datapic/2.jpg" mode="aspectFill"></image>
        </view>
        <view class="bottom-bar">
          <view class="bottom-left"> 深圳 龙岗 </view>
          <view class="bottom-right">
            <view class="iconfont icon-zhuanfa"><text class="count">36</text></view>
            <view class="iconfont icon-pinglun1"><text class="count">36</text></view>
            <view class="iconfont icon-ccdbaa"><text class="count">36</text></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';

@Component({ components: { UniNavBar } })
export default class Moment extends Vue {
  private isStatusBar: boolean = true;

  created() {
    // #ifdef MP-WEIXIN
    this.isStatusBar = false;
    // #endif
  }
  private isActive: boolean = true;

  changeActive(active: boolean) {
    this.isActive = active;
  }
}
</script>

<style lang="scss">
@import 'src/common/style/global';

.iconfont {
  font-size: 22px;
}
.icon-qiandao {
  color: rgb(215, 169, 91);
}

.nav-right,
.nav-left {
  /*  #ifdef APP-PLUS*/
  padding: 0 10rpx;
  /*  #endif*/
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.nav-center {
  @include centered;
  width: 100%;
  height: 100%;

  .item {
    @include centered;
    position: relative;
    width: 100rpx;
    height: 100%;
  }

  .active:after {
    content: '';
    position: absolute;
    bottom: 10rpx;
    display: inline-block;
    width: 80%;
    height: 10rpx;
    background: #fbe351;
  }
}

.moment {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx;
  padding-bottom: 0;
  border-bottom: 1px solid #cccccc;

  .left {
    width: 80rpx;
    .avatar-box {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-top: 15rpx;

      .avatar {
        height: 80rpx;
        width: 80rpx;
      }
    }
  }
  .right {
    flex-grow: 1;
    box-sizing: border-box;
    height: 100%;
    padding-left: 15rpx;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50rpx;
      width: 100%;
      padding: 10rpx 0;
      font-size: 28rpx;

      .title-left {
        display: flex;
        align-items: center;
        .username {
          @include centered;
        }
        .grade {
          @include centered;
          height: 30rpx;
          background: #44b3ff;
          border-radius: 30rpx;
          padding: 0 10rpx;
          margin-left: 10rpx;

          .iconfont {
            font-size: 24rpx;
            color: #dbf0ff;
          }
        }
      }
      .title-right {
        @include centered;

        .attention {
          @include centered;
          width: 80rpx;
          height: 40rpx;
          background: #f4f4f4;
          margin-right: 10rpx;
          padding: 0 5rpx;
          font-size: 20rpx;
        }

        .iconfont {
          font-size: 20rpx;
          color: #d5d5d5;
        }
      }
    }

    .content {
      flex-shrink: 0;
      padding: 15rpx 0;
      color: #000000;
      font-size: 35rpx;
    }

    .image {
      width: 615rpx;
      height: 400rpx;
      border-radius: 10rpx;
      overflow: hidden;

      .content-img {
        width: 100%;
        height: 100%;
      }
    }

    .bottom-bar {
      height: 100rpx;
      @include bothSides;
      color: #cdcdcd;
      font-size: 28rpx;

      .bottom-left {
      }

      .bottom-right {
        @include centered;
        height: 100%;

        .iconfont {
          @include centered;
          height: 100%;
          font-size: 28rpx;

          .count {
            padding: 0 10rpx;
          }
        }
      }
    }
  }
}
</style>
