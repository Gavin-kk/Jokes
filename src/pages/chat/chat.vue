<template>
  <view :class="['box', 'animate__animated', 'animate__fadeIn']" style="animation-duration: 200ms">
    <!--     导航栏-->
    <uni-nav-bar status-bar class="nav-bar-height">
      <view slot="left" @tap="comeBack" class="iconfont icon-fanhui" hover-class="hover"></view>
      <view slot="right" @tap="openPersonal" class="right" hover-class="hover">
        <view class="iconfont icon-geren"></view>
      </view>
    </uni-nav-bar>
    <!--内容-->

    <!--    :scroll-with-animation="true"-->
    <scroll-view
      id="scroll-view-chat"
      scroll-with-animation
      :scroll-top="scrollTop"
      :scroll-y="true"
      :style="{ height: scrollHeight }"
    >
      <block v-for="(item, index) in chatDataArr" :key="index">
        <chat-list class="chat-list-chat" :data="item" :pre-time="chatDataPreTime(index)"></chat-list>
      </block>
      <button @tap="a">连接a用户</button>
      <button @tap="b">连接b用户</button>
    </scroll-view>
    <!-- 输入框-->
    <chat-input-btn class="input-box" @confirm="confirm"></chat-input-btn>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import ChatList from '@pages/news/components/chat-list/chat-list.vue';
import WebsocketMixin, { IReadState, ISocketMessage } from '@src/mixins/websocket.mixin';

@Component({ components: { ChatList, ChatInputBtn, UniNavBar } })
export default class Chat extends Mixins(WebsocketMixin) {
  a() {
    this.targetUserId = 7;

    // const timer = setInterval(() => {
    if (this.readState?.key === 1) {
      this.sendMessage({
        event: 'auth',
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicGFzc3dvcmQiOiIkMmEkMTAkWWhFTzZ0ektrZFBIeVJUeFdRQ1NvT2lKZmhtQWN6cUN1UFNBUXgvNFdPVS5ud0xlNmxSSE8iLCJpYXQiOjE2Mjc2MjM3ODQsImV4cCI6MTYyNzcxMDE4NH0.w5e11y5nj8jIKA4ppoApbdL_EhfCCac4HjnxXq1f9QE',
        },
      });
    }
  }
  b() {
    this.targetUserId = 8;

    // const timer = setInterval(() => {
    if (this.readState?.key === 1) {
      this.sendMessage({
        event: 'auth',
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywicGFzc3dvcmQiOiIkMmEkMTAkMlRST2V5YUIzclo2QlhIamxDeGwyT2tXNjNtMHJYMEx6YUVZR2pzLmJEQnM3WjlBMWdNLksiLCJpYXQiOjE2Mjc2MjkwNDQsImV4cCI6MTYyNzcxNTQ0NH0.73g9zy49SBFG0rw8ous6n7NYO3uX5vahLOqXxaDdEOg',
        },
      });
    }
  }
  // 所有可视区域高度
  private windowHeight: number = 0;
  // navBar的高度
  private navBarHeight: number = 0;
  // inputBox的高度
  private inputBoxHeight: number = 0;
  // 聊天框的上方卷曲的高度
  private scrollTop: number = 0;
  // 聊天的数据
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
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
    {
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'image', // 发送内容的类型
      content: '/static/demo/datapic/1.jpg', // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 24, // 时间戳
    },
  ];

  created() {
    // this.webSocketTest();
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
      },
    });
  }

  @Watch('readState')
  watchReadState(newState: IReadState) {
    console.log(newState);
  }

  @Watch('message')
  watchMessage(msg: ISocketMessage) {
    switch (msg.event) {
      case 'auth':
        break;
      case 'chatMessage':
        this.chatDataArr.push({
          isMe: false,
          avatar: '/static/demo/userpic/1.jpg',
          type: 'text', // 发送内容的类型
          content: msg.data.content, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
          time: msg.data.time, // 时间戳
        });
        this.$nextTick(() => {
          this.getChatListHeight();
        });
        break;
      case 'error':
        console.log(msg, 'error');
        break;
      default:
    }
  }

  mounted() {
    setTimeout(() => {
      this.getHeight().then(() => {
        this.getChatListHeight(true);
      });
    }, 50);
  }

  // 获取每一个信息组件的高度 然后赋值给 scrollTop
  getChatListHeight(isFirst: boolean = false) {
    const query = uni.createSelectorQuery().in(this);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    query.selectAll('.chat-list-chat').boundingClientRect(() => {});
    query.exec((res?: [{ height: number }[]]) => {
      if (res) {
        if (isFirst) {
          let sumHeight: number = 0;
          res[0].forEach((item) => {
            sumHeight += item.height;
          });
          if (sumHeight > parseInt(this.scrollHeight.replace('px', ''), 10)) {
            this.scrollTop = sumHeight;
          }
        } else {
          this.scrollTop += res[0][res[0].length - 1].height;
        }
      }
    });
  }

  chatDataPreTime(index: number) {
    return index > 0 ? this.chatDataArr[index - 1].time : 0;
  }

  comeBack() {
    uni.navigateBack({ delta: 1 });
  }

  openPersonal() {
    uni.showToast({ title: '进入个人页' });
  }

  private targetUserId: number = 0;

  // 搜索点击提交或手机键盘点击发送触发
  confirm(value: string) {
    const time = new Date().getTime();
    this.sendMessage({
      event: 'chatMessage',
      data: { content: value, time, targetUserId: this.targetUserId },
    });
    this.chatDataArr.push({
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'text', // 发送内容的类型
      content: value, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time, // 时间戳
    });
    this.$nextTick(() => {
      this.getChatListHeight();
    });
  }

  getHeight() {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      query.select('.nav-bar-height').boundingClientRect(() => {});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      query.select('.input-box').boundingClientRect(() => {});
      query.exec((result?: { height: number }[]) => {
        if (result) {
          this.navBarHeight = result[0]?.height;
          this.inputBoxHeight = result[1]?.height;
          resolve({});
        }
      });
    });
  }

  get scrollHeight(): string {
    return `${this.windowHeight - this.navBarHeight - this.inputBoxHeight}px`;
  }

  private switchAnimation: boolean = true;
  //  控制动画
  get animationClassName(): string {
    return this.switchAnimation ? 'animate__fadeInRight' : 'animate__fadeOutRight';
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}
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

//.input-box {
//  position: fixed !important;
//  bottom: 0 !important;
//  left: 0 !important;
//  right: 0 !important;
//}
</style>
