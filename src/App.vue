<script lang="ts">
import { ModuleConstant } from '@store/module.constant';
import { UserStoreActionType } from '@store/module/user/constant';
import { CHAT_LIST, NEWS_LIST, TOKEN_KEY } from '@common/constant/storage.constant';

import { Component, Mixins, Watch } from 'vue-property-decorator';
import WebsocketMixin, { ISocketMessage } from '@src/mixins/websocket.mixin';
import { IChat } from '@pages/chat/chat.vue';
import { INews } from '@pages/news/news.vue';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';

const UserModule = namespace('userModule');

@Component({
  mpType: 'app',
})
export default class extends Mixins(WebsocketMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  // 消息页面tabBar右上角的未读数量
  private unreadCount: number = 0;

  created() {
    uni.$on('chat', (currentIsChatPage: boolean) => {
      if (currentIsChatPage) {
        this.close();
      } else {
        this.initWebsocket();
      }
    });
  }

  async onLaunch() {
    uni.setTabBarBadge({ index: 2, text: `${this.unreadCount}` });
    const token: string | '' = uni.getStorageSync(TOKEN_KEY);
    if (token) {
      // 获取用户信息 并且得到用户的数据
      await this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.GET_USER_INFO}`);
      //  得到websocket连接
    }
  }

  // @Watch('message')
  watchMessage(msg: ISocketMessage) {
    if (msg.event === 'unreadMsgCount') {
    }
    if (msg.event === 'chatMessage') {
      // 判断缓存中是否存在此人和当前用户的会话
      const newsList: INews[] | '' = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
      const news: INews = {
        id: msg.data.user.id,
        username: msg.data.user.username,
        content: msg.data.content,
        time: msg.data.time,
        unreadCount: 1,
        avatar: msg.data.user.avatar,
      };
      const data: IChat = {
        isMe: false,
        avatar: msg.data.avatar,
        type: msg.data.type, // 发送内容的类型
        content: msg.data.content, // 如果是文字内容那么内容就是文字 如果是图片内容 内容就url
        time: msg.data.time, // 时间戳
        user: msg.data.user,
      };
      if (newsList) {
        const findIndex: number = newsList.findIndex((item) => item.id === msg.data.user.id);
        if (findIndex !== -1) {
          const news: INews[] = newsList.splice(findIndex, 1);
          news[0].unreadCount++;
          newsList.unshift(news[0]);
          uni.setStorageSync(NEWS_LIST(this.userInfo.id), newsList);
        } else {
          newsList.unshift(news);
          uni.setStorageSync(NEWS_LIST(this.userInfo.id), newsList);
        }
      } else {
        uni.setStorageSync(NEWS_LIST(this.userInfo.id), [news]);
      }

      const chatList: IChat[] = uni.getStorageSync(CHAT_LIST(this.userInfo.id, msg.data.user.id));
      if (!chatList) {
        uni.setStorageSync(CHAT_LIST(this.userInfo.id, msg.data.user.id), [data]);
      } else {
        chatList.push(data);
        uni.setStorageSync(CHAT_LIST(this.userInfo.id, msg.data.user.id), chatList);
      }
    }
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
