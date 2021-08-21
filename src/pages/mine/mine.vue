<template>
  <view>
    <!--#ifndef MP-WEIXIN-->
    <!--     导航栏-->
    <uni-nav-bar status-bar :border="false">
      <view slot="default" class="title-center">我</view>
      <view slot="right" class="iconfont icon-gengduo1" @tap="openSettings"></view>
    </uni-nav-bar>
    <!--#endif-->
    <!--#ifdef MP-WEIXIN-->
    <!--#endif-->
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
import { ArticleStoreActionType } from './store/constant';

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

  get sectionList(): { count: number; text: string; url: string }[] {
    const countKeys: string[] = Object.keys(this.countObj);
    const list: { text: string; url: string }[] = [
      { text: '文章', url: '/pages/my-article/my-article' },
      { text: '话题', url: '/pages/my-topic/my-topic' },
      { text: '关注', url: '/pages/my-follow/my-follow' },
      { text: '粉丝', url: '/pages/my-fans/my-fans' },
    ];
    return countKeys.map((item: string, index: number) => ({
      count: this.countObj[item],
      text: list[index].text,
      url: list[index].url,
    }));
  }
  // 列表数据
  private list: IItemList[] = [
    {
      iconfontClass: 'icon-liulan',
      text: '浏览历史',
      color: '#68c1ff',
      url: '/pages/browsing-history/browsing-history',
    },
  ];

  created() {
    //  #ifdef MP_WEIXIN
    this.list.push({
      iconfontClass: 'icon-shezhi',
      text: '设置',
      url: '/pages/settings/settings',
    });
    //  #endif
  }

  // 打开设置
  openSettings() {
    uni.navigateTo({
      url: '/pages/settings/settings',
    });
  }

  // 点击列表
  clickListEvent(item: IItemList) {
    uni.navigateTo({ url: item.url! });
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
