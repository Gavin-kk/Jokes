<template>
  <view class="topic-search-box">
    <input
      type="text"
      :class="['topic-search']"
      v-model="searchValue"
      :placeholder="searchInputFocus"
      :placeholder-class="placeholderClass"
      @confirm="confirm"
      @blur="searchBlur"
      @focus="searchFocus"
    />
    <view :class="['iconfont', { 'icon-guanbi': searchIsFocus }]" @tap="clearSearchInput"></view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class MSearch extends Vue {
  // 搜索框输入的内容
  private searchValue: string = '';
  // 搜索框是否聚焦
  private searchIsFocus: boolean = false;
  // 搜索框聚焦方法
  searchFocus() {
    this.searchIsFocus = true;
  }
  // 失焦方法
  searchBlur({ detail }: { detail: { value: string } }) {
    if (!detail.value) {
      this.searchIsFocus = false;
    }
  }
  // 清除搜索框内文本
  clearSearchInput() {
    this.searchValue = '';
    this.searchIsFocus = false;
    this.$emit('clear');
  }

  // 提交搜索
  confirm() {
    this.$emit('confirm', this.searchValue);
  }

  get searchInputFocus(): string {
    return this.searchIsFocus ? '' : '搜索内容';
  }
  get placeholderClass(): string {
    return this.searchIsFocus ? '' : 'iconfont icon-sousuo';
  }
}
</script>

<style lang="scss" scoped>
.topic-search-box {
  position: relative;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .topic-search {
    flex: 1;
    display: inline-block;
    height: 65rpx;
    background: #f4f4f4;
    padding: 0 10rpx;
    border-radius: 20rpx;
  }
  .icon-sousuo {
    font-size: 28rpx;
    text-align: center;
    margin-left: 20rpx;
  }
  .icon-guanbi {
    position: absolute;
    right: 20rpx;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20rpx;
  }
}
</style>
