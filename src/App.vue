<script lang="ts">
import { UserStoreActionType } from '@store/module/user/constant';
import {
  CHAT_LIST,
  NEWS_LIST,
  TOKEN_KEY,
  USER_NEW_ATTENTION_COUNT,
  USER_NEW_LIKE_COUNT,
} from '@common/constant/storage.constant';

import { Component, Mixins } from 'vue-property-decorator';
import WebsocketMixin, { ISocketMessage, WebsocketMixinAbstract } from '@src/mixins/websocket.mixin';
import { IChat } from '@pages/chat/chat.vue';
import { INews } from '@pages/news/news.vue';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { ContentType } from '@pages/news/components/chat-list/chat-list.vue';

const UserModule = namespace('userModule');

@Component({
  mpType: 'app',
})
export default class extends Mixins(WebsocketMixin) implements WebsocketMixinAbstract {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  @UserModule.State('newAttentionCount')
  private readonly newAttentionCount!: number;
  @UserModule.Action(UserStoreActionType.GET_USER_INFO)
  private readonly getUserInfo!: () => void;

  async onLaunch() {
    const token: string | '' = uni.getStorageSync(TOKEN_KEY);
    if (token) {
      // 获取用户信息 并且得到用户的数据
      await this.getUserInfo();
    }
  }

  async created() {
    this.onEvent();
    //  获取当前小红点的数量
    this.getCount();
  }

  // 监听事件
  onEvent() {
    uni.$on('initSocket', () => {
      this.initWebsocket();
    });
    uni.$on('sendMsg', this.sendMessage);
    uni.$on('closeSocket', () => {
      this.close();
    });
  }

  watchMessage(msg: ISocketMessage) {
    switch (msg.event) {
      // 离线消息
      case 'offlineMsg':
        msg.data.forEach((item: IChat[]) => {
          this.saveChatMessage(item);
        });
        break;
      case 'offlineFollowCount':
        this.handlerOfflineFollowCount(msg, USER_NEW_ATTENTION_COUNT(this.userInfo.id));
        uni.$emit('refresh-news');
        break;
      case 'offlineLikeCount':
        this.handlerOfflineFollowCount(msg, USER_NEW_LIKE_COUNT(this.userInfo.id));
        uni.$emit('refresh-news');
        break;
      //  消息
      case 'chatMessage':
        this.saveChatMessage(msg.data);
        // 更新news页面的tabbar角标和消息列表 让其读取缓存
        uni.$emit('refresh-news');
        // 通知chat页面有新消息 让其读取缓存
        uni.$emit('newChat');
        break;
      case 'error':
        uni.showToast({ title: msg.data.msg, icon: 'none' });
        break;
      default:
    }
  }

  saveChatMessage(data: any) {
    // 判断缓存中是否存在聊天列表
    const newsList: INews[] | '' = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    const news: INews = {
      userId: data.user.id,
      username: data.user.username,
      content: data.content,
      time: data.time,
      unreadCount: 1,
      avatar: data.user.avatar,
    };
    if (data.type === ContentType.image) {
      news.content = '图片';
    }

    if (newsList) {
      // 判断聊天列表中是否存在和当前用户的聊天记录
      const findIndex: number = newsList.findIndex((item) => item.userId === data.user.id);
      if (findIndex !== -1) {
        // 存在聊天记录 把聊天列表中的数据提出
        const newss: INews[] = newsList.splice(findIndex, 1);
        // 未读消息++
        news.unreadCount = ++newss[0].unreadCount;
        // 把新数据放到最前面
        newsList.unshift(news);
        // 保存
        uni.setStorageSync(NEWS_LIST(this.userInfo.id), newsList);
      } else {
        // 不存在 直接把当前聊天记录放最前面
        newsList.unshift(news);
        uni.setStorageSync(NEWS_LIST(this.userInfo.id), newsList);
      }
      this.getCount();
    } else {
      uni.setStorageSync(NEWS_LIST(this.userInfo.id), [news]);
      this.getCount();
    }

    const chat: IChat = {
      isMe: false,
      avatar: data.avatar,
      type: data.type, // 发送内容的类型
      content: data.content, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
      time: data.time, // 时间戳
      user: data.user,
    };

    const chatList: IChat[] = uni.getStorageSync(CHAT_LIST(this.userInfo.id, data.user.id));
    if (!chatList) {
      uni.setStorageSync(CHAT_LIST(this.userInfo.id, data.user.id), [chat]);
    } else {
      chatList.push(chat);
      uni.setStorageSync(CHAT_LIST(this.userInfo.id, data.user.id), chatList);
    }
  }

  // 处理离线点赞数量和离线关注数量
  handlerOfflineFollowCount(msg: ISocketMessage, key: string) {
    const count: number | '' = uni.getStorageSync(key);
    let newCount: number;
    typeof count !== 'string' ? (newCount = count + msg.data) : (newCount = msg.data);
    uni.setStorageSync(key, newCount);
    this.getCount();
  }

  // 获取小红点的数量
  getCount() {
    let sumCount: number = 0;
    const newsList: INews[] | '' = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    const followCount: number | '' = uni.getStorageSync(USER_NEW_ATTENTION_COUNT(this.userInfo.id));
    const likeCount: number | '' = uni.getStorageSync(USER_NEW_LIKE_COUNT(this.userInfo.id));
    if (typeof newsList !== 'string') {
      newsList.forEach((item) => {
        sumCount += item.unreadCount;
      });
    }
    if (typeof followCount !== 'string') {
      sumCount += followCount;
    }
    if (typeof likeCount !== 'string') {
      sumCount += likeCount;
    }
    this.showMsgCount(sumCount);
  }

  showMsgCount(count: number) {
    uni.setTabBarBadge({ index: 2, text: `${count}` });
  }

  onShow() {
    // console.log('App Show');
    // uni.getNetworkType({
    //   success(res) {
    //     console.log(res.networkType, 123);
    //   },
    // });
    // uni.onNetworkStatusChange((res) => {
    //   uni.showToast({ title: '网络错误', icon: 'none', duration: 2000 });
    // });
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHide() {}
}

// export default Vue.extend({
//   mpType: 'app',
//   async onLaunch() {
//     const token: string | '' = uni.getStorageSync(TOKEN_KEY);
//     if (token) {
//       // 获取用户信息 并且得到用户的数据
//       await this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.GET_USER_INFO}`);
//       //  得到websocket连接
//     }
//   },
//   onShow() {
//     // console.log('App Show');
//     // uni.getNetworkType({
//     //   success(res) {
//     //     console.log(res.networkType, 123);
//     //   },
//     // });
//     // uni.onNetworkStatusChange((res) => {
//     //   uni.showToast({ title: '网络错误', icon: 'none', duration: 2000 });
//     // });
//   },
//   onHide() {
//     // console.log('App Hide');
//   },
// });
</script>

<style lang="scss">
/*每个页面公共css */
/* 引入uni的css */
//@import './common/style/uni.css';

/* 引入iconfont 图标库 */
@import './common/style/icon.css';

/* 引入animate css3动画库*/
/* #ifndef MP-WEIXIN */
@import '~animate.css';
/*  #endif  */

/* #ifdef MP-WEIXIN */
@import './common/style/animate.min.css';
/* #endif */

//.uni-page-body,
//html,
//body {
//  height: 100%;
//}
</style>
