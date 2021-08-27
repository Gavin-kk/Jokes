<template>
  <view>
    <nav-bar :title="title" page-path="/pages/release/release"></nav-bar>
    <view class="search-box" v-if="!currentShowArticleOrTopic">
      <m-search @confirm="searchConfirm" @clear="clearSearchInput" />
    </view>
    <template v-if="currentShowArticleOrTopic">
      <block v-for="(item, index) in classifyList" :key="item.id">
        <avatar-list @clickItem="comeBack" :type="type" :count="item.count" :index="index" :title="item.title" />
      </block>
    </template>
    <template v-else>
      <block v-for="(item, index) in isSearch" :key="item.id">
        <avatar-list
          @clickItem="comeBack"
          :type="type"
          :count="item.articleCount"
          :title="item.title"
          :index="index"
          :desc="item.desc"
          :pic="item.pic"
        />
      </block>
      <pull-up-loading :text="pullMsg"></pull-up-loading>
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ArticleTypeEnum } from '@pages/release/release.vue';
import { ModuleConstant } from '@store/module.constant';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import { namespace } from 'vuex-class';
import { ITopic } from '@pages/moment/store';
import { IClassify } from '@pages/home/store';
import { HomeStoreActionType } from '@pages/home/store/constant';
import ItemList from '@components/list/item-list.vue';
import AvatarList from '@components/avatar-list/avatar-list.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import MSearch from '@components/search/m-search.vue';
import { searchTopicRequest } from '@services/moment.request';

const MomentModule = namespace('momentModule');
const HomeModule = namespace('homeModule');

@Component({
  components: { MSearch, NavBar, PullUpLoading, AvatarList, ItemList },
})
export default class SelectClassify extends Vue {
  @MomentModule.State('topicList')
  private topicList!: ITopic[];
  @HomeModule.State('classifyList')
  private classifyList!: IClassify[];
  private type: ArticleTypeEnum = ArticleTypeEnum.topic;
  private pullMsg: LoadingStatus = LoadingStatus.load;
  // 搜索的内容
  private searchContent: string = '';
  // 搜索的列表
  private searchList: ITopic[] = [];
  // 页码
  private pageNum: number = 1;
  // 搜索的页码
  private searchPageNum: number = 1;
  // 最底部是否没有数据了
  private isBottom: boolean = false;

  @Watch('searchContent')
  watchSearchContent() {
    if (this.searchContent === '') {
      this.searchPageNum = 1;
      this.isBottom = false;
      this.searchList = [];
    }
  }

  // 判断当前显示哪种列表
  get currentShowArticleOrTopic(): boolean {
    return this.type === ArticleTypeEnum.article;
  }
  // 判断搜索是否有数据如果有则改用搜索的数据渲染
  get isSearch(): ITopic[] {
    if (this.searchList.length > 0) {
      return this.searchList;
    }
    return this.topicList;
  }

  get title(): string {
    return this.currentShowArticleOrTopic ? '选择文章分类' : '选择话题';
  }

  created() {
    this.getData();
  }
  // 搜索输入框点击清除的事件 在此事件执行之前input 已经被清除了;
  clearSearchInput() {
    this.searchContent = '';
  }

  // 搜索事件
  async searchConfirm(value: string) {
    await this.getSearchData(value);
  }

  // 获取搜索话题
  async getSearchData(value: string, pageNum: number = 1) {
    this.searchContent = value;
    const result = await searchTopicRequest(value, pageNum);
    if (!result.data.data.length) {
      uni.showToast({ title: '啊哦,什么都没搜到哦', icon: 'none' });
    }
    if (result.data.data.length === this.searchList.length) {
      this.isBottom = true;
    }
    this.searchList = result.data.data;
  }

  comeBack(index?: number) {
    if (typeof index !== 'undefined') {
      if (this.currentShowArticleOrTopic) {
        uni.$emit('selectedClassify', this.classifyList[index]);
      } else {
        uni.$emit('selectedTopic', this.topicList[index]);
      }
    }
    uni.navigateBack({
      delta: 1,
    });
  }

  // 页面滚动到底部事件
  async onReachBottom() {
    if (this.searchList.length === 0) {
      this.pullMsg = LoadingStatus.loading;
      this.pageNum++;
      await this.getData();
      this.isBottom ? (this.pullMsg = LoadingStatus.air) : (this.pullMsg = LoadingStatus.load);
    } else {
      this.pullMsg = LoadingStatus.loading;
      this.searchPageNum++;
      await this.getSearchData(this.searchContent, this.searchPageNum);
      this.isBottom ? (this.pullMsg = LoadingStatus.air) : (this.pullMsg = LoadingStatus.load);
    }
  }

  async getData() {
    const pages: any = getCurrentPages();
    const {
      options: { type },
    }: { options: { type: string } } = pages[pages.length - 1];

    this.type = +type;

    if (+type === ArticleTypeEnum.article && !this.classifyList.length) {
      try {
        await this.$store.dispatch(`${ModuleConstant.homeModule}/${HomeStoreActionType.GET_ALL_ARTICLE_CATEGORIES}`);
      } catch ({ response }) {
        console.log(response);
      }
    } else {
      if (!this.topicList.length) this.pageNum++;
      try {
        const result: ITopic[] = await this.$store.dispatch(
          `${ModuleConstant.momentModule}/${MomentStoreActionType.GET_ALL_TOPICS}`,
          this.pageNum,
        );
        if (result.length === this.topicList.length) {
          this.isBottom = true;
        }
      } catch ({ response }) {
        console.log(response);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx;
}
</style>
