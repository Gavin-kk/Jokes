<template>
  <view class="list-box">
    <block v-for="(item, index) in dataList" :key="item.id">
      <uni-swipe-action>
        <!-- 使用插槽 （请自行给定插槽内容宽度）-->
        <uni-swipe-action-item>
          <view>
            <news-list :data="item" />
          </view>
          <template v-slot:right>
            <view class="delete-box" @click="clickDelete(index)">
              <text>删除</text>
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </block>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import UniSwipeAction from '@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.vue';

@Component({ components: { NewsList, UniSwipeAction, uniSwipeActionItem } })
export default class News extends Vue {
  private dataList: {
    id: number;
    username: string;
    content: string;
    time: string;
    unreadCount: number;
    avatar: string;
  }[] = [
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '低头看云',
      content: '你干嘛呢, 嗯嗯嗯?',
      time: '13.50',
      unreadCount: 0,
      avatar: '/static/demo/userpic/8.jpg',
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '低头看云',
      content: '你干嘛呢, 嗯嗯嗯?',
      time: '13.50',
      unreadCount: 1,
      avatar: '/static/demo/userpic/8.jpg',
    },
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '低头看云',
      content: '你干嘛呢, 嗯嗯嗯?',
      time: '13.50',
      unreadCount: 22,
      avatar: '/static/demo/userpic/8.jpg',
    },
  ];

  // 点击拉取出来的删除按钮触发
  clickDelete(index: number) {
    this.dataList.splice(index, 1);
  }
  // 监听下拉
  onPullDownRefresh() {
    this.pullDownToRefresh();
  }
  // 下拉刷新
  pullDownToRefresh() {
    setTimeout(() => {
      this.dataList = [
        {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '低头看云',
          content: '你干嘛呢, 嗯嗯嗯?',
          time: '13.50',
          unreadCount: 23,
          avatar: '/static/demo/userpic/8.jpg',
        },
      ];
      uni.stopPullDownRefresh();
    }, 2000);
  }
  //   原生导航栏点击监听
  onNavigationBarButtonTap(d: { index: number }) {
    if (d.index === 0) {
      uni.showToast({ title: '进入好友列表' });
    } else {
      uni.showToast({ title: '弹出添加好友' });
    }
  }
}
</script>

<style lang="scss" scoped>
.list-box {
  padding: 10rpx 20rpx;
}
.delete-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f75855;
  color: #ffeee7;
  width: 200rpx;
  font-size: 32rpx;
}
</style>
