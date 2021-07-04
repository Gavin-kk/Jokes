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

  private momentList: IMoment[] = [
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '张三',
      title: '如何用手账改变你的一生?',
      avatar: '/static/demo/userpic/1.jpg',
      playCount: 1234,
      totalTime: 13451,
      privateMessageCount: 200,
      likeCount: 200,
      dontLikeCount: 200512344,
      shareCount: 200,
      fileType: 'image',
      whetherToFollow: 0,
      coverImage: '/static/demo/datapic/1.jpg',
      isLike: 0,
      dislike: 0,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '李四',
      title: '如何用手账改变你的一生?',
      avatar: '/static/demo/userpic/1.jpg',
      playCount: 1234,
      totalTime: 12345646,
      privateMessageCount: 200,
      likeCount: 200,
      dontLikeCount: 200000000,
      shareCount: 200,
      fileType: 'video',
      whetherToFollow: 1,
      coverImage: '/static/demo/datapic/2.jpg',
      isLike: 0,
      dislike: 1,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '赵刘',
      title: '如何用手账改变你的一生?',
      avatar: '/static/demo/userpic/1.jpg',
      playCount: 1234,
      totalTime: 0,
      privateMessageCount: 200,
      likeCount: 200,
      dontLikeCount: 200000000,
      shareCount: 200,
      fileType: 'image',
      whetherToFollow: 1,
      coverImage: '/static/demo/datapic/3.jpg',
      isLike: 1,
      dislike: 0,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '是否',
      title: '如何用手账改变你的一生?',
      avatar: '/static/demo/userpic/1.jpg',
      playCount: 1234,
      totalTime: 0,
      privateMessageCount: 200,
      likeCount: 200,
      dontLikeCount: 200000000,
      shareCount: 200,
      fileType: 'image',
      whetherToFollow: 1,
      coverImage: '/static/demo/datapic/3.jpg',
      isLike: 1,
      dislike: 0,
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
  private newList: { list: IMoment[]; loadingText: string; id: number }[] = this.list.map(() => ({
    id: Math.random() * 1000 + 1,
    list: this.momentList,
    loadingText: '上拉加载更多',
  }));
}
</script>

<style lang="scss" scoped></style>
