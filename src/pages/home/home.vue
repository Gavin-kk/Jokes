<template>
  <view class="home">
    <!--    <z-paging ref="paging" :fixed="true" refresher-enabled use-custom-refresher       refresher-only @onRefresh="onRefresh">-->
    <z-paging ref="paging" refresher-only :refresher-enabled="false" :scrollable="false">
      <view slot="top">
        <!-- #ifdef MP-WEIXIN-->
        <news-nav-bar class="news-nav-bar-height" :rightIsShow="false" is-status-bar-show>
          <view slot="default" class="search-box" style="width: 100%; margin-left: -20%" @tap="navSearch">
            <view class="search-home iconfont icon-sousuo">
              <text class="text-search">搜索</text>
            </view>
          </view>
        </news-nav-bar>
        <!-- #endif   -->
        <home-top-bar
          :list="classifyArticleList"
          :activeIndex="currentSwiperIndex"
          @currentSwiperIndexChange="swiperIndexChange"
        />
      </view>

      <template v-if="isShowList">
        <sliding-list
          :list.sync="classifyArticleList"
          :activeIndex="currentSwiperIndex"
          @currentSwiperIndexChange="swiperIndexChange"
          @scrolltolowerEvent="scrolltolowerEvent"
        />
      </template>
    </z-paging>
    <!-- #ifdef MP-WEIXIN-->
    <post-an-article-btn @tap="postAnArticle" />
    <!-- #endif-->
  </view>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import HomeTopBar from '@components/home-topbar/home-topbar.vue';
import slidingList from '@components/sliding-list/sliding-list.vue';
import { namespace } from 'vuex-class';
import moment from 'moment';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import { getClassifyAllArticleRequest } from '@services/home.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { ArticleTypeEnum } from '@pages/release/release.vue';
import NewsNavBar from '@components/news/news-nav-bar.vue';
import PostAnArticleBtn from '@components/post-an-article-btn/post-an-article-btn.vue';
import UniSearchBar from '@components/uni-search-bar/uni-search-bar.vue';
import Search from '@pages/search/search.vue';
import MSearch from '@components/search/m-search.vue';
import { ARTICLE_CLASSIFICATION } from '@common/constant/storage.constant';
import ZPaging from '@components/z-paging/z-paging.vue';

import { HomeStoreActionType } from './store/constant';
import { IArticle, IClassify } from './store';

export interface IClassifyArticleList extends IClassify {
  articleList: IArticle[];
  loadingText: LoadingStatus;
  pageNum: number;
}

moment.locale('zh-cn');
const HomeModule = namespace('homeModule');

let timer: number | undefined;
@Component({
  components: { MSearch, ZPaging, Search, UniSearchBar, PostAnArticleBtn, NewsNavBar, HomeTopBar, slidingList },
})
export default class Home extends Vue {
  @HomeModule.State('classifyList')
  private readonly classifyList!: IClassify[];
  @HomeModule.Action(HomeStoreActionType.GET_ALL_ARTICLE_CATEGORIES)
  private readonly getAllArticleCategories!: () => Promise<void>;
  @HomeModule.Mutation(HomeStoreActionType.CHANGE_ALL_ARTICLE_CATEGORIES)
  private readonly changeArticleClassify!: (payload: IClassify[]) => void;

  private currentSwiperIndex: number = 0;
  private classifyArticleList: IClassifyArticleList[] = [];

  get isShowList(): boolean {
    return !!this.classifyArticleList.length;
  }

  @Watch('classifyList')
  async watchClassifyList(classifyList: IClassify[]) {
    this.classifyArticleList = classifyList.map((item) => ({
      ...item,
      articleList: [],
      loadingText: LoadingStatus.load,
      pageNum: 1,
    }));
    const getData = async () => {
      await this.getData();
      await this.getData(this.currentSwiperIndex + 1);
    };
    if (typeof timer === 'undefined') {
      timer = setTimeout(getData, 200);
    } else {
      clearTimeout(timer);
      timer = setTimeout(getData, 200);
    }
  }

  created() {
    this.getCache();
    this.getAllArticleCategories();
  }
  // 获取文章分类缓存
  getCache() {
    uni.getStorage({
      key: ARTICLE_CLASSIFICATION,
      success: (res) => {
        this.changeArticleClassify(res.data);
      },
    });
  }

  // 请求数据
  async getData(index: number = 0): Promise<boolean> {
    if (!this.classifyArticleList[index]) return false;
    const result: AxiosResponse<IResponse<IArticle[]>> = await getClassifyAllArticleRequest(
      this.classifyArticleList[index].pageNum,
      this.classifyArticleList[index].id,
    );
    if (!result.data.data.length) {
      return false;
    }
    this.classifyArticleList[index].articleList.push(...result.data.data);
    return true;
  }

  // 滚动到列表最下方触发的事件
  async scrolltolowerEvent(index: number) {
    if (this.classifyArticleList[index].loadingText !== LoadingStatus.load) return;
    this.classifyArticleList[index].loadingText = LoadingStatus.loading;
    this.classifyArticleList[index].pageNum++;
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
  // #ifdef MP-WEIXIN
  navSearch() {
    uni.navigateTo({
      url: '../search/search',
    });
  }
  //  #endif

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

  postAnArticle() {
    // #ifdef MP-WEIXIN
    uni.navigateTo({
      url: `/pages/release/release?type=${ArticleTypeEnum.article}`,
    });
    //  #endif
  }

  async swiperIndexChange(index: number) {
    this.currentSwiperIndex = index;
    if (this.classifyArticleList[index].articleList.length === 0) {
      //  请求相应页面数据
      this.getData(index);
    }
    if (this.classifyArticleList[index + 1] && this.classifyArticleList[index + 1].articleList.length === 0) {
      this.getData(index + 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  .search-home {
    display: flex;
    align-items: center;
    color: #959595;
    box-sizing: border-box;
    width: 100%;
    background: #f4f4f4;
    height: 60rpx;
    border-radius: 20rpx;
    .text-search {
      margin-left: 20rpx;
    }
  }
  .icon-sousuo {
    padding-left: 20rpx;
  }
}
</style>
