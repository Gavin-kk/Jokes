<template>
  <view>
    <view class="root-box">
      <!--    搜索框-->
      <m-search @confirm="searchConfirm" />
      <!--    轮播图组件-->
      <banner :banner-image-list="bannerList" @clickBanner="clickBanner" />
      <!--    热门分类-->
      <popular-categories
        class="border"
        :classifyTagList="classifyTagList"
        @classifyTagClick="classifyTagClick"
        @clickMoreCategories="clickMoreCategories"
      />
    </view>

    <!--    最近更新-->
    <view class="box">
      <view class="title">最近更新</view>
      <block v-for="item in recentlyUpdatedData" :key="item.id">
        <topic-list :data="item" />
      </block>
    </view>
    <pull-up-loading text="没有更多数据了"></pull-up-loading>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MSearch from '@components/search/m-search.vue';
import Banner from '@components/banner/banner.vue';
import PopularCategories from '@components/popular-categories/popularCategories.vue';
import topicList from '@components/topic-list/topic-list.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';

@Component({
  components: { PullUpLoading, topicList, PopularCategories, Banner, MSearch },
})
export default class Topic extends Vue {
  private loading: LoadingStatus = LoadingStatus.load;
  // 热门分类列表
  private classifyTagList: { id: number; text: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '最新' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '游戏' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '情感' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '打卡' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '故事' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '喜爱' },
  ];
  // 轮播图数据
  private bannerList: { id: number; pic: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/1.jpg' },
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/2.jpg' },
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/3.jpg' },
  ];
  // 最近更新版块数据
  private recentlyUpdatedData: {
    id: number;
    pic: string;
    title: string;
    content: string;
    dynamicCount: number;
    todayCount: number;
  }[] = [
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/2.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '话题记录本',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    },
  ];

  // 页面触底事件
  onReachBottom() {
    console.log('触底');
    this.dropDownLoading();
  }

  dropDownLoading() {
    this.recentlyUpdatedData.push({
      id: +(Math.random() * 1000 + 1).toFixed(),
      pic: '/static/demo/topicpic/1.jpeg',
      title: '新的',
      content:
        '面试官:在电梯里巧遇马云你会做什么? 9' +
        '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
      dynamicCount: 545,
      todayCount: 200,
    });
  }

  // 当手机键盘按下搜索 或 确认时触发
  searchConfirm(value: string) {
    uni.showToast({ title: `你要搜索${value}` });
  }

  // 点击轮播图事件
  clickBanner(id: number) {
    uni.showToast({ title: `跳转到id为${id}` });
  }
  //   点击热门分类 tag 事件
  classifyTagClick(id: number, text: string) {
    uni.showToast({ title: `跳转到为${text}id:${id}` });
  }
  //   点击跳转更多热门分类
  clickMoreCategories() {
    uni.navigateTo({
      url: '/pages/topic-classify/topic-classify',
      fail(err) {
        console.log(err);
      },
    });
    uni.showToast({ title: '跳转到更多热门分类' });
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
</style>
