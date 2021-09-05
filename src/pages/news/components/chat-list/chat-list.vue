<template>
  <view>
    <!--时间-->
    <view class="time" v-if="time">{{ data.time | timeFilter }}</view>
    <view :class="['chat-item', { 'row-reverse': data.isMe }]">
      <view class="image-box" @tap="openUser">
        <image v-if="imageShow" class="image" :src="data.avatar" mode="aspectFill" lazy-load></image>
      </view>
      <view class="content-box">
        <!-- 显示文字-->
        <template v-if="showText">
          <text class="content">
            {{ data.content }}
          </text>
        </template>
        <!--显示图片-->
        <template v-else-if="showImage">
          <view class="content-image-box">
            <image class="content-image" :src="data.content" mode="widthFix" lazy-load></image>
          </view>
          <template v-if="isShowProgress">
            <view class="schedule">
              <round-schedule-progress
                :x="10"
                :y="10"
                :r="8"
                color="#cccccc"
                bg-color="#969696"
                style="height: 20px; width: 20px"
                :progress="data.progressRate"
              />
            </view>
          </template>
        </template>
        <template v-else-if="showVideo">
          <view class="content-video-box">
            <video
              class="content-video"
              id="content-video"
              :controls="isShowControl"
              :src="data.content"
              :show-center-play-btn="false"
              @fullscreenchange="fullscreenchange"
            ></video>
            <view class="video-play" v-show="!isShowControl" @tap="play"></view>
            <view class="video-mask" @tap="play"></view>
            <!--            @play="play"-->
          </view>
          <template v-if="isShowProgress">
            <view class="schedule">
              <round-schedule-progress
                :x="10"
                :y="10"
                :r="8"
                color="#cccccc"
                bg-color="#969696"
                style="height: 20px; width: 20px"
                :progress="data.progressRate"
              />
            </view>
          </template>
          <template v-else-if="isError">
            <view class="schedule">
              <image src="/static/error.png" class="image"></image>
            </view>
          </template>
        </template>
        <view :class="['angle', { me: data.isMe }]"></view>

        <template v-if="isError">
          <view class="schedule">
            <image src="/static/error.png" class="image"></image>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { timeFilter } from '@common/filters/time.filter';
import RoundScheduleProgress from '@components/round-schedule-progress/round-schedule-progress.vue';
import { IChat } from '@pages/chat/chat.vue';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';

moment.locale('zh-cn');
export enum ContentType {
  image = 'image',
  text = 'text',
  video = 'video',
}
const UserModule = namespace('userModule');

@Component({
  components: { RoundScheduleProgress },
  filters: { timeFilter },
})
export default class ChatList extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  @Prop({ type: Object })
  private readonly data!: IChat;
  @Prop(Number)
  private readonly preTime!: number;
  private isShowControl: boolean = false;
  private videoCtx: UniApp.VideoContext | null = null;

  // 是否显示发送进度
  get isShowProgress(): boolean {
    return !!this.data.progressRate && this.data.progressRate !== 100 && !this.data.errorState;
  }

  get time(): boolean {
    return !(timeFilter(this.preTime) === timeFilter(this.data.time));
  }
  // 是否错误
  get isError(): boolean {
    return !!this.data.errorState;
  }

  // 修复小程序端 初始化时图片未加载时 报错
  get imageShow() {
    return !!this.data.content && !!this.data.avatar;
  }
  // 判断内容类型
  get showText(): boolean {
    return this.data.type === ContentType.text;
  }
  get showImage(): boolean {
    return this.data.type === ContentType.image;
  }
  get showVideo(): boolean {
    return this.data.type === ContentType.video;
  }

  mounted() {
    this.videoCtx = uni.createVideoContext('content-video', this);
  }

  fullscreenchange(arg: { detail: { fullScreen: boolean } }) {
    if (!arg.detail.fullScreen) {
      this.videoCtx?.pause();
    }
    this.isShowControl = arg.detail.fullScreen;
  }

  play() {
    this.videoCtx?.requestFullScreen();
    this.videoCtx?.seek(0);
    this.videoCtx?.play();
  }

  openUser() {
    let userId: number;
    if (typeof this.data.user?.id === 'undefined') {
      userId = this.userInfo.id;
    } else {
      userId = this.data.user?.id;
    }
    uni.navigateTo({
      url: `/pages/personal-space/personal-space?userId=${userId}`,
    });
  }
}
</script>

<style lang="scss" scoped>
///deep/.uni-video-progress-container {
//  display: none;
//}
///deep/.uni-video-current-time {
//  margin-right: 10rpx;
//}
///deep/.
.time {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
}
.row-reverse {
  flex-direction: row-reverse;
}

.chat-item {
  position: relative;
  //flex-direction: row-reverse;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx;

  .video-play {
    $bgs: 100rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
    background: url('/static/play.png') no-repeat;
    background-size: $bgs;
    width: $bgs;
    height: $bgs;
  }

  .video-mask {
    position: absolute;
    left: 20rpx;
    bottom: 20rpx;
    right: 20rpx;
    top: 20rpx;

    background: rgba(0, 0, 0, 0.5);
  }

  .image-box {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    .image {
      width: 100%;
      height: 100%;
    }
  }

  .content-box {
    position: relative;
    max-width: 400rpx;
    box-sizing: border-box;
    padding: 20rpx;
    background: #f4f4f4;
    border-radius: 20rpx;
    margin: 0 20rpx;

    .content-image-box {
      width: 360rpx;
      height: auto;
      box-sizing: border-box;

      .content-image {
        height: auto;
        width: 100%;
      }
    }
    .content-video-box {
      width: 360rpx;
      height: auto;
      .content-video {
        width: 100%;
        transition: all 0.3s;
        height: 250rpx;
      }
    }

    .schedule {
      position: absolute;
      left: -70rpx;
      top: 50%;
      transform: translateY(-50%);

      .image {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .angle {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 10rpx;
      z-index: -1;
      width: 0;
      height: 0;
      transform: translateX(-70%);
      border-width: 30rpx;
      border-style: solid;
      border-top-color: transparent;
      border-bottom-color: transparent;
      border-right: 40rpx solid #f4f4f4;
      border-left-color: transparent;
    }

    .me {
      left: 430rpx;
      border-left: 40rpx solid #f4f4f4;
      border-right: 30rpx solid transparent;
    }

    .content {
      margin-right: 20rpx;
      font-size: 30rpx;
      word-wrap: break-word;
    }
  }
}
</style>
