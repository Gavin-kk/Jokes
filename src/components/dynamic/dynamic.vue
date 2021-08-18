<template>
  <view class="dynamic animate__animated animate__slideInUp" style="animation-duration: 300ms">
    <view class="title-box">
      <view class="title-left" @tap="openUserDetail">
        <view class="img-box">
          <image :src="momentData.user.avatar" mode="widthFix" class="img" lazy-load></image>
        </view>
        <view class="username">{{ momentData.user.username }}</view>
      </view>
      <view class="title-right">
        <view class="attention-btn" v-if="!whetherFollow" @tap="followUsers">关注</view>
        <view class="close-icon iconfont icon-guanbi" />
      </view>
    </view>
    <view class="text-box" @tap="openDetail(momentData.id)">{{ momentData.title }}</view>
    <view class="img-box">
      <template v-if="videoShow">
        <video
          class="content-img"
          :src="momentData.video.videoUrl"
          :poster="momentData.video.pic"
          loop
          @play="videoPlay"
        ></video>
        <view class="video-count">
          <view class="play-count" v-show="playCountControl">
            {{ momentData.video.playCount | handleNumber }}次播放
          </view>
        </view>
      </template>
      <template v-else-if="imageShow">
        <image
          class="content-img"
          :src="momentData.pic"
          mode="aspectFill"
          lazy-load
          @tap="previewImage(momentData.contentImg)"
        />
      </template>
      <template v-else-if="shareShow">
        <view class="share-dynamic-box" @tap="openDetail(momentData.share.id)">
          <image class="content-img" :src="shareImage" mode="aspectFill"></image>
          <text class="share-content">{{ momentData.share.content }}</text>
        </view>
      </template>
      <!--      <image class="content-img" :src="momentData.video.pic" mode="aspectFill" lazy-load />-->
      <!--      <view class="play-btn iconfont icon-bofang" v-if="fileType" />-->
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
        <view class="btn-child-box" @tap="openDetail(momentData.id)">
          <text class="smiley-icon iconfont icon-pinglun1"></text>
          {{ momentData.commentCount | handleNumber }}
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { handleNumber } from '@utils/handle-number';
import { ArticleType, IArticle } from '@pages/home/store';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { likeArticleRequest } from '@services/home.request';
import { followUsersRequest } from '@services/user.request';

const UserModule = namespace('userModule');

export interface IFollowEventPayload {
  userId: number;
  isFollow: boolean;
}

@Component({
  filters: { handleNumber },
})
export default class Dynamic extends Vue {
  @UserModule.State('userInfo')
  private userInfo!: IUser;
  @Prop({ type: Object, required: true })
  private momentData!: IArticle;
  // 本属性只是为了让本组件可以使用到多个地方 不用在获取个人的文章时还要判断是不是要显示关注
  @Prop({ type: Boolean, required: false, default: false })
  private isShowFollow!: boolean;
  // play控件是否显示
  private playCountControl: boolean = true;

  private likeCount: number | null = null;
  private dontLikeCount: number | null = null;
  private whetherFollow: boolean = false;
  private isLike: number | null = null;
  private dislike: number | null = null;

  get shareImage() {
    return this.momentData?.share?.pic || this.momentData?.share?.video?.pic;
  }
  get videoShow(): boolean {
    return this.momentData?.type === ArticleType.Video;
  }
  get imageShow(): boolean {
    return this.momentData?.type === ArticleType.Graphic;
  }
  get textShow(): boolean {
    return this.momentData?.type === ArticleType.PlainText;
  }
  get shareShow(): boolean {
    return (
      this.momentData?.type === ArticleType.Share && (!!this.momentData?.share?.pic || !!this.momentData.video?.pic)
    );
  }

  created() {
    this.countInit();
    this.onFollow();
  }

  // 监听关注事件
  onFollow() {
    uni.$on('follow', (payload: IFollowEventPayload) => {
      if (payload.userId === this.momentData.userId && this.whetherFollow !== payload.isFollow) {
        this.whetherFollow = payload.isFollow;
      }
    });
  }
  // 关注用户事件
  async followUsers() {
    // 发送关注请求或取关
    const followRes = await followUsersRequest(this.momentData.userId);
    const isFollow: boolean = followRes.data.data === '关注成功';
    uni.showToast({ title: followRes.data.data, icon: 'none' });
    uni.$emit('follow', { isFollow, userId: this.momentData.userId } as IFollowEventPayload);
  }

  countInit() {
    this.likeCount = this.momentData.likeCount;
    this.dontLikeCount = this.momentData.disLikeCount;
    this.whetherFollow =
      this.isShowFollow ||
      !!(this.momentData.user.followed && this.momentData.user.followed.length) ||
      this.userInfo.id === this.momentData.user.id;
    this.isLike = (this.momentData.userArticlesLikes && this.momentData.userArticlesLikes[0]?.isLike) || 0;
    this.dislike = this.momentData.userArticlesLikes && this.momentData.userArticlesLikes[0]?.isLike === 0 ? 1 : 0;
  }

  // 视频播放事件
  videoPlay() {
    this.playCountControl = false;
  }

  openDetail(id: number) {
    //  跳转到对应页面 并请求数据
    uni.navigateTo({
      url: `/pages/content/content?id=${id}`,
    });
  }
  // 打开用户详情页面
  openUserDetail() {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${this.momentData.user.id}` });
  }

  // 预览图片
  previewImage(picUrl: string[]) {
    uni.previewImage({ urls: picUrl });
  }

  async likeRequest(type: number) {
    try {
      await likeArticleRequest({ articleId: this.momentData.id, type });
    } catch ({ response }) {
      console.log(response.data);
    }
  }

  // 喜欢帖子事件
  async likeEvent() {
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
    await this.likeRequest(1);
  }

  // 点击不喜欢帖子事件
  async dislikeEvent() {
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
    await this.likeRequest(0);
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
  //height: 650rpx;

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
    //height: 350rpx;
    border-radius: 5px;
    overflow: hidden;

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
        color: #000000;
      }
    }

    .content-img {
      width: 100%;
      height: 350rpx;
      will-change: transform;
    }

    .play-btn {
      @include positioningCentered;
      color: rgba(255, 255, 255, 0.8);
      font-size: 100rpx;
    }

    .video-count {
      @include centered;
      position: absolute;
      right: 10rpx;
      bottom: 20rpx;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      box-sizing: border-box;
      padding: 15rpx;
      color: #dde4d2;

      .play-count {
        font-size: 15rpx;
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
