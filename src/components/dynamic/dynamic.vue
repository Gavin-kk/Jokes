<template>
  <view class="dynamic animate__animated animate__fadeInUp">
    <view class="title-box">
      <view class="title-left">
        <view class="img-box">
          <image :src="momentData.avatar" mode="widthFix" class="img" lazy-load></image>
        </view>
        <view class="username">{{ momentData.username }}</view>
      </view>
      <view class="title-right">
        <view class="attention-btn" v-if="!whetherFollow" @tap="followUsers">关注</view>
        <view class="close-icon iconfont icon-guanbi" />
      </view>
    </view>
    <view class="text-box" @tap="openDetail(momentData.id)">{{ momentData.title }}</view>
    <view class="img-box" @tap="openDetail(momentData.id)">
      <image class="content-img" :src="momentData.coverImage" mode="aspectFill" lazy-load />
      <view class="play-btn iconfont icon-bofang" v-if="fileType" />
      <view class="video-count" v-if="fileType">
        <view class="play-count">{{ momentData.playCount | handleNumber }}次播放</view>
        <view class="totalTime">{{ momentData.totalTime }}</view>
      </view>
    </view>
    <view class="btn-box">
      <view class="btn-left">
        <view class="btn-child-box" @tap="likeEvent">
          <text :class="[{ like: !!isLike }, 'smiley-icon', 'iconfont', 'icon-icon_xiaolian-mian']"></text>
          {{ likeCount | handleNumber }}
        </view>

        <view class="btn-child-box" @tap="dislikeEvent">
          <text :class="[{ dislike: !!dislike }, 'smiley-icon', 'iconfont', 'icon-kulian']"></text>
          {{ dontLikeCount | handleNumber }}
        </view>
      </view>
      <view class="btn-right">
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-pinglun1"></text>
          {{ momentData.privateMessageCount | handleNumber }}
        </view>
        <view class="btn-child-box">
          <text class="smiley-icon iconfont icon-zhuanfa"></text>
          {{ momentData.shareCount | handleNumber }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { handleNumber } from '@utils/handle-number';

@Component({
  filters: { handleNumber },
})
export default class Dynamic extends Vue {
  @Prop({ type: Object, required: true })
  private momentData!: IMoment;

  private likeCount: number | null = null;
  private dontLikeCount: number | null = null;
  private whetherFollow: number | null = null;
  private isLike: number | null = null;
  private dislike: number | null = null;

  created() {
    this.likeCount = this.momentData.likeCount;
    this.dontLikeCount = this.momentData.dontLikeCount;
    this.whetherFollow = this.momentData.whetherToFollow;
    this.isLike = this.momentData.isLike;
    this.dislike = this.momentData.dislike;
  }
  // 关注用户事件
  followUsers(): void {
    // 发送关注请求
    this.whetherFollow = 1;
    // 显示关注成功提示框
    uni.showToast({
      title: '关注成功',
      icon: 'success',
    });
  }

  // 喜欢帖子事件
  likeEvent(): void {
    // 发送喜欢请求
    if (this.dislike) {
      this.dislike = 0;
      this.dontLikeCount!--;
    }
    if (!this.isLike) {
      this.isLike = 1;
      this.likeCount!++;
    } else if (this.isLike) {
      this.isLike = 0;
      this.likeCount!--;
    }
  }


  // 点击不喜欢帖子事件
  dislikeEvent(): void {
    if (this.isLike) {
      this.isLike = 0;
      this.likeCount!--;
    }
    if (this.dislike) {
      this.dislike = 0;
      this.dontLikeCount!--;
    } else if (!this.dislike) {
      this.dislike = 1;
      this.dontLikeCount!++;
    }
  }

  get whetherToFollow(): boolean {
    console.log(this.whetherFollow);
    return this.whetherFollow === 0;
  }
  get fileType(): boolean {
    return this.momentData?.fileType === 'video';
  }

  openDetail(id: number) {
    //  跳转到对应页面 并请求数据
    uni.showToast({
      title: `跳转到详情页 ${id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.dynamic {
  width: 750rpx;
  padding: 20rpx 20rpx 0 20rpx;
  box-sizing: border-box;
  color: #cdcdcd;
  border-bottom: 1rpx solid #efefef;
  height: 650rpx;

  .title-box {
    @include bothSides;

    .title-left {
      flex: 1;
      @include verticallyCentered;
      justify-content: flex-start;
      height: 100%;

      .img-box {
        @include centered;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        overflow: hidden;

        .img {
          height: 80rpx;
          width: 80rpx;
          will-change: transform;
        }
      }

      .username {
        margin-left: 15rpx;
        font-size: 35rpx;
      }
    }

    .title-right {
      flex: 1;
      @include verticallyCentered;
      justify-content: flex-end;
      height: 100%;

      .attention-btn {
        @include centered;
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
    @include ellipsis(650rpx);
    padding: 20rpx 0;
    color: #000000;
    font-size: 35rpx;
  }

  .img-box {
    position: relative;
    width: 100%;
    height: 350rpx;
    border-radius: 5px;
    overflow: hidden;

    .content-img {
      width: 100%;
      height: 100%;
      will-change: transform;
    }

    .play-btn {
      @include positioningCentered;
      color: rgba(255, 255, 255, 0.7);
      font-size: 100rpx;
    }

    .video-count {
      @include centered;
      position: absolute;
      right: 10rpx;
      bottom: 10rpx;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10rpx;
      color: #dde4d2;
      font-size: 15rpx;

      .play-count {
        margin-right: 10rpx;
      }
    }
  }

  .btn-box {
    @include verticallyCentered;
    width: 100%;
    height: 100rpx;

    .btn-left {
      @include verticallyCentered;
      flex: 1;
      display: flex;
      height: 100%;
    }

    .btn-right {
      @include verticallyCentered;
      flex: 1;
      justify-content: flex-end;
      height: 100%;
    }
    .btn-right > .btn-child-box:nth-child(2) {
      margin-right: 20rpx;
    }
  }
}

.btn-child-box {
  @include verticallyCentered;
  height: 100%;
  font-size: 25rpx;
  // 如果是喜欢的话变成黄色
  .like {
    color: #fbe351;
  }
  .dislike {
    color: #439cea;
  }

  > .smiley-icon {
    display: inline;
    padding: 0 10rpx;
  }

  .smiley-icon:before {
    display: inline-block;
    padding-top: 4rpx;
  }
}
</style>
