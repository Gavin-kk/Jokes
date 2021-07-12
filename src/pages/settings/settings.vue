<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="设置" />
    <view class="box">
      <item-list :list="list" @clickListEvent="itemListClickEvent" />
      <!--  退出登录-->
      <view class="logout-box">
        <view class="logout-btn" @tap="signOut">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ItemList, { IItemList } from '@components/list/item-list.vue';
import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';

@Component({ components: { NavBar, ItemList, UniNavBar } })
export default class Settings extends Vue {
  private list: IItemList[] = [
    { text: '账号与安全', url: '/pages/edit-password/edit-password' },
    { text: '绑定邮箱', url: '/pages/bind-email/bind-email' },
    { text: '资料编辑', url: '/pages/edit-material/edit-material' },
    { text: '小纸条' },
    { text: '清除缓存' },
    { text: '意见反馈', url: '/pages/feedback/feedback' },
    { text: '关于嘻嘻哈哈', url: '/pages/about/about' },
  ];
  // 退出登录
  signOut() {
    // 这里执行退出登录代码
    uni.showToast({ title: '退出登录' });
  }

  // 列表点击事件
  itemListClickEvent(item: IItemList) {
    if (!item.url) return;
    uni.navigateTo({ url: item.url });
  }

  // 返回
  back() {
    uni.navigateBack({ delta: 1 });
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 0 20rpx;
  box-sizing: border-box;
}

.logout-box {
  @include centered;
  width: 100%;
  height: 80rpx;
  box-sizing: border-box;
  padding: 0 60rpx;
  margin: 30rpx 0;

  .logout-btn {
    @include centered;
    width: 100%;
    height: 100%;
    background: #ffe933;
    border-radius: 15rpx;
    font-size: $fontSize;
  }
}
</style>
