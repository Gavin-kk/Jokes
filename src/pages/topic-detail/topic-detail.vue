<template>
  <view>
    <view id="min-height">
      <!--    背景模糊-->
      <view class="fuzzy">
        <image class="image" :src="topic.pic" mode="aspectFill"></image>
      </view>
      <!--    个人版块-->
      <view class="topic-info">
        <view class="title">
          <view class="title-image-box">
            <image class="title-image" :src="topic.pic" mode="aspectFill"></image>
          </view>
          <view class="title-name">{{ topic.title }}</view>
        </view>
        <view class="topic-count">动态 {{ topic.articleCount }} 今日 {{ topic.todayCount }}</view>
        <view class="desc">{{ topic.desc }}</view>
      </view>

      <!--    tab切换-->
      <home-topbar
        :list="titleNavList"
        :activeIndex="activeIndex"
        itemStyle="width:50%;"
        @currentSwiperIndexChange="currentSwiperIndexChange"
      />
    </view>
    <view>
      <swiper :style="{ height: `${swiperHeight}px` }" @change="swiperChange" :current="activeIndex">
        <block v-for="(item, index) in list" :key="index">
          <swiper-item>
            <view :id="idArr[index]">
              <block v-for="(itex, itexIndex) in item.list" :key="itexIndex">
                <moment-list :data="itex" :topic="topic" />
              </block>
              <pull-up-loading :text="item.loading" v-if="!isShowLoadingText"></pull-up-loading>
            </view>
          </swiper-item>
        </block>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeTopbar from '@components/home-topbar/home-topbar.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import MomentList from '@components/moment-list/moment-list.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { ITopic } from '@pages/moment/store';
import { IArticle } from '@pages/home/store';
import { getTopicArticleListRequest } from '@services/topic.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';

export enum GetTopIcType {
  default,
  latest,
}

@Component({
  components: { PullUpLoading, MomentList, HomeTopbar },
})
export default class TopicDetail extends Vue {
  private topic: ITopic | Record<string, any> = {};
  private activeIndex: number = 0;
  private titleNavList: { id: number; title: string }[] = [
    { id: 1, title: '默认' },
    { id: 2, title: '最新' },
  ];
  // swiper每个的高度
  private swiperHeight: number = 0;
  // swiper每个页面的id
  private idArr: string[] = ['default', 'latest'];
  // 相对于窗口的swiper可用高度 用于设置最小高度
  private minHeight: number = 0;
  private list: {
    loading: LoadingStatus;
    list: IArticle[];
    pageNum: number;
  }[] = [];

  get isShowLoadingText(): boolean {
    return this.list[this.activeIndex].list.length < 10;
  }

  created() {
    this.getPageData();
    //  请求该话题下的文章
    this.getTopicList();
    this.getTopicList(this.activeIndex + 1);
  }

  getPageData() {
    const pages: any = getCurrentPages();
    const {
      options: { data },
    } = pages[pages.length - 1];
    this.topic = JSON.parse(data);
    this.list = this.titleNavList.map(() => ({ loading: LoadingStatus.load, list: [], pageNum: 1 }));
  }

  mounted() {
    this.getMinHeight();
  }

  // 请求该话题下的文章
  async getTopicList(index: number = 0) {
    const result: AxiosResponse<IResponse<any>> = await getTopicArticleListRequest(
      this.list[index].pageNum,
      this.topic.id,
      index,
    );
    if (!result.data.data) {
      this.list[index].loading = LoadingStatus.air;
      return;
    }
    this.list[index].list.push(...result.data.data.articles);
    this.$nextTick(() => {
      this.getHeight(this.idArr[index]);
    });
    this.list[index].loading = LoadingStatus.load;
  }

  // 获取每个容器的高度
  getHeight(id: string) {
    const query = uni.createSelectorQuery().in(this);
    query
      .select(`#${id}`)
      .boundingClientRect((res?) => {
        if (res?.height) {
          if (res.height < this.minHeight) {
            this.swiperHeight = this.minHeight;
          } else {
            this.swiperHeight = res.height;
          }
        }
      })
      .exec();
  }
  // 获取swiper最低高度
  getMinHeight() {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery().in(this);
      query
        .select('#min-height')
        .boundingClientRect((res?) => {
          uni.getSystemInfo({
            success: (ress) => {
              if (res?.height) {
                this.minHeight = ress.windowHeight - res.height;
                resolve(this.minHeight);
              }
            },
          });
        })
        .exec();
    });
  }

  // 监听上拉加载
  onReachBottom() {
    this.bottomOut();
  }

  // 监听下拉刷新
  onPullDownRefresh() {
    this.pullUpToRefresh();
  }

  // 下拉刷新处理函数
  async pullUpToRefresh() {
    this.list = this.titleNavList.map(() => ({ loading: LoadingStatus.load, list: [], pageNum: 1 }));
    await this.getTopicList(this.activeIndex);
    // 取消下拉刷新
    uni.stopPullDownRefresh();
  }

  // 上拉加载处理函数
  async bottomOut() {
    // if (this.list[this.activeIndex].loading !== LoadingStatus.load) return;
    this.list[this.activeIndex].pageNum++;
    this.list[this.activeIndex].loading = LoadingStatus.loading;
    await this.getTopicList(this.activeIndex);
  }

  currentSwiperIndexChange(index: number) {
    this.activeIndex = index;
  }
  async swiperChange({ detail }: { detail: { current: number } }) {
    this.activeIndex = detail.current;
    this.getHeight(this.idArr[detail.current]);
  }
}
</script>

<style lang="scss" scoped>
.root-box {
  padding: 0 20rpx;
}
.fuzzy {
  width: 100%;
  height: 300rpx;

  .image {
    width: 100%;
    height: 100%;
    filter: blur(20px);
  }
}

.topic-info {
  position: relative;
  box-sizing: border-box;
  padding: 0 20rpx;
  width: 100%;
  background: #ffffff;

  .title {
    display: flex;
    height: 110rpx;

    .title-image-box {
      position: relative;
      top: -50%;
      width: 150rpx;
      height: 150rpx;
      overflow: hidden;
      border-radius: 20rpx;
      flex-shrink: 0;

      .title-image {
        width: 100%;
        height: 100%;
      }
    }

    .title-name {
      @include ellipsis(600rpx);
      margin-left: 20rpx;
    }
  }

  .topic-count {
    font-size: 28rpx;
    color: #d1d1d1;
  }

  .desc {
    margin-top: 10rpx;
    font-size: 30rpx;
    color: #b8b8b8;
    line-height: 50rpx;
  }
}
</style>
