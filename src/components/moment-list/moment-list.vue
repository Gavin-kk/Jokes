<template>
  <view :class="['moment', 'animate__animated', { animate__slideInUp: !isTheEnd }]" style="animation-duration: 300ms">
    <view class="left">
      <view class="avatar-box" @tap="openUserDetail">
        <image class="avatar" :src="data.user.avatar" mode="scaleToFill"></image>
      </view>
    </view>
    <view class="right">
      <view class="title">
        <view class="title-left" @tap="openUserDetail">
          <view class="username">{{ data.user.username }}</view>
          <gender-tag :age="data.user.userinfo[0].age" :gender="data.user.userinfo[0].gender"></gender-tag>
        </view>
        <view class="title-right">
          <view class="attention" v-show="!isFollow" @tap="attention">关注</view>
          <view class="iconfont icon-guanbi" v-if="!isTheEnd"></view>
        </view>
      </view>
      <view class="time">
        <slot name="time"></slot>
      </view>
      <text class="content">
        <text v-if="isTopicArticle" class="topic-prefix" @tap="openTopic"> #{{ topicText }}# </text>
        <text @tap="openMomentDetail">{{ data.content }}</text>
      </text>
      <view class="image" v-if="imageShow">
        <swiper style="width: 100%; height: 100%" indicator-dots>
          <block v-for="(item, index) in data.contentImg" :key="index">
            <swiper-item>
              <image class="content-img" :src="item" mode="aspectFill" @tap="preViewImage"></image>
            </swiper-item>
          </block>
        </swiper>
      </view>
      <view v-if="videoShow" class="video-box">
        <!--当内容是视频时显示-->
        <video class="video" :src="data.video.videoUrl" :poster="data.video.pic" loop @play="videoPlay"></video>
        <view class="tag" v-if="data.video">
          <view class="play-count" v-if="!isTheEnd">{{ data.video.playCount }}次播放</view>
        </view>
      </view>
      <view v-if="shareShow" class="share-dynamic-box" @tap="openShare">
        <image class="content-img" :src="data.share.pic" mode="aspectFill"></image>
        <text class="share-content">{{ data.content }}</text>
      </view>

      <view class="bottom-bar">
        <!--        <view class="bottom-left">{{ data.address }} </view>-->
        <view class="address">{{ data.address }}</view>
        <view class="bottom-right">
          <view class="iconfont icon-zhuanfa" @tap="share">
            <text class="count">{{ data.shareCount }}</text>
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
import GenderTag from '@components/gender-tag/gender-tag.vue';
import { ArticleType, IArticle } from '@pages/home/store';
import { likeArticleRequest } from '@services/home.request';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { followUsersRequest } from '@services/user.request';
import { IFollowEventPayload } from '@components/dynamic/dynamic.vue';
import { BROWSING_HISTORY_ARTICLE } from '@common/constant/storage.constant';
import lodash from 'lodash';
import { ITopic } from '@pages/moment/store';

const UserModule = namespace('userModule');

