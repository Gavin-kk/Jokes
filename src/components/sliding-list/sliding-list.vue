<template>
  <view>
    <view class="top-bar-height"></view>
    <view class="my-uni-tab-bar" v-if="listIsShow">
      <swiper class="my-swiper-box" :current="activeIndex" :style="{ height: windowHeight }" @change="swiperChange">
        <swiper-item v-for="(items, index) in newList" :key="items.id">
          <view v-if="!!items.list.length" :style="{ height: windowHeight, width: '100%' }">
            <scroll-view scroll-y class="my-list" @scrolltolower="scrolltolowerEvent(index)">
              <view v-for="item in items.list" :key="item.id">
                <dynamic :moment-data="item" />
              </view>
              <pull-up-loading :text="items.loadingText" />
            </scroll-view>
          </view>
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
import moment from 'moment';
import { IMomentList } from '@components/moment-list/moment-list';
import { LoadingStatus } from './loading-status';

type list = { id: number; list: IMomentList[]; loadingText: string };

const SystemModule = namespace('systemModule');
@Component({ components: { Empty, PullUpLoading, Dynamic } })
export default class SlidingList extends Vue {
  @Prop(Number)
  private activeIndex!: number;
  @Prop(Array)
  private list!: list[];

  private newList: list[] = [];

  @SystemModule.State('systemInfo')
  private readonly systemInfo!: SystemInfo;
  private topBarHeight: number = 0;

  created() {
    this.newList = this.list;
  }

  mounted() {
    const topBar = uni.createSelectorQuery().select('.top-bar-height');
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
    if (this.newList[index].loadingText !== '上拉加载更多') return;
    this.newList[index].loadingText = LoadingStatus.loading;

    setTimeout(() => {
      this.newList[index].list.push({
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
        createAt: moment(`${new Date().getTime() - 1000 * 60 * 60 * 12}`).format('llll'),
      });
      this.newList[index].loadingText = LoadingStatus.load;
    }, 1500);
  }

  get windowHeight(): string {
    return `${this.systemInfo.windowHeight - this.topBarHeight - 1}px`;
  }

  get listIsShow(): boolean {
    return !!this.newList.length;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global.scss';

.top-bar-height {
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
