<template>
  <view class="top-categories-box">
    <view class="title">
      <view class="title-left">热门分类</view>
      <view class="title-right" @tap="clickForMore">更多 <text class="iconfont icon-jinru" /></view>
    </view>
    <view class="classify-list">
      <view
        class="list-item"
        v-for="item in classifyTagListLimit"
        :key="item.id"
        @tap="classifyTagClick(item.id, item.title)"
      >
        {{ item.title }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ITopicClassify } from '@pages/moment/store';
import { namespace } from 'vuex-class';

const MomentModule = namespace('momentModule');

@Component({})
export default class PopularCategories extends Vue {
  @MomentModule.State('topicClassifyList')
  private topicClassifyList!: ITopicClassify[];

  // 限制 classifyTagList 长度为6
  // private classifyTagListLimit: ITopicClassify[] | null = null;
  get classifyTagListLimit() {
    if (this.topicClassifyList.length > 6) {
      // 只要前六个
      console.log(this.topicClassifyList.slice(0, 6));
      return this.topicClassifyList.slice(0, 6);
    }
    return this.topicClassifyList;
  }
  created() {}

  classifyTagClick(id: number, text: string) {
    this.$emit('classifyTagClick', id, text);
  }

  clickForMore() {
    this.$emit('clickMoreCategories');
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.top-categories-box {
  width: 100%;
  height: 150rpx;

  .title {
    @include bothSides;
    width: 100%;
    height: 70rpx;

    .title-left {
      @include centered;
      font-size: 30rpx;
      height: 100%;
      color: #424242;
    }

    .title-right {
      @include centered;
      height: 100%;
      color: #dedede;
      font-size: 30rpx;

      .icon-jinru {
        @include centered;
        height: 100%;
      }
      .icon-jinru:before {
        @include centered;
        width: 100%;
        height: 100%;
        font-size: 32rpx;
        padding-top: 4rpx;
      }
    }
  }

  .classify-list {
    display: flex;
    align-items: center;
    height: 80rpx;

    .list-item {
      flex: 1;
      @include centered;
      box-sizing: border-box;
      width: 100rpx;
      background: #f7f7f7;
      font-size: 29rpx;
      padding: 10rpx 10rpx;
      margin: 0 10rpx;
      color: #9b9b9b;
      border-radius: 10rpx;
    }
  }
}
</style>