@Component({
  components: { GenderTag },
})
export default class MomentList extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  @Prop({ type: Object, default: {} })
  private readonly data!: IArticle;
  @Prop({ type: Boolean, default: false })
  private readonly isTheEnd!: boolean;
  @Prop({ type: Object, default: null })
  private readonly topic!: ITopic | null;
  private isLike: number | null = null;
  private likeCount: number | null = null;
  private isFollow: boolean | null = null;

  // 是否显示话题前缀
  get isTopicArticle(): boolean {
    return (this.data.topics && this.data.topics.length > 0) || !!this.topic;
  }
  // 话题前缀显示什么
  get topicText(): string {
    return (this.data.topics && this.data.topics[0].title) || (this.topic && this.topic.title) || '';
  }

  get videoShow(): boolean {
    return this.data?.type === ArticleType.Video;
  }
  get imageShow(): boolean {
    return this.data?.type === ArticleType.Graphic;
  }
  get textShow(): boolean {
    return this.data?.type === ArticleType.PlainText;
  }
  get shareShow(): boolean {
    return this.data?.type === ArticleType.Share && (!!this.data.share?.pic || !!this.data.video?.pic);
  }

  created() {
    this.countInit();
    this.onFollow();
  }

  countInit() {
    this.isLike = (this.data?.userArticlesLikes && this.data.userArticlesLikes[0]?.isLike) || 0;
    this.likeCount = this.data?.likeCount || 0;
    this.isFollow =
      !!(this.data?.user.followed && this.data.user.followed.length) || this.data?.user.id === this.userInfo.id;
  }
  // 打开topic页面
  openTopic() {
    const topic: ITopic | undefined = this.topic
      ? (this.topic as ITopic)
      : this.data.topics && (this.data.topics[0] as ITopic);
    if (!topic.title) {
      return;
    }
    uni.navigateTo({
      url: `/pages/topic-detail/topic-detail?data=${JSON.stringify(topic)}`,
    });
  }
  // 监听关注事件
  onFollow() {
    uni.$on('follow', (payload: IFollowEventPayload) => {
      if (payload.userId === this.data.userId && this.isFollow !== payload.isFollow) {
        this.isFollow = payload.isFollow;
      }
    });
  }
  // 关注事件
  async attention() {
    // 发送关注请求或取关
    const followRes = await followUsersRequest(this.data.userId);
    const isFollow: boolean = followRes.data.data === '关注成功';
    uni.showToast({ title: followRes.data.data, icon: 'none' });
    uni.$emit('follow', { isFollow, userId: this.data.userId } as IFollowEventPayload);
  }

  // 进入用户详情
  openUserDetail() {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${this.data.user.id}` });
  }

  videoPlay() {
    uni.showToast({ title: '视频播放数++' });
  }
  // 预览图片
  preViewImage() {
    uni.previewImage({
      urls: this.data?.contentImg || [''],
    });
  }

  openCommentsList() {
    uni.showToast({ title: '打开评论列表' });
  }

  share() {
    uni.showToast({ title: '打开分享' });
  }

  openShare() {
    uni.navigateTo({ url: `/pages/content/content?id=${this.data.shareId}` });
  }

  openMomentDetail() {
    if (!this.isTheEnd) {
      uni.navigateTo({ url: `/pages/content/content?id=${this.data.id}` });
      this.addBrowsingHistory();
    }
  }

  //  添加浏览历史
  addBrowsingHistory() {
    if (this.userInfo.id) {
      uni.getStorage({
        key: BROWSING_HISTORY_ARTICLE(this.userInfo.id),
        success: ({ data }: { data: IArticle[] }) => {
          if (Object.keys(this.data as Record<string, any>).length > 0) {
            data.unshift(this.data!);
            uni.setStorage({
              key: BROWSING_HISTORY_ARTICLE(this.userInfo.id),
              data: lodash.uniqBy(data, (e) => e.id),
            });
          }
        },
        fail: () => {
          uni.setStorage({
            key: BROWSING_HISTORY_ARTICLE(this.userInfo.id),
            data: [this.data],
          });
        },
      });
    }
  }

  async likeOrUnlike() {
    if (this.isLike) {
      this.isLike = 0;
      this.likeCount!--;
    } else {
      this.isLike = 1;
      this.likeCount!++;
    }
    await likeArticleRequest({ articleId: this.data.id, type: 1 });
  }

  // get judgingMenAndWomen() {
  //   return !this.data.gender ? 'icon-nan' : 'icon-nv';
  // }
}
</script>

<style lang="scss" scoped>
.moment {
  display: flex;
  width: 750rpx;
  box-sizing: border-box;
  padding: 20rpx;
  padding-bottom: 0;
  border-bottom: 1px solid $borderColor;

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
          color: rgb(79, 181, 225);
          max-width: 400rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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

    .time {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      font-size: 28rpx;
      color: #bbbbbb;
    }
    .video-box {
      position: relative;
      width: 600rpx;
      height: 400rpx;
      .video {
        width: 100%;
        height: 100%;
      }
      .tag {
        @include centered;
        position: absolute;
        right: 10rpx;
        bottom: 10rpx;
        z-index: 1;
        font-size: 14rpx;
        //max-width: 150rpx;
        box-sizing: border-box;
        padding: 10rpx;
        border-radius: 5px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.5);

        .play-count {
          color: #dde4d2;
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

      .topic-prefix {
        color: #0a98d5;
        margin-right: 10rpx;
      }
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
          font-size: 28rpx;
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

      .address {
        font-size: 25rpx;
        @include ellipsis(400rpx);
      }

      .bottom-right {
        display: flex;
        align-items: center;
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
