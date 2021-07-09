<template>
  <view>
    <!--时间-->
    <view class="time" v-if="time">{{ time }}</view>
    <view :class="['chat-item', { 'row-reverse': data.isMe }]">
      <view class="image-box">
        <image v-if="imageShow" class="image" :src="data.avatar" mode="aspectFill" lazy-load></image>
      </view>
      <view class="content-box">
        <text class="content" v-if="type">
          {{ data.content }}
        </text>
        <view class="content-image-box" v-else>
          <image v-if="imageShow" class="content-image" :src="data.content" mode="widthFix" lazy-load></image>
        </view>
        <view :class="['angle', { me: data.isMe }]"></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';

moment.locale('zh-cn');
export enum ContentType {
  image = 'image',
  text = 'text',
}

@Component({})
export default class ChatList extends Vue {
  @Prop(Object)
  private data!: {
    isMe: boolean;
    avatar: string;
    type: ContentType; // 发送内容的类型
    content: string; // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
    time: number; // 时间戳
  };

  @Prop(Number)
  private preTime!: number;

  // 修复小程序端 初始化时图片未加载时 报错
  get imageShow() {
    return !!this.data.content && !!this.data.avatar;
  }

  get time(): string {
    // eslint-disable-next-line no-underscore-dangle
    const _time: number = this.data.time;
    // 当前时间戳
    const currentTime: number = new Date().getTime();
    // 时间差
    const timeDifference = currentTime - _time;
    // 分
    const minute: number = 1000 * 60;
    // 时
    const hour: number = minute * 60;
    // 天
    const day: number = hour * 24;
    // 月
    const month: number = day * 30;
    // 年
    const year: number = month * 12;
    let formatText: string = '';
    switch (true) {
      case _time - this.preTime < 1000 * 60 && _time - this.preTime > 0: {
        // 如果上一条记录和当前记录时间戳之间相差不超过1分钟 不显示时间.
        return '';
      }
      case timeDifference > year:
      case timeDifference > month:
      case timeDifference > day * 5:
        formatText = 'LLL';
        break;
      case timeDifference < day * 5 && timeDifference > day * 2:
        formatText = 'dddd';
        break;
      case timeDifference < day * 2 && timeDifference > day:
        return moment(_time).subtract('days').calendar();
      case timeDifference < day && timeDifference > hour * 12:
        formatText = 'LTS';
        break;
      case timeDifference < day && timeDifference < hour * 12 && timeDifference > hour:
        return moment(_time).startOf('hour').fromNow();
      case timeDifference < hour:
        return moment(_time).startOf('minute').fromNow();
      default:
    }
    return moment(this.data.time).format(formatText);
  }

  // 判断内容类型
  get type(): boolean {
    return this.data.type === ContentType.text;
  }
}
</script>

<style lang="scss" scoped>
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
  //flex-direction: row-reverse;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx;

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
