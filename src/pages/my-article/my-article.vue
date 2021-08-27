<template>
  <view>
    <!--#ifndef MP-WEIXIN-->
    <nav-bar title="我的文章" page-path="/pages/mine/mine"></nav-bar>
    <!--#endif    -->
    <block v-for="item in articleList" :key="item.id">
      <dynamic :moment-data="item"></dynamic>
    </block>
    <template v-if="isEmpty">
      <empty />
    </template>
    <template v-else>
      <pull-up-loading :text="loadingText"></pull-up-loading>
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import { IArticle } from '@pages/mine/store';
import { getAllUserPersonalArticleListRequest } from '@services/article.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import Dynamic from '@components/dynamic/dynamic.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import Empty from '@components/empty/empty.vue';

@Component({
  components: { Empty, PullUpLoading, Dynamic, NavBar },
})
export default class MyArticle extends Mixins(CheckLoginMixin) {
  private articleList: IArticle[] = [];
  private pageNum: number = 1;
  private loadingText: LoadingStatus = LoadingStatus.load;

  get isEmpty() {
    return this.articleList.length === 0;
  }

  created() {
    this.getData();
  }

  async getData(): Promise<boolean> {
    const result: AxiosResponse<IResponse<IArticle[]>> = await getAllUserPersonalArticleListRequest(this.pageNum);
    this.articleList.push(...result.data.data);
    return result.data.data.length !== 0;
  }

  async onReachBottom() {
    if (this.loadingText !== LoadingStatus.load) return;
    this.pageNum++;
    this.loadingText = LoadingStatus.loading;
    const bool: boolean = await this.getData();
    bool ? (this.loadingText = LoadingStatus.load) : (this.loadingText = LoadingStatus.air);
  }
}
</script>

<style lang="scss" scoped></style>
