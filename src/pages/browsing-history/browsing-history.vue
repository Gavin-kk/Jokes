<template>
  <view>
    <!--#ifndef MP-WEIXIN-->
    <nav-bar title="历史记录" page-path="/pages/mine/mine"></nav-bar>
    <!--#endif    -->
    <block v-for="item in articleList" :key="item.id">
      <dynamic :moment-data="item" />
    </block>
  </view>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BROWSING_HISTORY_ARTICLE } from '@common/constant/storage.constant';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { IArticle } from '@pages/mine/store';
import Dynamic from '@components/dynamic/dynamic.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';

const UserModule = namespace('userModule');
@Component({
  components: { NavBar, Dynamic },
})
export default class BrowsingHistory extends Mixins(CheckLoginMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private articleList: IArticle[] = [];

  get articleListIsExists(): boolean {
    return this.articleList.length > 0;
  }

  created() {
    //  获取历史记录
    this.getHistory();
  }

  onShow() {
    this.getHistory();
  }

  getHistory() {
    // 文章历史记录
    uni.getStorage({
      key: BROWSING_HISTORY_ARTICLE(this.userInfo.id),
      success: ({ data }: { data: IArticle[] }) => {
        this.articleList = data;
      },
    });
  }
}
</script>

<style lang="scss" scoped></style>
