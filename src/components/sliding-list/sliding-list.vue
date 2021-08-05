<template>
  <view>
    <view class="top-bar-height"></view>
    <view class="my-uni-tab-bar" v-if="listIsShow">
      <swiper class="my-swiper-box" :current="activeIndex" :style="{ height: windowHeight }" @change="swiperChange">
        <swiper-item v-for="(items, index) in newList" :key="items.id">
          <view v-if="isShowArticleList(items)" :style="{ height: windowHeight, width: '100%' }">
            <scroll-view scroll-y class="my-list" @scrolltolower="scrolltolowerEvent(index)">
              <view v-for="item in items.articleList" :key="item.id">
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
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator';
import Dynamic from '@components/dynamic/dynamic.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import Empty from '@components/empty/empty.vue';
import { IClassifyArticleList } from '@pages/home/home.vue';
import lodash from 'lodash';
import { IArticle } from '@store/module/home';
import { LoadingStatus } from './loading-status';

@Component({ components: { Empty, PullUpLoading, Dynamic } })
export default class SlidingList extends Vue {
  @Prop({ type: Number, default: 0 })
  private activeIndex!: number;
  @PropSync('list', { type: Array, default: [] })
  private newList!: IClassifyArticleList[];

  private systemInfo: SystemInfo | null = null;
  private topBarHeight: number = 0;
  // 判断是否显示文章的列表
  get isShowArticleList() {
    return (items: IClassifyArticleList) => !!items.articleList.length;
  }
  // 计算window的高度
  get windowHeight(): string {
    if (this.systemInfo) {
      return `${this.systemInfo.windowHeight - this.topBarHeight - 1}px`;
    }
    return '0px';
  }
  // 判断列表是否显示
  get listIsShow(): boolean {
    return !!this.newList.length;
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
    this.systemInfo = uni.getSystemInfoSync();
  }

  swiperChange({ detail }: { detail: { current: number } }): void {
    this.$emit('currentSwiperIndexChange', detail.current);
  }

  // 滚动到列表最下方触发的事件
  scrolltolowerEvent(index: number) {
    this.$emit('scrolltolowerEvent', index);
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
