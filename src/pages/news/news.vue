<template>
  <view>
    <drop-down-menu
      :is-show-menu="isShowMenu"
      first-text="加好友"
      last-text="清除未读"
      last-iconfont-class="icon-qingchu"
      first-iconfont-class="icon-sousuo"
      @close="changeIsShow"
      @clickOnTheFirst="addFriend"
      @clickTheLastOne="clearUnread"
    />
    <z-paging ref="paging" :fixed="true" refresher-only @onRefresh="query" :safe-area-inset-bottom="true" :delay="1000">
      <!-- #ifdef MP-WEIXIN-->
      <uni-nav-bar status-bar :border="false">
        <view slot="left" class="left-nav-bar" @tap="openFriendsPage">
          <view class="iconfont icon-user_icon"></view>
        </view>
        <view slot="default" class="center">消息</view>
      </uni-nav-bar>
      <!-- #endif   -->

      <view class="bar">
        <view class="item" @tap="openPraise">
          <image class="image" src="/static/like.png"></image>
          <view>点赞</view>
          <view class="new-attention-count" v-if="isShowLeftTopRedDot">{{ leftTopCount }}</view>
        </view>
        <view class="item" @tap="openNewAttention">
          <image class="image" src="/static/follow.png"></image>
          <view>新增关注</view>
          <view class="new-attention-count" v-if="isShowRightTopRedDot">{{ rightTopCount }}</view>
        </view>
      </view>
      <view class="list-box">
        <block v-for="(item, index) in dataList" :key="item.userId">
          <uni-swipe-action>
            <uni-swipe-action-item>
              <view>
                <!-- 聊天列表-->
                <news-list :data="item" @openChat="openChat($event, index)" />
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
    </z-paging>

    <!-- #ifdef MP-WEIXIN-->
    <post-an-article-btn @tap="addFriend" icon-class="icon-zengjia" />
    <!-- #endif-->
  </view>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import UniSwipeAction from '@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.vue';
import DropDownMenu from '@components/drop-down-menu/drop-down-menu.vue';
import { CHAT_LIST, NEWS_LIST, USER_NEW_ATTENTION_COUNT, USER_NEW_LIKE_COUNT } from '@common/constant/storage.constant';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import NewsNavBar from '@components/news/news-nav-bar.vue';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import PostAnArticleBtn from '@components/post-an-article-btn/post-an-article-btn.vue';
import ZPaging from '@components/z-paging/js/z-paging-main';

export interface INews {
  userId: number;
  username: string;
  content?: string | null;
  time: number;
  unreadCount: number;
  avatar: string;
}

const UserModule = namespace('userModule');

