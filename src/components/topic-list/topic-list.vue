<template>
  <view class="topic-list animate__animated animate__fadeInUp" @tap="intoTheTopic">
    <view class="left">
      <image class="topic-image" :src="data.pic" mode="aspectFill" lazy-load></image>
    </view>
    <view class="right">
      <view class="right-title">#{{ data.title }}#</view>
      <view class="right-content">
        {{ data.content }}
      </view>
      <view class="right-dynamic-count-box">
        <view class="dynamic-count">动态 {{ data.dynamicCount }}</view>
        <view class="today-pageviews">今日 {{ data.todayCount }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class topicList extends Vue {
  @Prop(Object)
  private data!: {
    id: number;
    pic: string;
    title: string;
    content: string;
    dynamicCount: number;
    todayCount: number;
  };

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
      font-size: 28rpx;
    }

    .right-dynamic-count-box {
      display: flex;
      margin-top: 10rpx;
    }
  }
}
</style>
