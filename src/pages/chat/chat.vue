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

    <scroll-view
      id="scroll-view-chat"
      style="transition: all 0.3s"
      :scroll-with-animation="true"
      :scroll-top="scrollTop"
      :scroll-y="true"
      :style="{ height: scrollHeight }"
    >
      <view class="chat-list-chat">
        <block v-for="(item, index) in chatDataList" :key="index">
          <chat-list :data="item" :pre-time="chatDataPreTime(index)"></chat-list>
        </block>
        <!--        <view @tap="test">haha</view>-->
      </view>
    </scroll-view>

    <!-- 输入框-->
    <view :style="{ height: `${inputExpandedHeight}rpx` }" class="input-box">
      <chat-input-btn @confirm="confirm">
        <view slot="left" class="voice-box" @tap="changeInputType">
          <image :src="inputIconSrc" class="voice"></image>
        </view>
        <template v-if="!inputType">
          <view slot="center" class="send-voice" hover-class="send-voice-hover">发送语音</view>
        </template>
        <view slot="right" class="control">
          <view class="last" @tap="expandDropDownMenu(true)">+</view>
        </view>
      </chat-input-btn>
      <!-- 下拉菜单的内容-->
      <view class="drop-down-menu">
        <block v-for="(item, index) in dropDownMenuData" :key="item.image">
          <view class="send-other" @tap="selectFile(index)">
            <view class="image-box">
              <image :src="item.image" class="send-other-image"></image>
            </view>
            <view class="send-text">{{ item.text }}</view>
          </view>
        </block>
      </view>
    </view>
    <view class="mask" v-show="isShowInputDropDownMenuMask" @tap="expandDropDownMenu(false)"></view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import ChatList, { ContentType } from '@pages/news/components/chat-list/chat-list.vue';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { CHAT_LIST, NEWS_LIST, TOKEN_KEY } from '@common/constant/storage.constant';
import { INews } from '@pages/news/news.vue';
import { UPLOAD_IMAGE_URL, UPLOAD_VIDEO_URL } from '@common/constant/upload-path.constant';
import { IResponse } from '@services/interface/response.interface';
import RoundScheduleProgress from '@components/round-schedule-progress/round-schedule-progress.vue';

export interface IChat {
  isMe: boolean;
  avatar: string;
  type: ContentType; // 发送内容的类型
  content: string; // 如果是文字内容那么内容就是文字 如果是图片内容 内容就是url
  time: number; // 时间戳
  user?: IUser;
  targetUserId?: number;
  progressRate?: number;
  errorState?: boolean;
}

enum InputBoxHeight {
  // 默认input高度
  default = 80,
  // 展开高度
  expansion = 260,
}

enum SelectFileType {
  //  图片
  image,
  //  视频
  video,
  //  拍摄
  screen,
}

