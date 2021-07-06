<template>
  <view>
    <!--    背景模糊-->
    <view class="fuzzy">
      <image class="image" src="/static/demo/topicpic/3.jpeg" mode="aspectFill"></image>
    </view>
    <!--    个人版块-->
    <view class="topic-info">
      <view class="title">
        <view class="title-image-box">
          <image class="title-image" src="/static/demo/topicpic/3.jpeg" mode="aspectFill"></image>
        </view>
        <view class="title-name">#忆往事,在电梯里巧遇马云你会做什么 尽余生#</view>
      </view>
      <view class="topic-count">动态 793 今日 641</view>
      <view class="desc">面试官:在电梯里巧遇马云你会做什么? 90后女孩的回答当场被录用</view>
    </view>

    <!--    tab切换-->
    <view>
      <home-topbar
        class="bar"
        :list="titleNavList"
        :activeIndex="activeIndex"
        itemStyle="width:50%;"
        @currentSwiperIndexChange="currentSwiperIndexChange"
      />
      <block v-for="(item, index) in list" :key="index">
        <template v-if="index === activeIndex">
          <block v-for="itex in item.list" :key="itex.id">
            <moment-list :data="itex" />
          </block>
          <pull-up-loading :text="item.loading" />
        </template>
      </block>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeTopbar from '@components/home-topbar/home-topbar.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import MomentList from '@components/moment-list/moment-list.vue';
import { IMomentList } from '@components/moment-list/moment-list';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';

@Component({
  components: { PullUpLoading, MomentList, HomeTopbar },
})
export default class TopicDetail extends Vue {
  private activeIndex: number = 0;
  private titleNavList: { id: number; title: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '默认' },
    { id: +(Math.random() * 1000 + 1).toFixed(), title: '最新' },
  ];

  private list: {
    loading: LoadingStatus;
    list: IMomentList[];
  }[] = [
    {
      loading: LoadingStatus.load,
      list: [
        // 文字数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '名字',
          gender: 1,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: null,
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 图片数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '4321dsafqwfeasdfqwtqwefsdagwqerewq ',
          gender: 0,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，111111111让服务器而且我2222222222222222222222222222222222222222222222222222222222好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: '/static/demo/datapic/2.jpg',
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 视频数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '名字',
          age: 32,
          gender: 0,
          avatar: '/static/demo/userpic/8.jpg',
          content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: '/static/demo/datapic/2.jpg',
          video: {
            playCount: '20w',
            totalTime: '2:40',
          },
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 分享数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          gender: 0,
          age: 42,
          username: '名字',
          avatar: '/static/demo/userpic/8.jpg',
          content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          video: null,
          momentPic: null,
          share: {
            content: '我是标题',
            momentPic: '/static/demo/datapic/2.jpg',
          },
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 1, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
      ],
    },
    {
      loading: LoadingStatus.load,
      list: [
        // 文字数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '名字',
          gender: 1,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: null,
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 图片数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '4321dsafqwfeasdfqwtqwefsdagwqerewq ',
          gender: 0,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，111111111让服务器而且我2222222222222222222222222222222222222222222222222222222222好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: '/static/demo/datapic/2.jpg',
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 视频数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '名字',
          age: 32,
          gender: 0,
          avatar: '/static/demo/userpic/8.jpg',
          content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: '/static/demo/datapic/2.jpg',
          video: {
            playCount: '20w',
            totalTime: '2:40',
          },
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
        // 分享数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          gender: 0,
          age: 42,
          username: '名字',
          avatar: '/static/demo/userpic/8.jpg',
          content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          video: null,
          momentPic: null,
          share: {
            content: '我是标题',
            momentPic: '/static/demo/datapic/2.jpg',
          },
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 1, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
      ],
    },
  ];

  // 监听页面滚动到底部
  onReachBottom() {
    this.bottomOut();
  }

  // 监听下拉刷新
  onPullDownRefresh() {
    this.pullUpToRefresh();
  }

  // 上拉刷新处理函数
  pullUpToRefresh() {
    setTimeout(() => {
      // 获取数据
      // 赋值
      this.list[this.activeIndex].list = [
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '新的',
          gender: 1,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: null,
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
      ];
      // 取消下拉刷新
      uni.stopPullDownRefresh();
    }, 2000);
  }

  // 下拉加载处理函数
  bottomOut() {
    if (this.list[this.activeIndex].loading !== LoadingStatus.load) return;
    this.list[this.activeIndex].loading = LoadingStatus.loading;

    setTimeout(() => {
      this.list[this.activeIndex].list.push(
        // 文字数据
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '新的',
          gender: 1,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content:
            '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
          momentPic: null,
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        },
      );
      this.list[this.activeIndex].loading = LoadingStatus.load;
    }, 1500);
  }

  currentSwiperIndexChange(index: number) {
    this.activeIndex = index;
  }
  swiperChange({ detail }: { detail: { current: number } }) {
    this.activeIndex = detail.current;
  }
}
</script>

<style lang="scss" scoped>
.root-box {
  padding: 0 20rpx;
}
.fuzzy {
  width: 100%;
  height: 300rpx;

  .image {
    width: 100%;
    height: 100%;
    filter: blur(20px);
  }
}

.topic-info {
  position: relative;
  box-sizing: border-box;
  padding: 0 20rpx;
  width: 100%;
  background: #ffffff;

  .title {
    display: flex;
    height: 110rpx;

    .title-image-box {
      position: relative;
      top: -50%;
      width: 150rpx;
      height: 150rpx;
      overflow: hidden;
      border-radius: 20rpx;
      flex-shrink: 0;

      .title-image {
        width: 100%;
        height: 100%;
      }
    }

    .title-name {
      @include ellipsis(600rpx);
      margin-left: 20rpx;
    }
  }

  .topic-count {
    font-size: 28rpx;
    color: #d1d1d1;
  }

  .desc {
    margin-top: 10rpx;
    font-size: 30rpx;
    color: #b8b8b8;
    line-height: 50rpx;
  }
}
</style>
