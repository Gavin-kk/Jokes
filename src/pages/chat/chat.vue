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
      :scroll-with-animation="true"
      :scroll-top="scrollTop"
      :scroll-y="true"
      :style="{ height: scrollHeight }"
    >
      <view class="chat-list-chat">
        <!--        finishedRendering是为了判断这个循环是否渲染完毕 如果渲染完毕就获取他的高度 并返回 索引-->
        <block v-for="(item, index) in chatDataList" :key="index">
          <chat-list :data="item" :pre-time="chatDataPreTime(index)"></chat-list>
        </block>
        <view @tap="test">haha</view>
      </view>
    </scroll-view>
    <!-- 输入框-->
    <chat-input-btn class="input-box" @confirm="confirm"></chat-input-btn>
  </view>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Emit } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import ChatList, { ContentType } from '@pages/news/components/chat-list/chat-list.vue';
import WebsocketMixin, { IReadState, ISocketMessage } from '@src/mixins/websocket.mixin';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { CHAT_LIST, NEWS_LIST, TOKEN_KEY } from '@common/constant/storage.constant';
import { BASE_URL } from '@config/service.config';
import { INews } from '@pages/news/news.vue';

export interface IChat {
  isMe: boolean;
  avatar: string;
  type: ContentType; // 发送内容的类型
  content: string; // 如果是文字内容那么内容就是文字 如果是图片内容 内容就是url
  time: number; // 时间戳
  user?: IUser;
}