const UserModule = namespace('userModule');
let timer: number | undefined;
let timer2: number | undefined;
// let height: number | undefined;
@Component({ components: { RoundScheduleProgress, ChatList, ChatInputBtn, UniNavBar } })
// export default class Chat extends Mixins(WebsocketMixin) {
export default class Chat extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;

  private dropDownMenuData: { image: string; text: string }[] = [
    { image: '/static/image.png', text: '图片' },
    { image: '/static/video.png', text: '视频' },
    { image: '/static/screen.png', text: '拍摄' },
  ];
  // 所有可视区域高度
  private windowHeight: number = 0;
  // navBar的高度
  private navBarHeight: number = 0;
  // 获取的inputBox的高度
  private inputBoxHeight: number = 0;
  // 聊天框的上方卷曲的高度
  private scrollTop: number = 0;
  // 聊天的数据
  private chatDataList: IChat[] = [];
  private targetId: number = 0;
  // 当前是否处于发送文本状态
  private inputType: boolean = true;
  // 输入框下拉菜单展开时高度或收起的高度 也可以用来判断当前是展开状态还是默认状态
  private inputExpandedHeight: InputBoxHeight = InputBoxHeight.default;
  // 输入框下拉展开的蒙版 用于点击隐藏下拉菜单
  private isShowInputDropDownMenuMask: boolean = false;
  // 开关动画
  private switchAnimation: boolean = true;
  //  控制动画
  get animationClassName(): string {
    return this.switchAnimation ? 'animate__fadeInRight' : 'animate__fadeOutRight';
  }
  // 语音输入和文本输入的图片
  get inputIconSrc(): string {
    return this.inputType ? '/static/voice.png' : '/static/keyboard.png';
  }
  // scroll-view的高度
  get scrollHeight(): string {
    return `${this.windowHeight - this.navBarHeight - +this.inputBoxHeight.toFixed(0)}px`;
  }

  created() {
    this.acceptEvent();
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
      },
    });
    this.getPageData();
    //  获取本地缓存
    this.getCache();
  }

  mounted() {
    this.$nextTick(() => {
      this.getHeight();
      this.preventJitter();
    });
  }

  // 选择本地文件发送
  async selectFile(type: SelectFileType) {
    switch (type) {
      case SelectFileType.image:
        uni.chooseImage({
          count: 1,
          sizeType: 'original',
          sourceType: ['album'],
          success: (res: any) => {
            this.handlerSuccess(ContentType.image)(res);
          },
        });
        break;
      case SelectFileType.screen:
        const itemList: string[] = ['拍摄视频', '拍摄照片'];
        const result: number | unknown = await new Promise((resolve, reject) => {
          uni.showActionSheet({
            itemList,
            success: (res) => {
              resolve(res.tapIndex);
            },
            fail: () => {
              reject(new Error(''));
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        }).catch(() => {});

        if (typeof result === 'undefined') {
          return;
        }
        if (result === 0) {
          uni.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 10,
            success: (res) => {
              this.handlerSuccess(ContentType.video)(res);
            },
          });
        } else {
          uni.chooseImage({
            count: 1,
            sizeType: 'original',
            sourceType: ['camera'],
            success: (res: any) => {
              const flag: boolean = this.checkFileSize(res.tempFiles[res.tempFiles.length - 1].size, 5242880);
              if (flag) {
                this.handlerSuccess(ContentType.image)(res);
              }
            },
          });
        }
        break;
      case SelectFileType.video:
        uni.chooseVideo({
          sourceType: ['album'],
          maxDuration: 10,
          success: (res) => {
            this.handlerSuccess(ContentType.video)(res);
          },
        });
        break;
      default:
    }
  }

  // 展开或隐藏下拉菜单
  expandDropDownMenu(type: boolean) {
    this.inputExpandedHeight = type ? InputBoxHeight.expansion : InputBoxHeight.default;
    this.isShowInputDropDownMenuMask = type;
    // 定时器是因为动画需要.3s 等动画完毕后设置高度
    setTimeout(() => {
      this.getHeight();
      this.preventJitter();
    }, 310);
  }

  // 更改输入类型
  changeInputType() {
    this.inputType = !this.inputType;
  }

  // 接受app页面的事件刷新本页面
  acceptEvent() {
    uni.$on('newChat', () => {
      this.getCache();
    });
  }

  // 获取上个页面携带的id
  getPageData() {
    const pages: any = getCurrentPages();
    const {
      options: { id },
    } = pages[pages.length - 1];
    this.targetId = +id;
  }

  handlerSuccess(type: ContentType) {
    const data = (filePath: string): IChat => ({
      isMe: true,
      avatar: this.userInfo.avatar,
      content: filePath,
      time: new Date().getTime(),
      type,
      targetUserId: this.targetId,
      progressRate: 0,
    });
    return (res: any) => {
      const filePath: string = res.tempFilePath || res.tempFilePaths[res.tempFilePaths.length - 1];
      const sendData: IChat = data(filePath);
      // 记录当前数据插入时的位置
      const length = this.chatDataList.length;
      this.chatDataList.push(sendData);
      // 防抖获取高度
      this.preventJitter();

      const success = (ress: any) => {
        const uploadRes: IResponse<any> = JSON.parse(ress.data);
        const handlerError = (msg: string) => {
          uni.showToast({ title: msg, icon: 'none' });
          const middle: IChat = { ...this.chatDataList[length] };
          middle.errorState = true;
          middle.progressRate = undefined;
          this.$set(this.chatDataList, length, middle);
        };
        if (uploadRes.statusCode === 400) {
          handlerError(uploadRes.message);
          return;
        }
        if (type === ContentType.video && uploadRes.data.fileNotSupported.length > 0) {
          handlerError(`不支持的文件:${uploadRes.data.fileNotSupported}`);
          return;
        }
        const responseFormat = (): string => {
          if (type === ContentType.video) {
            return uploadRes.data.success[uploadRes.data.success.length - 1].videoUrl;
          }
          return uploadRes.data.success[uploadRes.data.success.length - 1];
        };
        // 把发送给服务端的content 设置成当前文件上传到服务器的返回的url
        sendData.content = responseFormat();
        // 向服务端发送消息
        uni.$emit('sendMsg', {
          event: 'chatMessage',
          data: sendData,
        });
        //  存入缓存
        this.handlerSendChat(sendData);
      };
      const fail = () => {
        uni.showToast({ title: '发送失败', icon: 'none' });
        const middle: IChat = { ...this.chatDataList[length] };
        middle.errorState = true;
        middle.progressRate = undefined;
        this.$set(this.chatDataList, length, middle);
      };
      const task: UniApp.UploadTask = this.upload(type === ContentType.image ? 0 : 1, filePath, success, fail);
      // 监听上传进度
      task.onProgressUpdate((res) => {
        this.chatDataList[length].progressRate = res.progress;
      });
    };
  }

  // 上传文件
  upload(type: 0 | 1, filePath: string, success: (ress: any) => void, fail: () => void): UniApp.UploadTask {
    return uni.uploadFile({
      name: 'files',
      url: type === 0 ? UPLOAD_IMAGE_URL : UPLOAD_VIDEO_URL,
      header: {
        Authorization: `Bearer ${uni.getStorageSync(TOKEN_KEY)}`,
      },
      filePath,
      success,
      fail,
    });
  }

  // 搜索点击提交或手机键盘点击发送触发
  confirm(value: string) {
    if (this.targetId === 0) return;
    const data: IChat = {
      isMe: true,
      avatar: this.userInfo.avatar,
      type: ContentType.text, // 发送内容的类型
      content: value, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: new Date().getTime(), // 时间戳
      targetUserId: this.targetId,
    };
    this.chatDataList.push(data);

    this.handlerSendChat(data);
    uni.$emit('sendMsg', {
      event: 'chatMessage',
      data,
    });
  }

  handlerSendChat(chat: IChat) {
    // 防抖获取高度
    this.preventJitter();
    const a = { ...chat };
    if (a.progressRate) {
      delete a.progressRate;
    }
    //  存入缓存
    this.saveCache(a);
  }

  preventJitter() {
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
    const findIndex: number = d.findIndex((item) => item.userId === this.targetId);
    d[findIndex].content = data.content;
    d[findIndex].time = data.time;

    if (data.type === ContentType.image) {
      d[findIndex].content = '图片';
    }

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
    const d: INews[] = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    const findIndex: number = d.findIndex((item) => item.userId === this.targetId);
    d[findIndex].unreadCount = 0;
    uni.setStorage({ key: NEWS_LIST(this.userInfo.id), data: d });

    const chatList: IChat[] | '' = uni.getStorageSync(CHAT_LIST(this.userInfo.id, this.targetId));
    if (chatList) {
      this.chatDataList = chatList;
      // 防抖获取高度
      this.preventJitter();
    }
  }
  // 获取每一个信息组件的高度 然后赋值给 scrollTop
  getChatListHeight() {
    const query = uni.createSelectorQuery().in(this).select('.chat-list-chat');
    query
      .boundingClientRect((res) => {
        if (res?.height) {
          if (res.height > parseInt(this.scrollHeight.replace('px', ''), 10)) {
            this.scrollTop = res.height + Math.random() * 10 + 1!;
          }
        }
      })
      .exec();
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

  // 检查文件大小
  checkFileSize(a: number, b: number) {
    if (a > b) {
      uni.showToast({ title: '图片太大了,换一张吧', icon: 'none' });
      return false;
    }
    return true;
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

.voice-box {
  width: 50rpx;
  height: 50rpx;
  box-sizing: border-box;
  padding-top: 5rpx;
  padding-right: 5rpx;
  .voice {
    @include centered;
    width: 100%;
    height: 100%;
  }
}

.input-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #ececec;

  .send-voice {
    @include centered;
    flex-grow: 1;
    font-size: 30rpx;
    background: #f7f7f7;
  }
  .send-voice-hover {
    background: #e5e5e5;
  }
  .control {
    @include centered;
    width: 50rpx;
    height: 50rpx;
    font-size: 50rpx;
  }

  .drop-down-menu {
    display: flex;
    align-items: center;
    .send-other {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      margin: 20rpx;
      .image-box {
        border-radius: 20rpx;
        @include centered;
        width: 100rpx;
        height: 100rpx;
        background: #ffffff;
        .send-other-image {
          width: 60rpx;
          height: 60rpx;
        }
      }
      .send-text {
        margin-top: 8rpx;
      }
    }
  }
}

.mask {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  opacity: 0;
  z-index: 1;
}
</style>
