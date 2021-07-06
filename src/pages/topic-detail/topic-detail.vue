<template>
  <view class="">
    <!--    背景模糊-->
    <view class="fuzzy">
      <image class="image" src="/static/demo/topicpic/3.jpeg" mode="aspectFill"></image>
    </view>
    <!--    个人版块-->
    <view class="topic-info">
      <view class="title">
        <view class="title-image-box">
          <image class="title-image" src="/static/demo/topicpic/3.jpeg" mode="aspectFill"></image>
        </view>
        <view class="title-name">#忆往事,在电梯里巧遇马云你会做什么 尽余生#</view>
      </view>
      <view class="topic-count">动态 793 今日 641</view>
      <view class="desc">面试官:在电梯里巧遇马云你会做什么? 90后女孩的回答当场被录用</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class TopicDetail extends Vue {}
</script>

<style lang="scss" scoped>
.root-box {
  padding: 0 20rpx;
}
.fuzzy {
  width: 100%;
  height: 300rpx;

  .image {
    width: 100%;
    height: 100%;
    filter: blur(20px);
  }
}

.topic-info {
  position: relative;
  box-sizing: border-box;
  padding: 0 20rpx;
  width: 100%;
  background: #ffffff;

  .title {
    display: flex;
    height: 110rpx;

    .title-image-box {
      position: relative;
      top: -50%;
      width: 150rpx;
      height: 150rpx;
      overflow: hidden;
      border-radius: 20rpx;
      flex-shrink: 0;

      .title-image {
        width: 100%;
        height: 100%;
      }
    }

    .title-name {
      @include ellipsis(600rpx);
      margin-left: 20rpx;
    }
  }

  .topic-count {
    font-size: 28rpx;
    color: #d1d1d1;
  }

  .desc {
    margin-top: 10rpx;
    font-size: 30rpx;
    color: #b8b8b8;
    line-height: 50rpx;
  }
}
</style>
