<template>
  <view class="list-box">
    <news-list :data="data" />
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewsList from '@pages/news/components/news-list/news-list.vue';

@Component({ components: { NewsList } })
export default class News extends Vue {
  private data: { id: number; username: string; content: string; time: string; unreadCount: number; avatar: string } = {
    id: +(Math.random() * 1000 + 1).toFixed(),
    username: '低头看云',
    content: '你干嘛呢, 嗯嗯嗯?',
    time: '13.50',
    unreadCount: 0,
    avatar: '/static/demo/userpic/8.jpg',
  };

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
</style>
