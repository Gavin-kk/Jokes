<template>
  <view>
    <view class="topic-bar-height"></view>
    <home-topbar
      :list="titleNavList"
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
          <pull-up-loading :text="item.loading"></pull-up-loading>
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

@Component({
  components: { PullUpLoading, TopicList, HomeTopbar },
})
export default class TopicClassify extends Vue {
  // 可用窗口总高度
  private windowHeight: number = 0;
  // 导航栏的高度
  private barHeight: number = 0;
  // 当前所在话题的index
  private activeIndex: number = 0;
  // 导航栏的列表数据
  private titleNavList: { id: number; title: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '关注' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '推荐' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '体育' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '热爱' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '最新' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '游戏' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '情感' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '打卡' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '故事' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '喜爱' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '喜爱' },
  ];
  // 每个分类的数据
  private classify: {
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
  // 分类的列表数据
  private classifyList: {
    loading: LoadingStatus;
    list: {
      id: number;
      pic: string;
      title: string;
      content: string;
      dynamicCount: number;
      todayCount: number;
    }[];
  }[] = this.titleNavList.map(() => ({ loading: LoadingStatus.load, list: this.classify }));

  created() {
    uni.getSystemInfo({
      success: (data) => {
        this.windowHeight = data.windowHeight;
      },
    });
  }
  mounted() {
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

  // 所在话题索引更改触发
  currentSwiperIndexChange(index: number) {
    this.activeIndex = index;
  }

  //   swiper 当前索引改变触发
  swiperChange({ detail: { current } }: { detail: { current: number } }) {
    this.activeIndex = current;
  }

  // scroll 触底事件处理函数
  scrolltolowerEvent(index: number) {
    if (this.classifyList[index].loading !== LoadingStatus.load) return;
    this.classifyList[index].loading = LoadingStatus.loading;

    setTimeout(() => {
      this.classifyList[index].list.push({
        id: +(Math.random() * 1000 + 1).toFixed(),
        pic: '/static/demo/topicpic/1.jpeg',
        title: '新加入',
        content:
          '新加入' +
          '0后人气我父亲为热惹我喂喂呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃温温热文瑞文服的我女孩的回答当场被录用',
        dynamicCount: 545,
        todayCount: 200,
      });
      this.classifyList[index].loading = LoadingStatus.load;
    }, 1500);
  }

  get availableHeight(): string {
    return `${this.windowHeight - this.barHeight - 1}px`;
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
