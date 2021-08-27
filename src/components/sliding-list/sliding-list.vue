<template>
  <view>
    <view class="top-bar-height"></view>
    <view class="my-uni-tab-bar" v-if="listIsShow">
      <swiper class="my-swiper-box" :current="activeIndex" :style="{ height: windowHeight }" @change="swiperChange">
        <swiper-item v-for="(items, inde) in newList" :key="inde">
          <z-paging
            ref="paging"
            :fixed="false"
            refresher-only
            @onRefresh="query(inde)"
            @scrolltolower="scrolltolowerEvent(inde)"
            :safe-area-inset-bottom="true"
            :delay="1000"
          >
            <view v-if="isShowArticleList(items)" class="paging-box" :style="{ height: windowHeight, width: '100%' }">
              <view v-for="(item, index) in items.articleList" :key="index">
                <dynamic :moment-data="item" />
              </view>
              <pull-up-loading class="loading-bar" :text="items.loadingText" />
              <!--#ifdef MP-WEIXIN-->
              <view style="height: 80px"></view>
              <!--#endif-->
            </view>
            <template v-else> <empty /> </template>
          </z-paging>
        </swiper-item>
      </swiper>
    </view>
    <view v-else> <empty /> </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import Dynamic from '@components/dynamic/dynamic.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import Empty from '@components/empty/empty.vue';
import { IClassifyArticleList } from '@pages/home/home.vue';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { IArticle } from '@pages/home/store';
import { getClassifyAllArticleRequest } from '@services/home.request';
import ZPaging from '@components/z-paging/z-paging.vue';

@Component({ components: { ZPaging, Empty, PullUpLoading, Dynamic } })
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
      return `${this.systemInfo!.windowHeight - this.topBarHeight - 1}px`;
    }
    return '0px';
  }
  // 判断列表是否显示
  get listIsShow(): boolean {
    return !!this.newList.length;
  }

  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('.top-bar-height')
      .fields({ size: true }, (res?) => {
        if (res?.height) {
          this.topBarHeight = res.height;
        }
      })
      .exec();
    this.systemInfo = uni.getSystemInfoSync();
  }

  swiperChange({ detail }: { detail: { current: number } }): void {
    this.$emit('currentSwiperIndexChange', detail.current);
  }

  // 刷新数据
  async query(index: number) {
    this.newList[this.activeIndex].pageNum = 1;
    const result: AxiosResponse<IResponse<IArticle[]>> = await getClassifyAllArticleRequest(
      this.newList[this.activeIndex].pageNum,
      this.newList[this.activeIndex].id,
    );
    this.newList[this.activeIndex].articleList = result.data.data;
    (this as any).$refs.paging[index].complete(true);
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
</style>
