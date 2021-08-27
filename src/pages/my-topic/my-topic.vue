<template>
  <view>
    <!--#ifndef MP-WEIXIN-->
    <nav-bar title="我的话题" page-path="/pages/mine/mine"></nav-bar>
    <!--#endif    -->
    <block v-for="item in topicArticleList" :key="item.id">
      <moment-list :data="item"></moment-list>
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
import { Vue, Component, Mixins } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import { IArticle } from '@pages/mine/store';
import MomentList from '@components/moment-list/moment-list.vue';
import { getAllUserTopicArticleListRequest } from '@services/article.request';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import Empty from '@components/empty/empty.vue';

@Component({
  components: { Empty, PullUpLoading, MomentList, NavBar },
})
export default class MyTopic extends Mixins(CheckLoginMixin) {
  private topicArticleList: IArticle[] = [];
  private pageNum: number = 1;
  private loadingText: LoadingStatus = LoadingStatus.load;

  get isEmpty(): boolean {
    return this.topicArticleList.length === 0;
  }

  created() {
    //  获取话题文章
    this.getData();
  }

  async getData(): Promise<boolean> {
    const result: AxiosResponse<IResponse<IArticle[]>> = await getAllUserTopicArticleListRequest(this.pageNum);
    this.topicArticleList.push(...result.data.data);
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
