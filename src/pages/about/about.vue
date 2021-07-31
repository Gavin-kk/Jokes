<template>
  <view>
    <nav-bar title="关于" page-path="/pages/settings/settings" />
    <view class="box">
      <!--    logo-->
      <view class="logo">
        <view class="logo-text">嘻嘻哈哈</view>
      </view>
      <!--    版本-->
      <view class="version">version:{{ version }}</view>
      <!--    列表-->
      <view class="list-box">
        <item-list :list="list" @clickListEvent="itemListClickEvent" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import ItemList, { IItemList } from '@components/list/item-list.vue';

@Component({ components: { NavBar, ItemList } })
export default class About extends Vue {
  private version: string = '1.0.0';

  private list: IItemList[] = [{ text: '新版本检测' }, { text: '用户协议' }];

  itemListClickEvent(item: IItemList) {}
}
</script>

<style lang="scss" scoped>
.box {
  box-sizing: border-box;
  padding: 0 20rpx;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300rpx;
  .logo-text {
    font-size: 80rpx;
    color: #ffa015;
  }
}

.version {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35rpx;
  color: #d4d4d4;
  font-size: 28rpx;
}

.list-box {
  margin-top: 40rpx;
}
</style>
