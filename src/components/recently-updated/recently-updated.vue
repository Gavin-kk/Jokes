<template>
  <view class="box">
    <view class="title">最近更新</view>
    <view class="topic-list">
      <view class="left">
        <image class="topic-image" src="/static/demo/topicpic/1.jpeg" mode="aspectFill"></image>
      </view>
      <view class="right">
        <view class="right-title">#话题记录本#</view>
        <view class="right-content"
          >面试官:在电梯里巧遇马云你会做什么? 90后
          人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用
        </view>
        <view class="right-dynamic-count-box">
          <view class="dynamic-count">动态 545</view>
          <view class="today-pageviews">今日 200</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class RecentlyUpdated extends Vue {}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.box {
  padding: 20rpx;
  border-top: 1px solid #e9e8e8;

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 60rpx;
    font-size: 30rpx;
  }

  .topic-list {
    display: flex;
    align-items: center;
    padding: 10rpx 0;
    box-sizing: border-box;
    width: 710rpx;
    height: 240rpx;
    border-bottom: 1px solid #e9e8e8;

    .left {
      width: 180rpx;
      height: 190rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;

      .topic-image {
        width: 100%;
        height: 100%;
      }
    }

    .right {
      height: 190rpx;
      padding-left: 20rpx;
      font-size: 30rpx;
      box-sizing: border-box;

      .right-title {
        height: 70rpx;
        line-height: 70rpx;
        font-size: 35rpx;
      }

      .right-content,
      .right-dynamic-count-box {
        color: #c8c8c8;
      }

      .right-content {
        @include twoLines(2);
      }

      .right-dynamic-count-box {
        display: flex;
        margin-top: 10rpx;
      }
    }
  }
}
</style>
