<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="设置" page-path="/pages/mine/mine" />
    <view class="box">
      <item-list :list="list" @clickListEvent="itemListClickEvent" />
      <!--  退出登录-->
      <view class="logout-box">
        <view class="logout-btn" @tap="signOutRequest">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ItemList, { IItemList } from '@components/list/item-list.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import { signOutRequest } from '@src/services/common.request';
import { ModuleConstant } from '@store/module.constant';
import { UserStoreActionType } from '@store/module/user/constant';
import { TOKEN_KEY } from '@common/constant/storage.constant';
import { IFollowEventPayload } from '@components/dynamic/dynamic.vue';

@Component({ components: { NavBar, ItemList } })
export default class Settings extends Vue {
  private list: IItemList[] = [
    { text: '账号与安全', method: 'nav', url: '/pages/edit-password/edit-password' },
    { text: '绑定邮箱', method: 'nav', url: '/pages/bind-email/bind-email' },
    { text: '资料编辑', method: 'nav', url: '/pages/edit-material/edit-material' },
    { text: '清除缓存', method: 'clear' },
    { text: '意见反馈', method: 'nav', url: '/pages/feedback/feedback' },
  ];

  created() {
    //  #ifdef APP-PLUS
    this.list.push({ text: '关于嘻嘻哈哈', method: 'nav', url: '/pages/about/about' });
    //  #endif
  }

  // 退出登录
  async signOutRequest() {
    uni.showModal({
      title: '确定退出吗',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 发送退出请求
            await signOutRequest();
            // eslint-disable-next-line no-empty
          } catch (e) {}
          uni.removeStorageSync(TOKEN_KEY);
          // 初始化vuex中的数据
          await this.$store.commit(`${ModuleConstant.userModule}/${UserStoreActionType.INIT}`);
          // 关闭websocket连接
          uni.$emit('closeSocket');
          uni.$emit('follow', { clear: true } as IFollowEventPayload);
          // 导航到用户主页
          uni.switchTab({ url: '/pages/mine/mine' });
        }
      },
    });
  }

  // 列表点击事件
  itemListClickEvent(item: IItemList) {
    if (item.method === 'nav' && item.url) {
      uni.navigateTo({ url: item.url });
    }
    if (item.method === 'clear') {
      this.clearCache();
    }
  }
  // 清除缓存
  clearCache() {
    uni.showModal({
      title: '提示',
      content: '是否清除缓存',
      cancelText: '取消',
      confirmText: '清除',
      success: (res) => {
        if (res.confirm) {
          // 清除本地缓存
          uni.clearStorage();
          uni.showToast({ title: '清除成功' });
        }
      },
    });
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
