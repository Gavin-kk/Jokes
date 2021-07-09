<template>
  <view class="home">
    <home-top-bar :list="list" :activeIndex="currentSwiperIndex" @currentSwiperIndexChange="swiperIndexChange" />
    <sliding-list
      v-if="newList.length"
      :list="newList"
      :activeIndex="currentSwiperIndex"
      @currentSwiperIndexChange="swiperIndexChange"
    />
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HomeTopBar from '@components/home-topbar/home-topbar.vue';
import slidingList from '@components/sliding-list/sliding-list.vue';
import { namespace } from 'vuex-class';
import { ActionTypes } from '@store/module/system';
import { ModuleConstant } from '@store/module.constant';
import { IMomentList } from '@components/moment-list/moment-list';
import moment from 'moment';

moment.locale('zh-cn');
const SystemModule = namespace('systemModule');

@Component({
  components: { HomeTopBar, slidingList },
})
export default class Home extends Vue {
  @SystemModule.State('systemInfo') systemInfo!: SystemInfo;

  private currentSwiperIndex: number = 0;

  created(): void {
    this.$store.dispatch(`${ModuleConstant.systemModule}/${ActionTypes.GET_SYSTEM_INFO}`);
  }
  // 搜索框点击监听事件
  onNavigationBarSearchInputClicked(): void {
    uni.navigateTo({
      url: '../search/search',
    });
  }
  // 原生顶栏按钮点击监听事件
  onNavigationBarButtonTap(e: INavigationBarButtonTapEvent): void {
    if (e.index === 0) {
      uni.showToast({
        title: '签到成功 经验+3',
      });
    } else if (e.index === 1) {
      uni.navigateTo({
        url: '../release/release',
      });
    }
  }

  swiperIndexChange(index: number): void {
    this.currentSwiperIndex = index;
  }

  private momentList: IMomentList[] = [
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '张三',
      content: '如何用手账改变你的一生?',
      gender: 0,
      age: 18,
      address: '上海',
      avatar: '/static/demo/userpic/1.jpg',
      video: {
        playCount: 1234,
        totalTime: '13451',
      },
      share: null,
      commentCount: 200,
      likeCount: 200,
      dontLikeCount: 200512344,
      forwardCount: 200,
      isFollow: 0,
      momentPic: '/static/demo/datapic/1.jpg',
      isLike: 0,
      dislike: 0,
      createAt: moment(new Date().getTime() - 1000 * 60 * 60 * 12)
        .startOf('day')
        .fromNow(),
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: 'asdf',
      content: '如何用手账改变你的一生?',
      gender: 0,
      age: 18,
      address: '上海',
      avatar: '/static/demo/userpic/1.jpg',
      video: null,
      share: null,
      commentCount: 200,
      likeCount: 200,
      dontLikeCount: 200512344,
      forwardCount: 200,
      isFollow: 0,
      momentPic: '/static/demo/datapic/1.jpg',
      isLike: 0,
      dislike: 0,
      createAt: moment(new Date().getTime() - 1000 * 60 * 60 * 12).format('L'),
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '瓦岗山',
      content: '如何用手账改变你的一生?',
      gender: 0,
      age: 18,
      address: '上海',
      avatar: '/static/demo/userpic/1.jpg',
      video: {
        playCount: 1234,
        totalTime: '13451',
      },
      share: null,
      commentCount: 200,
      likeCount: 200,
      dontLikeCount: 200512344,
      forwardCount: 200,
      isFollow: 0,
      momentPic: '/static/demo/datapic/1.jpg',
      isLike: 0,
      dislike: 0,
      createAt: moment(new Date().getTime() - 1000 * 60 * 60 * 12).format('L'),
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '访问',
      content: '如何用手账改变你的一生?',
      gender: 0,
      age: 18,
      address: '上海',
      avatar: '/static/demo/userpic/1.jpg',
      video: {
        playCount: 1234,
        totalTime: '13451',
      },
      share: null,
      commentCount: 200,
      likeCount: 200,
      dontLikeCount: 200512344,
      forwardCount: 200,
      isFollow: 0,
      momentPic: '/static/demo/datapic/1.jpg',
      isLike: 0,
      dislike: 0,
      createAt: moment(new Date().getTime() - 1000 * 60 * 60 * 12).format('L'),
    },
  ];

  private list: { id: number; title: string }[] = [
    {
      id: 1,
      title: '关注',
    },
    {
      id: 2,
      title: '推荐',
    },
    {
      id: 3,
      title: '关注',
    },
    {
      id: 4,
      title: '关注',
    },
    {
      id: 5,
      title: '关注',
    },
    {
      id: 6,
      title: '关注',
    },
    {
      id: 7,
      title: '关注',
    },
    {
      id: 8,
      title: '关注',
    },
    {
      id: 9,
      title: '关注',
    },
    {
      id: 10,
      title: '喜欢',
    },
  ];
  private newList: { list: IMomentList[]; loadingText: string; id: number }[] = this.list.map(() => ({
    id: Math.random() * 1000 + 1,
    list: this.momentList,
    loadingText: '上拉加载更多',
  }));
}
</script>

<style lang="scss" scoped></style>
