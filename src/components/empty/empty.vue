<template>
  <view class="empty-state">
    <image src="/static/empty.png" mode="aspectFit" class="empty-state-img" />
    <view class="empty-state-text">空空如也呀</view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Empty extends Vue {}
</script>

<style lang="scss" scoped>
.empty-state {
  @include centered;
  flex-direction: column;
  width: 100%;
  height: 600rpx;

  .empty-state-img {
    width: 400rpx;
    height: 400rpx;
  }
  .empty-state-text {
    font-size: 40rpx;
  }
}
</style>
