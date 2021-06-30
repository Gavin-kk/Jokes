<template>
  <view>
    <view id="top-bar-height"></view>
    <view class="my-uni-tab-bar">
      <swiper class="my-swiper-box" :current="activeIndex" :style="{ height: windowHeight }" @change="swiperChange">
        <swiper-item v-for="(items, index) in newList" :key="index" :style="{ height: windowHeight }">
          <scroll-view :scroll-y="true" class="my-list" @scrolltolower="scrolltolowerEvent(index)">
            <block v-for="item in items.list" :key="item.username">
              <dynamic :moment-data="item" />
            </block>
            <pull-up-loading :text="items.loadingText" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Dynamic from '@components/dynamic/dynamic.vue';
import { namespace } from 'vuex-class';

import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { LoadingStatus } from './loading-status';

const SystemModule = namespace('systemModule');
@Component({ components: { PullUpLoading, Dynamic } })
export default class SlidingList extends Vue {
  @Prop(Number)
  private activeIndex!: number;
  @Prop(Array)
  private newList!: { list: IMoment[]; loadingText: string }[];

  @SystemModule.State('systemInfo')
  private readonly systemInfo!: SystemInfo;
  private topBarHeight: number = 0;

  mounted() {
    const topBar = uni.createSelectorQuery().select('#top-bar-height');
    topBar
      .boundingClientRect(({ height }) => {
        if (height) this.topBarHeight = height;
      })
      .exec();
  }

  swiperChange({ detail }: { detail: { current: number } }): void {
    this.$emit('currentSwiperIndexChange', detail.current);
  }
  scrolltolowerEvent(index: number) {
    if (this.newList[index].loadingText !== LoadingStatus.load) return;
    this.newList[index].loadingText = LoadingStatus.loading;
    setTimeout(() => {
      this.newList[index].list.push({
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
    }, 3000);
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

    .loading {
      @include centered;
      width: 100%;
      height: 100rpx;
      font-size: 28rpx;
      color: #aaaaaa;
    }
  }
  .my-swiper-box {
    flex: 1;
    width: 100%;
  }
}
</style>
