<template>
  <view class="search-item-box">
    <view class="iconfont icon-sousuo"></view>
    <view class="search-title" @tap="clickItem">{{ dataC.title }}</view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator';
import { IArticle } from '@pages/home/store';

@Component({})
export default class SearchPreview extends Vue {
  @PropSync('data', { type: Object, default: {} })
  private dataC!: IArticle;

  clickItem() {
    this.$emit('clickItem', this.dataC);
  }
}
</script>

<style lang="scss" scoped>
.search-item-box {
  display: flex;
  align-items: center;
  height: 100rpx;
  border-bottom: 1px solid $borderColor;
  box-sizing: border-box;
  padding: 15rpx;

  .icon-sousuo {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 50rpx;
    height: 50rpx;
  }
  .search-title {
    @include ellipsis(620rpx);
    font-size: 32rpx;
  }
}
</style>