@Component({
  components: {
    ZPaging,
    PostAnArticleBtn,
    NewsNavBar,
    DropDownMenu,
    NewsList,
    UniSwipeAction,
    uniSwipeActionItem,
    UniNavBar,
  },
})
export default class News extends Mixins(CheckLoginMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private dataList: INews[] = [];

  private isShowMenu: boolean = false;
  // 新增关注右上方红点的数量
  private rightTopCount: number = 0;
  // 点赞左上方红点的数量
  private leftTopCount: number = 0;
  // 是否显示新增关注的右上方红点
  get isShowRightTopRedDot(): boolean {
    return this.rightTopCount > 0;
  }
  // 是否显示点赞左上方红点
  get isShowLeftTopRedDot(): boolean {
    return this.leftTopCount > 0;
  }

  created() {
    uni.$on('refresh-news', this.getStorage);
  }

  onShow() {
    uni.hideTabBarRedDot({ index: 2 });
    this.getStorage();
    this.dataList.forEach((item) => {
      item.time++;
    });
  }

  query() {
    uni.$emit('refreshSocket');
    setTimeout(() => {
      this.getStorage();
      (this.$refs.paging as any).complete(true);
    }, 1500);
  }

  async getStorage() {
    try {
      await this.determineId();
      this.getCache();
    } catch (err) {
      this.dataList = [];
      uni.showToast({ title: err.message, icon: 'none' });
    }
  }

  // 从缓存中读取数据
  getCache() {
    const data: INews[] | '' = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    const rightTopCount: number | '' = uni.getStorageSync(USER_NEW_ATTENTION_COUNT(this.userInfo.id));
    const leftTopCount: number | '' = uni.getStorageSync(USER_NEW_LIKE_COUNT(this.userInfo.id));

    typeof rightTopCount !== 'string' ? (this.rightTopCount = rightTopCount) : (this.rightTopCount = 0);
    typeof leftTopCount !== 'string' ? (this.leftTopCount = leftTopCount) : (this.leftTopCount = 0);
    typeof data !== 'string' ? (this.dataList = data) : (this.dataList = []);
  }

  // 确定userinfo的id存在 如果不存在则等到存在在执行
  async determineId() {
    await new Promise((resolve, reject) => {
      let num: number = 0;
      const getStorageTimer: number = setInterval(() => {
        num++;
        if (num === 5) {
          clearInterval(getStorageTimer);
          reject(new Error('未登录'));
        }
        if (this.userInfo.id) {
          clearInterval(getStorageTimer);
          resolve('');
        }
      }, 100);
    });
  }
  // 改变加好友弹框的显示状态
  changeIsShow() {
    this.isShowMenu = false;
  }

  // 点击聊天列表的某一项 进入聊天列表
  openChat(id: number, index: number) {
    uni.navigateTo({
      url: `/pages/chat/chat?id=${id}&username=${this.dataList[index].username}`,
    });
  }

  // 打开查看点赞页面
  openPraise() {
    uni.navigateTo({ url: '/pages/praise/praise' });
  }

  // 点击添加好友
  addFriend() {
    this.changeIsShow();
    uni.navigateTo({ url: '/pages/add-friend/add-friend' });
  }

  // 打开新增关注页面
  openNewAttention() {
    uni.navigateTo({ url: '/pages/new-attention/new-attention' });
  }

  // 清除未读
  clearUnread() {
    this.dataList.forEach((item) => {
      item.unreadCount = 0;
    });
    uni.getStorage({
      key: NEWS_LIST(this.userInfo.id),
      success: (res: { data: INews[] }) => {
        const list = res.data.map((item) => ({ ...item, unreadCount: 0 }));
        uni.setStorage({
          key: NEWS_LIST(this.userInfo.id),
          data: list,
        });
      },
    });
    uni.setStorage({
      key: USER_NEW_LIKE_COUNT(this.userInfo.id),
      data: 0,
    });
    uni.setStorage({
      key: USER_NEW_ATTENTION_COUNT(this.userInfo.id),
      data: 0,
    });

    this.rightTopCount = 0;
    this.leftTopCount = 0;
    this.changeIsShow();
    uni.showToast({ title: '清除成功' });
  }

  // 点击拉取出来的删除按钮触发
  clickDelete(index: number) {
    this.dataList.splice(index, 1);
    uni.setStorage({ key: NEWS_LIST(this.userInfo.id), data: this.dataList });
    uni.removeStorage({ key: CHAT_LIST(this.userInfo.id, this.dataList[index].userId) });
  }

  //   原生导航栏点击监听
  onNavigationBarButtonTap(d: { index: number }) {
    if (d.index === 0) {
      this.openFriendsPage();
    } else {
      // 显示添加好友弹框
      this.isShowMenu = true;
    }
  }
  //  打开好友页面
  openFriendsPage() {
    uni.navigateTo({ url: '/pages/friends/friends' });
  }
}
</script>

<style lang="scss" scoped>
.center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bar {
  display: flex;
  align-items: center;

  .item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    font-size: 30rpx;

    .new-attention-count {
      @include centered;
      position: absolute;
      right: 50%;
      top: 50%;
      transform: translate(160%, -135%);
      background: #dd524d;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      color: #ffffff;
      font-size: 28rpx;
    }

    .image {
      width: 60rpx;
      height: 60rpx;
      margin-bottom: 10rpx;
    }
  }
}
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
