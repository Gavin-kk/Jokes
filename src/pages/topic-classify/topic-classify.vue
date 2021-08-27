<template>
  <view>
    <view class="topic-bar-height"></view>
    <home-topbar
      :list="topicClassifyList"
      :activeIndex="activeIndex"
      @currentSwiperIndexChange="currentSwiperIndexChange"
    ></home-topbar>
    <!--    话题内容列表-->
    <swiper :current="activeIndex" @change="swiperChange" :style="{ height: availableHeight }">
      <swiper-item v-for="(item, index) in classifyList" :key="index">
        <scroll-view
          class="scroll-view-list"
          :scroll-y="true"
          :scroll-x="false"
          :style="{ height: availableHeight }"
          @scrolltolower="scrolltolowerEvent(index)"
        >
          <block v-for="itex in item.list" :key="itex.id">
            <topic-list :data="itex"></topic-list>
          </block>
          <template v-if="isShowLoadingText">
            <pull-up-loading :text="item.loading"></pull-up-loading>
          </template>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeTopbar from '@components/home-topbar/home-topbar.vue';
import TopicList from '@components/topic-list/topic-list.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { namespace } from 'vuex-class';
import { ITopic, ITopicClassify } from '@pages/moment/store';
import { ModuleConstant } from '@store/module.constant';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import { getTheSpecifiedTopicCategoryRequest } from '@services/topic.request';

const MomentModule = namespace('momentModule');

@Component({
  components: { PullUpLoading, TopicList, HomeTopbar },
})
export default class TopicClassify extends Vue {
  @MomentModule.State('topicClassifyList')
  private topicClassifyList!: ITopicClassify[];

  // 可用窗口总高度
  private windowHeight: number = 0;
  // 导航栏的高度
  private barHeight: number = 0;
  // 当前所在话题的index
  private activeIndex: number = 0;

  private classifyList:
    | {
        loading: LoadingStatus;
        pageNum: number;
        list: ITopic[];
      }[]
    | null = null;

  get availableHeight(): string {
    return `${this.windowHeight - this.barHeight - 1}px`;
  }

  get isShowLoadingText(): boolean {
    if (this.classifyList?.length) {
      return this.classifyList[this.activeIndex].list.length >= 10;
    }
    return false;
  }

  async created() {
    uni.getSystemInfo({
      success: (data) => {
        this.windowHeight = data.windowHeight;
      },
    });
    await this.getTopicClassifyList();
    this.classifyList = this.topicClassifyList.map(() => ({ loading: LoadingStatus.load, list: [], pageNum: 1 }));
    await this.getTopicList(1, this.activeIndex);
  }

  mounted() {
    this.getCurrentPagesIndex();

    uni
      .createSelectorQuery()
      .select('.topic-bar-height')
      .boundingClientRect((data?) => {
        if (data?.height) {
          this.barHeight = data.height;
        }
      })
      .exec();
  }

  // 获取上个页面传来的index
  getCurrentPagesIndex() {
    const pages: any = getCurrentPages();
    const {
      options: { index },
    } = pages[pages.length - 1];
    if (typeof index !== 'undefined') {
      this.activeIndex = +index;
    }
  }

  // 请求分类列表
  async getTopicClassifyList() {
    if (this.topicClassifyList.length === 0) {
      try {
        await this.$store.dispatch(`${ModuleConstant.momentModule}/${MomentStoreActionType.GET_ALL_TOPIC_CATEGORIES}`);
      } catch ({ response }) {
        console.log(response);
      }
    }
  }

  // 请求话题分类的话题列表
  async getTopicList(pageNum: number = 1, index: number = 0) {
    try {
      const result = await getTheSpecifiedTopicCategoryRequest(pageNum, this.topicClassifyList[index].id);
      this.classifyList![index].list.push(...result.data.data);
    } catch ({ response }) {
      console.log(response);
    }
  }

  // 所在话题索引更改触发
  currentSwiperIndexChange(index: number) {
    this.activeIndex = index;
  }

  //   swiper 当前索引改变触发
  async swiperChange({ detail: { current } }: { detail: { current: number } }) {
    this.activeIndex = current;
    if (this.classifyList![current].list.length === 0) {
      await this.getTopicList(this.classifyList![current].pageNum, current);
    }
  }

  // scroll 触底事件处理函数
  async scrolltolowerEvent(index: number) {
    if (this.classifyList![index].loading !== LoadingStatus.load) return;
    this.classifyList![index].loading = LoadingStatus.loading;
    this.classifyList![index].pageNum++;
    await this.getTopicList(this.classifyList![index].pageNum, index);
    this.classifyList![index].loading = LoadingStatus.load;
  }
}
</script>

<style lang="scss" scoped>
.topic-bar-height {
  position: absolute;
  opacity: 0;
  height: 100rpx;
}

.scroll-view-list {
  padding: 10rpx 20rpx;
}
</style>
