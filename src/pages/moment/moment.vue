<template>
  <view>
    <!-- #ifdef MP-WEIXIN-->
    <news-nav-bar
      class="news-nav-bar-height"
      :nav-list="navList"
      :currentIndex="currentIndex"
      @change="navSelectedChange"
      @leftClick="signIn"
      @rightClick="openPublished"
      is-status-bar-show
      :right-is-show="false"
    ></news-nav-bar>
    <!--  #endif-->
    <!-- #ifndef MP-WEIXIN-->
    <news-nav-bar
      class="news-nav-bar-height"
      :nav-list="navList"
      :currentIndex="currentIndex"
      @change="navSelectedChange"
      @leftClick="signIn"
      @rightClick="openPublished"
    ></news-nav-bar>
    <!--#endif-->
    <!--   列表组件-->
    <swiper :current="currentIndex" @change="swiperChange" :style="{ height: windowHeight }">
      <swiper-item :style="{ height: windowHeight }">
        <z-paging
          ref="paging"
          :fixed="false"
          refresher-only
          @onRefresh="query"
          @scrolltolower="bottomOut"
          :safe-area-inset-bottom="true"
          :delay="1000"
        >
          <!--        <scroll-view scroll-y @scrolltolower="bottomOut" :style="{ height: windowHeight }">-->
          <block v-for="item in followArticleList" :key="item.id">
            <moment-list :data="item"></moment-list>
          </block>
          <pull-up-loading :text="pullMsg" />
          <!--        </scroll-view>-->
        </z-paging>
      </swiper-item>
      <swiper-item :style="{ height: windowHeight }">
        <z-paging
          ref="paginga"
          :fixed="false"
          refresher-only
          @onRefresh="refrechTopic"
          :safe-area-inset-bottom="true"
          :delay="1000"
        >
          <!--        <scroll-view scroll-y :style="{ height: windowHeight }">-->
          <!--          话题页面-->
          <topic />
          <!--        </scroll-view>-->
        </z-paging>
      </swiper-item>
    </swiper>
    <!-- #ifdef MP-WEIXIN-->
    <post-an-article-btn @tap="openPublished" />
    <!-- #endif-->
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MomentList from '@components/moment-list/moment-list.vue';
import NewsNavBar from '@components/news/news-nav-bar.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import Topic from '@components/topic/topic.vue';
import { namespace } from 'vuex-class';
import { IArticle } from '@pages/home/store';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import PostAnArticleBtn from '@components/post-an-article-btn/post-an-article-btn.vue';
import ZPaging from '@components/z-paging/z-paging.vue';

const MomentModule = namespace('momentModule');
@Component({ components: { ZPaging, PostAnArticleBtn, Topic, PullUpLoading, MomentList, NewsNavBar } })
export default class Moment extends Vue {
  @MomentModule.State('followArticleList')
  private readonly followArticleList!: IArticle[];
  @MomentModule.Action(MomentStoreActionType.GET_USER_ARTICLES_FOLLOWED_BY_USERS)
  private readonly getUserArticlesFollowedByUsers!: (n: number) => Promise<boolean>;
  @MomentModule.Action(MomentStoreActionType.GET_ALL_TOPIC_CATEGORIES)
  private readonly getAllTopicCategories!: () => Promise<void>;
  @MomentModule.Action(MomentStoreActionType.GET_TRENDING_TOPIC)
  private readonly getHotTopic!: () => Promise<void>;
  // 关注列表的页码
  private followPageNum: number = 1;
  // 关注页面的下拉文本
  private pullMsg: LoadingStatus = LoadingStatus.load;
  // navlist 数据
  private navList: string[] = ['关注', '话题'];
  // 当前所在navlist的索引
  private currentIndex: number = 0;
  // 窗口总高度
  private totalHeight: number | null = null;
  // topbar 的高度
  private topNavBarHeight: number = 0;

  created() {
    uni.getSystemInfo({
      success: (info: SystemInfo) => {
        this.totalHeight = info.windowHeight;
      },
    });
    // 获取用户关注的文章
    this.getUserArticlesFollowedByUsers(this.followPageNum);
  }

  mounted() {
    const topBar = uni.createSelectorQuery().select('.news-nav-bar-height');
    topBar
      .boundingClientRect((e?) => {
        if (e?.height) {
          this.topNavBarHeight = e.height;
        }
      })
      .exec();
  }

  query() {
    this.followPageNum = 1;
    // 获取用户关注的文章
    this.getUserArticlesFollowedByUsers(this.followPageNum);
    (this.$refs.paging as any).complete();
  }

  // 刷新topic页面
  async refrechTopic() {
    try {
      await this.getAllTopicCategories();
      await this.getHotTopic();
      (this.$refs.paginga as any).complete();
    } catch (err) {
      uni.showToast({ title: '网络错误', icon: 'none' });
    }
  }

  // 打开发布页面
  openPublished() {
    uni.navigateTo({
      url: '/pages/release/release',
    });
  }
  // 签到事件
  signIn() {
    uni.showToast({ title: '签到成功,经验+3' });
  }

  navSelectedChange({ index }: { item: string; index: number }) {
    this.currentIndex = index;
  }

  swiperChange({ detail: { current } }: { detail: { current: number } }) {
    this.currentIndex = current;
  }

  // 页面触底
  async bottomOut() {
    this.pullMsg = LoadingStatus.loading;
    this.followPageNum++;
    const isExists: boolean = await this.getUserArticlesFollowedByUsers(this.followPageNum);
    isExists ? (this.pullMsg = LoadingStatus.load) : (this.pullMsg = LoadingStatus.air);
  }

  get windowHeight(): string {
    return `${this.totalHeight! - this.topNavBarHeight}px`;
  }
}
</script>

<style lang="scss">
.news-nav-bar-height {
  border-bottom: 1px solid #e9e8e8;
}
</style>
