<template>
  <view class="moment animate__animated animate__fadeInUp" style="animation-duration: 700ms">
    <view class="left">
      <view class="avatar-box">
        <image class="avatar" :src="data.avatar" mode="scaleToFill"></image>
      </view>
    </view>
    <view class="right">
      <view class="title">
        <view class="title-left">
          <view class="username">{{ data.username }}</view>
          <view class="grade" :style="{ background: data.gender ? '#ff6a8d' : '#44b3ff' }"
            ><view :class="['iconfont', judgingMenAndWomen]">{{ data.age }}</view></view
          >
        </view>
        <view class="title-right">
          <view class="attention" v-show="!isFollow" @tap="attention">关注</view>
          <view class="iconfont icon-guanbi"></view>
        </view>
      </view>
      <text class="content" @tap="openMomentDetail">{{ data.content }}</text>
      <view :class="['image']" v-if="!data.share" v-show="data.momentPic" @tap="openMomentDetail">
        <image class="content-img" :src="data.momentPic" mode="aspectFill"></image>
        <!--          当内容是视频时显示-->
        <view class="video-play-mask" v-if="data.video">
          <view class="iconfont icon-bofang"></view>
        </view>
        <view class="tag" v-if="data.video" @tap="openMomentDetail">
          <view class="play-count">{{ data.video.playCount }}</view>
          <view>{{ data.video.totalTime }}</view>
        </view>
      </view>
      <view v-else class="share-dynamic-box" @tap="openShare">
        <image class="content-img" :src="data.share.momentPic" mode="aspectFill"></image>
        <text class="share-content">{{ data.share.content }}</text>
      </view>
      <view class="bottom-bar">
        <view class="bottom-left">{{ data.address }} </view>
        <view class="bottom-right">
          <view class="iconfont icon-zhuanfa" @tap="share">
            <text class="count">{{ data.forwardCount }}</text>
          </view>
          <view class="iconfont icon-pinglun1" @tap="openCommentsList">
            <text class="count">{{ data.commentCount }}</text>
          </view>
          <view :class="['iconfont', 'icon-ccdbaa', { isLike: isLike }]" @tap="likeOrUnlike">
            <text class="count">{{ likeCount }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// eslint-disable-next-line import/no-self-import
import { IMomentList } from './moment-list';

@Component({})
export default class MomentList extends Vue {
  @Prop(Object)
  private data!: IMomentList;

  private isLike: number | null = null;
  private likeCount: number | null = null;
  private isFollow: number | null = null;

  created() {
    this.isLike = this.data.isLike;
    this.likeCount = this.data.likeCount;
    this.isFollow = this.data.isFollow;
  }

  attention() {
    uni.showToast({ title: '关注成功' });
    this.isFollow = 1;
  }

  openCommentsList() {
    uni.showToast({ title: '打开评论列表' });
  }

  share() {
    uni.showToast({ title: '打开分享' });
  }

  openShare() {
    uni.showToast({ title: '打开分享' });
  }

  openMomentDetail() {
    uni.showToast({ title: '打开动态详情' });
  }

  likeOrUnlike() {
    if (this.isLike) {
      this.isLike = 0;
      this.likeCount!--;
    } else {
      this.isLike = 1;
      this.likeCount!++;
    }
  }

  get judgingMenAndWomen() {
    return !this.data.gender ? 'icon-nan' : 'icon-nv';
  }
}
</script>

<style lang="scss" scoped>
.moment {
  display: flex;
  width: 750rpx;
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
    box-sizing: border-box;
    height: 100%;
    flex-grow: 1;
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
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #b1b1b1;
          max-width: 200rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .grade {
          @include centered;
          height: 30rpx;

          border-radius: 30rpx;
          overflow: hidden;
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
      @include twoLines(8);
      box-sizing: border-box;
      flex-shrink: 0;
      overflow: hidden;
      width: 590rpx;
      margin: 15rpx 15rpx;
      margin-left: 0;
      line-height: 60rpx;
      color: #000000;
      font-size: 35rpx;
    }

    .image {
      position: relative;
      border-radius: 10rpx;
      width: 615rpx;
      height: 400rpx;
      box-sizing: border-box;
      overflow: hidden;

      .content-img {
        width: 100%;
        height: 100%;
        will-change: transform;
      }

      .video-play-mask {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .iconfont {
          @include centered;
          width: 100rpx;
          height: 100rpx;
          font-size: 100rpx;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .tag {
        display: flex;
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        padding: 10rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10rpx;
        box-sizing: border-box;
        overflow: hidden;
        font-size: 14rpx;
        color: #dde4d2;

        .play-count {
          margin-right: 10rpx;
        }
      }
    }

    // 分享动态的css
    .share-dynamic-box {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 120rpx;
      width: 100%;
      background: #f7f7f7;
      border-radius: 10rpx;
      flex-shrink: 0;
      padding-right: 10rpx;

      .content-img {
        width: 150rpx;
        height: 100rpx;
        border-radius: 20rpx;
        overflow: hidden;
      }

      .share-content {
        @include twoLines(2);
        line-height: 50rpx;
        font-size: 30rpx;
        width: 420rpx;
        flex-shrink: 0;
        margin-left: 20rpx;
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

        .isLike {
          color: #fedd31;
        }
      }
    }
  }
}
</style>
