<template>
  <view class="topic-list animate__animated animate__slideInUp" style="animation-duration: 300ms" @tap="intoTheTopic">
    <view class="left">
      <image class="topic-image" :src="data.pic" mode="aspectFill" lazy-load></image>
    </view>
    <view class="right">
      <view class="right-title">{{ data.title }}</view>
      <view class="right-content">
        {{ data.desc }}
      </view>
      <view class="right-dynamic-count-box">
        <view class="dynamic-count">动态 {{ data.articleCount }}</view>
        <view>今日 {{ data.todayCount }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ITopic } from '@pages/moment/store';

@Component({})
export default class topicList extends Vue {
  @Prop(Object)
  private data!: ITopic;

  intoTheTopic() {
    uni.navigateTo({
      url: `/pages/topic-detail/topic-detail?id=${this.data.id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.topic-list {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  box-sizing: border-box;
  width: 710rpx;
  height: 240rpx;
  border-bottom: 1px solid #e9e8e8;

  .left {
    width: 150rpx;
    height: 150rpx;
    border-radius: 10rpx;
    overflow: hidden;
    flex-shrink: 0;

    .topic-image {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    height: 150rpx;
    padding-left: 20rpx;
    font-size: 30rpx;
    box-sizing: border-box;

    .right-title {
      flex: 1;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 35rpx;
      &:after,
      &:before {
        content: '#';
        font-size: 30rpx;
      }
    }

    .right-content,
    .right-dynamic-count-box {
      color: #c8c8c8;
    }

    .right-content {
      flex: 1;
      @include ellipsis(500rpx);
      font-size: 28rpx;
      line-height: 35rpx;
    }

    .right-dynamic-count-box {
      flex: 1;
      display: flex;
      margin-top: 10rpx;
      .dynamic-count {
        padding-right: 15rpx;
      }
    }
  }
}
</style>
