<template>
  <view>
    <!--     导航栏-->
    <uni-nav-bar status-bar class="nav-bar-height">
      <view slot="left" @tap="comeBack" class="iconfont icon-fanhui" hover-class="hover"></view>
      <view slot="right" @tap="openPersonal" class="right" hover-class="hover">
        <view class="iconfont icon-geren"></view>
      </view>
    </uni-nav-bar>
    <!--内容-->
    <scroll-view
      id="scroll-view-chat"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      :scroll-y="true"
      :style="{ height: scrollHeight }"
    >
      <block v-for="(item, index) in chatDataArr" :key="index">
        <chat-list class="chat-list-chat" :data="item" :pre-time="chatDataPreTime(index)"></chat-list>
      </block>
    </scroll-view>

    <!-- 输入框-->
    <chat-input-btn class="input-box" @confirm="confirm"></chat-input-btn>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import ChatList from '@pages/news/components/chat-list/chat-list.vue';

@Component({ components: { ChatList, ChatInputBtn, UniNavBar } })
export default class Chat extends Vue {
  // 所有可视区域高度
  private windowHeight: number = 0;
  // navBar的高度
  private navBarHeight: number = 0;
  // inputBox的高度
  private inputBoxHeight: number = 0;
  // 聊天框的上方卷曲的高度
  private scrollTop: number = 0;
  // 记录内容的总高度
  private contentHeight: number = 0;
  // 记录
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
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
      },
    });
  }

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getHeight().then(() => {
          this.getChatListHeight();
        });
      }, 200);
    });
  }

  // 获取每一个信息组件的高度 然后赋值给 scrollTop
  getChatListHeight() {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery();
      query.selectAll('.chat-list-chat').boundingClientRect();
      query.exec((res?: [{ height: number }[]]) => {
        if (res) {
          // eslint-disable-next-line no-restricted-syntax
          for (const item of res[0]) {
            this.contentHeight += item.height;
          }

          if (this.contentHeight > parseInt(this.scrollHeight.replace('px', ''), 10)) {
            this.scrollTop = this.contentHeight;
            // + this.navBarHeight
            resolve({});
          }
        }
      });
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

  // 搜索点击提交或手机键盘点击发送触发
  confirm(value: string) {
    this.chatDataArr.push({
      isMe: true,
      avatar: '/static/demo/userpic/1.jpg',
      type: 'text', // 发送内容的类型
      content: value, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime(), // 时间戳
    });

    this.$nextTick(() => {
      this.getChatListHeight();
    });
  }

  getHeight() {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery();
      query.select('.nav-bar-height').boundingClientRect();
      query.select('.input-box').boundingClientRect();
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
