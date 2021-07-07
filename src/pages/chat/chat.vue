<template>
  <view>
    <!--     导航栏-->
    <uni-nav-bar status-bar>
      <view slot="left" @tap="comeBack" class="iconfont icon-fanhui" hover-class="hover"></view>
      <view slot="right" @tap="openPersonal" class="right" hover-class="hover">
        <view class="iconfont icon-geren"></view>
      </view>
    </uni-nav-bar>
    <!--内容-->
    <block v-for="(item, index) in chatDataArr" :key="index">
      <chat-list :data="item" :pre-time="index > 0 ? chatDataArr[index - 1].time : 0"></chat-list>
    </block>
    <!-- 输入框-->
    <chat-input-btn class="input-box" @confirm="confirm"></chat-input-btn>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ChatInputBtn from '@pages/news/components/chat-input-btn/chat-input-btn.vue';
import ChatList from '@pages/news/components/chat-list/chat-list.vue';

@Component({ components: { ChatList, ChatInputBtn, UniNavBar } })
export default class Chat extends Vue {
  // 聊天的数据
  private data = {
    isMe: false,
    avatar: '/static/demo/userpic/8.jpg',
    type: 'text', // 发送内容的类型
    content: '在干嘛', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
    time: new Date().toUTCString(), // 时间戳
  };

  private chatDataArr = [
    {
      isMe: false,
      avatar: '/static/demo/userpic/8.jpg',
      type: 'text', // 发送内容的类型
      content: '在干嘛', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      // time: new Date().getTime() - 1000 * 60 * 60, // 时间戳
      time: new Date().getTime() - 1000 * 60 * 20, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 40, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 35, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
  ];

  comeBack() {
    uni.navigateBack({ delta: 1 });
  }

  openPersonal() {
    uni.showToast({ title: '进入个人页' });
  }
  // 搜索点击提交或手机键盘点击发送触发
  confirm(value: string) {
    uni.showToast({ title: `发送${value}` });
  }
}
</script>

<style lang="scss" scoped>
.right {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 10rpx;
}

.iconfont {
  font-size: 40rpx;
}
.icon-fanhui {
  font-size: 45rpx;
}
.hover {
  color: #bbbbbb;
}

.input-box {
  position: fixed;
  bottom: 0;
}
</style>