const UserModule = namespace('userModule');
let timer: number | undefined;
let timer2: number | undefined;
// let height: number | undefined;
@Component({ components: { ChatList, ChatInputBtn, UniNavBar } })
export default class Chat extends Mixins(WebsocketMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  // 所有可视区域高度
  private windowHeight: number = 0;
  // navBar的高度
  private navBarHeight: number = 0;
  // inputBox的高度
  private inputBoxHeight: number = 0;
  // 聊天框的上方卷曲的高度
  private scrollTop: number = 0;
  // 聊天的数据
  private chatDataList: IChat[] = [];
  private targetId: number = 0;

  @Watch('readState')
  watchReadte(newState: IReadState) {
    // console.log(newState);
  }

  @Watch('message')
  watchMessages(msg: ISocketMessage) {
    switch (msg.event) {
      case 'auth':
        break;
      case 'chatMessage':
        // eslint-disable-next-line no-case-declarations
        const data: IChat = {
          isMe: false,
          avatar: msg.data.avatar,
          type: msg.data.type, // 发送内容的类型
          content: msg.data.content, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
          time: msg.data.time, // 时间戳
          user: msg.data.user,
        };
        this.chatDataList.push(data);
        this.saveCache(data);
        if (typeof timer !== 'undefined') {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.getChatListHeight();
          }, 500);
          return;
        }
        timer = setTimeout(() => {
          this.getChatListHeight();
        }, 500);
        break;
      case 'error':
        console.log(msg, 'error');
        break;
      default:
    }
  }

  created() {
    uni.$emit('chat', true);
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
      },
    });
    this.getPageData();
    //  获取本地缓存
    this.getCache();
  }

  destroyed() {
    uni.$emit('chat', false);
  }

  mounted() {
    this.getHeight();
    setTimeout(() => {
      this.getChatListHeight();
    }, 200);
  }

  onUnload() {
    this.close();
  }

  // 获取上个页面携带的id
  getPageData() {
    const pages: any = getCurrentPages();
    const {
      options: { id },
    } = pages[pages.length - 1];
    this.targetId = +id;
  }

  test() {
    uni.chooseImage({
      success: (res) => {
        uni.showLoading({});
        this.chatDataList.push({
          isMe: true,
          avatar: this.userInfo.avatar,
          type: ContentType.image, // 发送内容的类型
          content: res.tempFilePaths[res.tempFilePaths.length - 1], // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
          time: new Date().getTime(), // 时间戳
        });
        uni.uploadFile({
          name: 'files',
          url: `${BASE_URL}/api/v1/upload/images`,
          header: {
            Authorization: `Bearer ${uni.getStorageSync(TOKEN_KEY)}`,
          },
          filePath: res.tempFilePaths[res.tempFilePaths.length - 1],
          success: (res) => {
            const uploadRes = JSON.parse(res.data);
            const data: IChat = {
              isMe: true,
              avatar: this.userInfo.avatar,
              content: uploadRes.data.success[0],
              time: new Date().getTime(),
              type: ContentType.image,
            };
            this.sendMessage({
              event: 'chatMessage',
              data,
            });
            //  存入缓存
            this.saveCache(data);
            this.$nextTick(() => {
              this.getChatListHeight();
            });
            uni.hideLoading();
          },
          fail: () => {
            uni.showToast({ title: '发送失败', icon: 'none' });
            uni.hideLoading();
          },
        });
      },
    });
  }

  // 搜索点击提交或手机键盘点击发送触发
  confirm(value: string) {
    if (this.targetId === 0) return;
    const time = new Date().getTime();
    this.sendMessage({
      event: 'chatMessage',
      data: { content: value, type: ContentType.text, avatar: this.userInfo.avatar, time, targetUserId: this.targetId },
    });
    const data: IChat = {
      isMe: true,
      avatar: this.userInfo.avatar,
      type: ContentType.text, // 发送内容的类型
      content: value, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time, // 时间戳
    };
    this.chatDataList.push(data);
    // 防抖获取高度
    this.throttling();
    //  存入缓存
    this.saveCache(data);
  }

  throttling() {
    if (typeof timer2 !== 'undefined') {
      clearTimeout(timer2);
      timer2 = setTimeout(() => {
        this.getChatListHeight();
      }, 200);
    }
    timer2 = setTimeout(() => {
      this.getChatListHeight();
    }, 200);
  }

  // 存入本地缓存
  saveCache(data: IChat) {
    // 更新news列表的内容和时间
    const d: INews[] = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    const findIndex: number = d.findIndex((item) => item.id === this.targetId);
    d[findIndex].content = data.content;
    d[findIndex].time = data.time;
    uni.setStorage({ key: NEWS_LIST(this.userInfo.id), data: d });

    // 判断本地缓存中是否存在当前聊天会话
    const chatList = uni.getStorageSync(CHAT_LIST(this.userInfo.id, this.targetId));
    if (!chatList) {
      uni.setStorageSync(CHAT_LIST(this.userInfo.id, this.targetId), [data]);
    } else {
      chatList.push(data);
      uni.setStorageSync(CHAT_LIST(this.userInfo.id, this.targetId), chatList);
    }
  }
  // 获取本地缓存
  async getCache() {
    await new Promise((resolve) => {
      const getStorageTimer: number = setInterval(() => {
        if (this.userInfo?.id) {
          clearInterval(getStorageTimer);
          resolve('');
        }
      }, 100);
    });
    const chatList: IChat[] | '' = uni.getStorageSync(CHAT_LIST(this.userInfo.id, this.targetId));
    if (chatList) {
      this.chatDataList = chatList;
    }
  }
  // 获取每一个信息组件的高度 然后赋值给 scrollTop
  getChatListHeight() {
    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this).select('.chat-list-chat');
      query
        .boundingClientRect((res) => {
          if (res?.height) {
            if (res.height > parseInt(this.scrollHeight.replace('px', ''), 10)) {
              this.scrollTop = res.height;
            }
          }
        })
        .exec();
    });

    // this.scrollTop = height as number;
  }

  chatDataPreTime(index: number) {
    return index > 0 ? this.chatDataList[index - 1].time : 0;
  }

  comeBack() {
    uni.navigateBack({ delta: 1 });
  }

  openPersonal() {
    uni.showToast({ title: '进入个人页' });
  }

  getHeight() {
    const query = uni.createSelectorQuery();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    query.select('.nav-bar-height').boundingClientRect(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    query.select('.input-box').boundingClientRect(() => {});
    query.exec((result?: { height: number }[]) => {
      if (result) {
        this.navBarHeight = result[0]?.height;
        this.inputBoxHeight = result[1]?.height;
      }
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
