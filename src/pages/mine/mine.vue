<template>
  <view>
    <!--     导航栏-->
    <uni-nav-bar status-bar :border="false">
      <view slot="default" class="title-center">我</view>
      <view slot="right" class="iconfont icon-gengduo1" @tap="openSettings"></view>
    </uni-nav-bar>
    <view class="root-box">
      <!--    登录方式-->
      <template v-if="!isLogin">
        <login-methods />
      </template>
      <template v-else>
        <user :data="userinfo" />
      </template>
      <!--    各种计数-->
      <section-list :sectionList="sectionList" />
      <!--  列表-->
      <view class="list">
        <item-list :list="list" @clickListEvent="clickListEvent" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ItemList, { IItemList } from '@components/list/item-list.vue';
import LoginMethods from '@pages/mine/components/login-methods/login-methods.vue';
import User from '@pages/mine/components/user/user.vue';
import MSearch from '@components/search/m-search.vue';
import SectionList from '@pages/mine/components/section-list/section-list.vue';
import { namespace } from 'vuex-class';
import { ModuleConstant } from '@store/module.constant';
import { UserStoreActionType } from '@store/module/user/constant';
import { ICount, IUser } from '@store/module/user';

const UserModule = namespace('userModule');

@Component({ components: { SectionList, MSearch, User, LoginMethods, ItemList, UniNavBar } })
export default class Mine extends Vue {
  // 是否登录
  @UserModule.State('isLogin')
  private readonly isLogin!: boolean;
  @UserModule.State('userInfo')
  private readonly userinfo!: IUser;
  @UserModule.State('count')
  private readonly countObj!: ICount;

  created() {
    // uni.getStorage({
    //   key: '_token',
    //   success: ({ data: token }: { data: string }) => {
    //     if (token) {
    //       // 如果token 存在则向服务端请求用户的信息
    //       this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.GET_USER_INFO}`);
    //     }
    //   },
    // });
  }

  get sectionList(): { count: number; text: string }[] {
    const countKeys: string[] = Object.keys(this.countObj);
    const list: string[] = ['文章', '话题', '评论', '收藏'];
    return countKeys.map((item: string, index: number) => ({ count: this.countObj[item], text: list[index] }));
  }
  // 列表数据
  private list: IItemList[] = [
    { iconfontClass: 'icon-liulan', text: '浏览历史', color: '#68c1ff' },
    { iconfontClass: 'icon-huiyuanvip', text: '认证', color: '#ff7332' },
    { iconfontClass: 'icon-icon_im_keyboard', text: '陪审团', color: '#7ccaff' },
  ];
  // // 用户数据
  // private userinfo: IUserinfo = {
  //   username: '张三',
  //   totalVisitors: 200,
  //   todayVisitor: 100,
  // };

  // 打开设置
  openSettings() {
    uni.navigateTo({
      url: '/pages/settings/settings',
    });
    uni.showToast({ title: '打开个人设置' });
  }

  // 点击列表
  clickListEvent(item: IItemList) {
    uni.showToast({ title: `${item.text}进入` });
  }
}
</script>

<style lang="scss" scoped>
.root-box {
  box-sizing: border-box;
  padding: 0 20rpx;
}

.title-center {
  @include centered;
  width: 100%;
}

.icon-gengduo1 {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 40rpx;
  padding: 0;
}
</style>
