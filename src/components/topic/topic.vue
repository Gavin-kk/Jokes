<template>
  <view>
    <view class="root-box">
      <view :class="[{ 'search-box': isShowSearch }]">
        <!--    搜索框-->
        <m-search @confirm="searchConfirm" @clear="clearSearchInput" />
      </view>

      <template v-if="!isShowSearch">
        <!--    轮播图组件-->
        <banner :banner-image-list="bannerList" @clickBanner="clickBanner" />
        <!--    热门分类-->
        <popular-categories
          class="border"
          @classifyTagClick="classifyTagClick"
          @clickMoreCategories="clickMoreCategories"
        />
      </template>
    </view>
    <template v-if="!isShowSearch">
      <!--    最近更新-->
      <view class="box">
        <view class="title">热门话题</view>
        <block v-for="item in popularTopicList" :key="item.id">
          <topic-list :data="item" />
        </block>
      </view>
      <pull-up-loading text="没有更多数据了"></pull-up-loading>
    </template>
    <!-- 搜索时显示-->
    <template v-if="isShowSearch">
      <view v-if="isMatching">
        <view class="msg">无匹配话题</view>
        <avatar-list
          @openCreateTopic="openCreateTopic"
          :title="searchContent"
          desc="新话题"
          pic="/static/air.png"
          is-create
        />
      </view>
      <view class="msg">搜索结果</view>
      <block v-for="(item, index) in searchList" :key="item.id">
        <avatar-list
          @clickItem="clickTopicItem(item)"
          :count="item.articleCount"
          :title="item.title"
          :index="index"
          :desc="item.desc"
          :pic="item.pic"
        />
      </block>
      <template v-if="!searchList.length">
        <empty />
      </template>
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MSearch from '@components/search/m-search.vue';
import Banner from '@components/banner/banner.vue';
import PopularCategories from '@components/popular-categories/popularCategories.vue';
import topicList from '@components/topic-list/topic-list.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { namespace } from 'vuex-class';
import { ITopic } from '@pages/moment/store';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import AvatarList from '@components/avatar-list/avatar-list.vue';
import { searchTopicRequest } from '@services/moment.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import Empty from '@components/empty/empty.vue';

const MomentModule = namespace('momentModule');
@Component({
  components: { Empty, AvatarList, PullUpLoading, topicList, PopularCategories, Banner, MSearch },
})
export default class Topic extends Vue {
  // 最热的话题
  @MomentModule.State('hotTopic')
  private readonly popularTopicList!: ITopic[];
  @MomentModule.Action(MomentStoreActionType.GET_ALL_TOPIC_CATEGORIES)
  private readonly getAllTopicCategories!: () => Promise<void>;
  @MomentModule.Action(MomentStoreActionType.GET_TRENDING_TOPIC)
  private readonly getHotTopic!: () => Promise<void>;
  // 搜索的内容
  private searchContent: string = '';
  // 搜索的话题列表 如果该项有值 则只显示该项数据
  private searchList: ITopic[] = [];
  // 搜索的页码
  private searchPageNum: number = 1;
  // 在搜索中是否没有匹配的话题
  private isMatching: boolean = false;
  // private popularTopicList: ITopic[] = [];

  // 轮播图数据
  private bannerList: { id: number; pic: string }[] = [
    { id: 1, pic: '/static/demo/datapic/1.jpg' },
    { id: 2, pic: '/static/demo/datapic/2.jpg' },
    { id: 3, pic: '/static/demo/datapic/3.jpg' },
  ];

  get isShowSearch(): boolean {
    return !!this.searchList.length || this.isMatching;
  }

  created() {
    this.getTopIcClassifyList();
    //   获取热门话题
    this.getHotTopic();
  }

  // 点击搜索到的话题 触发
  clickTopicItem(item: ITopic) {
    uni.navigateTo({
      url: `/pages/topic-detail/topic-detail?data=${JSON.stringify(item)}`,
    });
  }

  // 打开创建话题页面
  openCreateTopic(title: string) {
    uni.navigateTo({
      url: `/pages/create-topic/create-topic?title=${title}`,
    });
  }

  // 获取话题分类列表
  async getTopIcClassifyList() {
    try {
      await this.getAllTopicCategories();
    } catch (err) {
      uni.showToast({ title: '网络错误', icon: 'none' });
    }
  }

  // 当手机键盘按下搜索 或 确认时触发
  async searchConfirm(value: string) {
    this.searchContent = value;
    const result: AxiosResponse<IResponse<ITopic[]>> = await searchTopicRequest(value.trim(), this.searchPageNum);
    if (result.data.data.length === 0) {
      this.isMatching = true;
    } else if (this.isMatching && result.data.data.length > 0) {
      this.isMatching = false;
    }
    this.searchList = result.data.data;
  }

  // 清除搜索框事件
  clearSearchInput() {
    this.isMatching = false;
    this.searchList = [];
  }

  // 点击轮播图事件
  clickBanner(id: number) {
    uni.showToast({ title: `跳转到id为${id}` });
  }
  //   点击热门分类 tag 事件
  classifyTagClick(index: number) {
    uni.navigateTo({
      url: `/pages/topic-classify/topic-classify?index=${index}`,
    });
  }
  //   点击跳转更多热门分类
  clickMoreCategories() {
    uni.navigateTo({
      url: '/pages/topic-classify/topic-classify',
    });
  }
}
</script>

<style lang="scss" scoped>
.root-box {
  box-sizing: border-box;
  padding: 20rpx;
}

.border {
  padding-bottom: 20rpx;
}

.box {
  padding: 20rpx;
  border-top: 1px solid $borderColor;

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 60rpx;
    font-size: 30rpx;
  }
}
.msg {
  font-size: 30rpx;
  color: #a5a5a5;
  margin-left: 20rpx;
}
.search-box {
  border-bottom: 2px solid #f4f4f4;
  height: 75rpx;
}
</style>
