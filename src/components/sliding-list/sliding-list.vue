<template>
  <view>
    <view id="top-bar-height"></view>
    <view class="my-uni-tab-bar" v-if="newList.length > 0">
      <swiper class="my-swiper-box" :current="activeIndex" :style="{ height: windowHeight }" @change="swiperChange">
        <swiper-item v-for="(items, index) in newList" :key="items.id" :style="{ height: windowHeight }">
          <template v-if="items.list.length > 0">
            <scroll-view scroll-y class="my-list" @scrolltolower="scrolltolowerEvent(index)">
              <block v-for="item in items.list" :key="item.id">
                <dynamic :moment-data="item" />
              </block>
              <pull-up-loading :text="items.loadingText" />
            </scroll-view>
          </template>
          <template v-else> <empty /> </template>
        </swiper-item>
      </swiper>
    </view>
    <view v-else> <empty /> </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Dynamic from '@components/dynamic/dynamic.vue';
import { namespace } from 'vuex-class';

import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import Empty from '@components/empty/empty.vue';
import { LoadingStatus } from './loading-status';

const SystemModule = namespace('systemModule');
@Component({ components: { Empty, PullUpLoading, Dynamic } })
export default class SlidingList extends Vue {
  @Prop(Number)
  private activeIndex!: number;
  @Prop(Array)
  private newList!: { id: number; list: IMoment[]; loadingText: string }[];

  @SystemModule.State('systemInfo')
  private readonly systemInfo!: SystemInfo;
  private topBarHeight: number = 0;

  mounted() {
    const topBar = uni.createSelectorQuery().select('#top-bar-height');
    topBar
      .boundingClientRect((e?) => {
        if (e?.height) {
          this.topBarHeight = e.height;
        }
      })
      .exec();
  }

  swiperChange({ detail }: { detail: { current: number } }): void {
    this.$emit('currentSwiperIndexChange', detail.current);
  }
  // 滚动到列表最下方触发的事件
  scrolltolowerEvent(index: number) {
    if (this.newList[index].loadingText !== LoadingStatus.load) return;
    this.newList[index].loadingText = LoadingStatus.loading;
    // 小程序下拉加载失效 问题所在
    console.log();

    setTimeout(() => {
      this.newList[index].list.push({
        id: Math.random() * 1000 + 1,
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
        whetherToFollow: 0,
        coverImage: '/static/demo/datapic/2.jpg',
        isLike: 0,
        dislike: 1,
      });
      this.newList[index].loadingText = LoadingStatus.load;
    }, 1500);
  }

  get windowHeight(): string {
    return `${this.systemInfo.windowHeight - this.topBarHeight - 1}px`;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global.scss';

#top-bar-height {
  position: absolute;
  opacity: 0;
  height: 100rpx;
}
.my-uni-tab-bar {
  display: flex;
  flex: 1;
  height: 100%;

  .my-list {
    width: 750rpx;
    height: 100%;
  }
  .my-swiper-box {
    flex: 1;
    width: 100%;
  }
}

/*.empty-state {
  @include centered;
  flex-direction: column;
  width: 100%;
  height: 600rpx;

  .empty-state-img {
    width: 500rpx;
    height: 500rpx;
  }
  .empty-state-text {
    font-size: 40rpx;
  }
}*/
</style>
