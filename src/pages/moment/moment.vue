<template>
  <view>
    <news-nav-bar
      class="news-nav-bar-height"
      :nav-list="navList"
      :currentIndex="currentIndex"
      @change="navSelectedChange"
    ></news-nav-bar>
    <!--   列表组件-->
    <swiper :current="currentIndex" @change="swiperChange" :style="{ height: windowHeight }">
      <swiper-item>
        <scroll-view scroll-y :style="{ height: windowHeight }" @scrolltolower="bottomOut">
          <block v-for="item in momentList" :key="item.id">
            <moment-list :data="item"></moment-list>
          </block>
          <pull-up-loading :text="pullUpLoadingData[0].text" />
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y :style="{ height: windowHeight }">
          <!--          话题页面-->
          <topic />
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { IMomentList } from '@src/components/moment-list/moment-list';
import MomentList from '@components/moment-list/moment-list.vue';
import NewsNavBar from '@components/news/news-nav-bar.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import Topic from '@components/topic/topic.vue';

@Component({ components: { Topic, PullUpLoading, MomentList, NewsNavBar } })
export default class Moment extends Vue {
  // navlist 数据
  private navList: string[] = ['关注', '话题'];
  // 当前所在navlist的索引
  private currentIndex: number = 1;
  // 窗口总高度
  private totalHeight: number | null = null;
  // topbar 的高度
  private topNavBarHeight: number = 0;

  // 上拉加载
  private pullUpLoadingData: { text: LoadingStatus; name: string }[] = this.navList.map((item) => ({
    text: LoadingStatus.load,
    name: item,
  }));

  created() {
    uni.getSystemInfo({
      success: (info: SystemInfo) => {
        this.totalHeight = info.windowHeight;
      },
    });
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

  navSelectedChange({ index }: { item: string; index: number }) {
    this.currentIndex = index;
  }

  swiperChange({ detail: { current } }: { detail: { current: number } }) {
    this.currentIndex = current;
  }

  bottomOut() {
    if (this.pullUpLoadingData[0].text !== LoadingStatus.load) return;
    this.pullUpLoadingData[0].text = LoadingStatus.loading;

    setTimeout(() => {
      this.momentList.push({
        id: +(Math.random() * 1000 + 1).toFixed(),
        username: '4321dsafqwfeasdfqwtqwefsdagwqerewq ',
        gender: 0,
        avatar: '/static/demo/userpic/8.jpg',
        age: 22,
        content:
          '六道快手家常菜，111111111让服务器而且我2222222222222222222222222222222222222222222222222222222222好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
        momentPic: '/static/demo/datapic/2.jpg',
        video: null,
        share: null,
        address: '上海',
        forwardCount: 30,
        commentCount: 30,
        likeCount: 20,
        isLike: 0, // 0未点赞 1点赞
        isFollow: 0, // 是否关注
      });
      this.pullUpLoadingData[0].text = LoadingStatus.load;
    }, 1500);
  }

  get windowHeight(): string {
    return `${this.totalHeight! - this.topNavBarHeight}px`;
  }

  private momentList: IMomentList[] = [
    // 文字数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '名字',
      gender: 1,
      avatar: '/static/demo/userpic/8.jpg',
      age: 22,
      content:
        '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: null,
      video: null,
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 图片数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '4321dsafqwfeasdfqwtqwefsdagwqerewq ',
      gender: 0,
      avatar: '/static/demo/userpic/8.jpg',
      age: 22,
      content:
        '六道快手家常菜，111111111让服务器而且我2222222222222222222222222222222222222222222222222222222222好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: '/static/demo/datapic/2.jpg',
      video: null,
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 视频数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '名字',
      age: 32,
      gender: 0,
      avatar: '/static/demo/userpic/8.jpg',
      content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: '/static/demo/datapic/2.jpg',
      video: {
        playCount: '20w',
        totalTime: '2:40',
      },
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 分享数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      gender: 0,
      age: 42,
      username: '名字',
      avatar: '/static/demo/userpic/8.jpg',
      content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      video: null,
      momentPic: null,
      share: {
        content: '我是标题',
        momentPic: '/static/demo/datapic/2.jpg',
      },
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 1, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
  ];
}
</script>

<style lang="scss">
.news-nav-bar-height {
  border-bottom: 1px solid #e9e8e8;
}
</style>
