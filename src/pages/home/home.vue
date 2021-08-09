<template>
  <view class="home">
    <home-top-bar
      :list="classifyArticleList"
      :activeIndex="currentSwiperIndex"
      @currentSwiperIndexChange="swiperIndexChange"
    />
    <template v-if="isShowList">
      <sliding-list
        :list.sync="classifyArticleList"
        :activeIndex="currentSwiperIndex"
        @currentSwiperIndexChange="swiperIndexChange"
        @scrolltolowerEvent="scrolltolowerEvent"
      />
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import HomeTopBar from '@components/home-topbar/home-topbar.vue';
import slidingList from '@components/sliding-list/sliding-list.vue';
import { namespace } from 'vuex-class';
import { ModuleConstant } from '@store/module.constant';
import moment from 'moment';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import { getClassifyAllArticleRequest } from '@services/home.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import lodash from 'lodash';
import { ArticleTypeEnum } from '@pages/release/release.vue';
import { HomeStoreActionType } from './store/constant';
import { IArticle, IClassify } from './store';

export interface IClassifyArticleList extends IClassify {
  articleList: IArticle[];
  loadingText: LoadingStatus;
  pageNum: number;
}

moment.locale('zh-cn');
const HomeModule = namespace('homeModule');

@Component({
  components: { HomeTopBar, slidingList },
})
export default class Home extends Vue {
  @HomeModule.State('classifyList')
  private readonly classifyList!: IClassify[];

  private currentSwiperIndex: number = 0;
  private classifyArticleList: IClassifyArticleList[] = [];

  get isShowList(): boolean {
    return !!this.classifyArticleList.length;
  }

  @Watch('currentSwiperIndex')
  async watchCurrentSwiperIndex(newIndex: number) {
    if (lodash.isEmpty(this.classifyArticleList[newIndex].articleList)) {
      //  请求相应页面数据
      const result: AxiosResponse<IResponse<IArticle[]>> = await getClassifyAllArticleRequest(
        this.classifyArticleList[newIndex].pageNum,
        this.classifyList[newIndex].id,
      );
      this.classifyArticleList[newIndex].articleList = result.data.data;
    }
  }

  @Watch('classifyList')
  async watchClassifyList(classifyList: IClassify[]) {
    this.classifyArticleList = classifyList.map((item) => ({
      ...item,
      articleList: [],
      loadingText: LoadingStatus.load,
      pageNum: 1,
    }));
    await this.getData();
  }

  created() {
    this.$store.dispatch(`${ModuleConstant.homeModule}/${HomeStoreActionType.GET_ALL_ARTICLE_CATEGORIES}`);
  }

  // 请求数据
  async getData(index: number = 0): Promise<boolean> {
    const result: AxiosResponse<IResponse<IArticle[]>> = await getClassifyAllArticleRequest(
      this.classifyArticleList[index].pageNum,
      this.classifyArticleList[index].id,
    );
    if (!result.data.data.length) return false;
    this.classifyArticleList[index].articleList.push(...result.data.data);
    return true;
  }

  // 滚动到列表最下方触发的事件
  async scrolltolowerEvent(index: number) {
    if (this.classifyArticleList[index].loadingText !== LoadingStatus.load) return;
    this.classifyArticleList[index].loadingText = LoadingStatus.loading;
    this.classifyArticleList[index].pageNum += 1;
    //  请求数据
    const result: boolean = await this.getData(index);
    if (!result) {
      this.classifyArticleList[index].loadingText = LoadingStatus.air;
      return;
    }
    this.classifyArticleList[index].loadingText = LoadingStatus.load;
  }

  // 搜索框点击监听事件
  onNavigationBarSearchInputClicked() {
    uni.navigateTo({
      url: '../search/search',
    });
  }
  // 原生顶栏按钮点击监听事件
  onNavigationBarButtonTap(e: INavigationBarButtonTapEvent) {
    if (e.index === 0) {
      uni.showToast({
        title: '签到成功 经验+3',
      });
    } else if (e.index === 1) {
      uni.navigateTo({
        url: `../release/release?type=${ArticleTypeEnum.article}`,
      });
    }
  }

  swiperIndexChange(index: number) {
    this.currentSwiperIndex = index;
  }
}
</script>

<style lang="scss" scoped></style>
