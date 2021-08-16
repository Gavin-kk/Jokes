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
    <view class="list-box">
      <block v-for="(item, index) in dataList" :key="item.id">
        <uni-swipe-action>
          <uni-swipe-action-item>
            <view>
              <!-- 聊天列表-->
              <news-list :data="item" @openChat="openChat" />
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
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import UniSwipeAction from '@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.vue';
import DropDownMenu from '@components/drop-down-menu/drop-down-menu.vue';
import { NEWS_LIST } from '@common/constant/storage.constant';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';

export interface INews {
  id: number;
  username: string;
  content: string | null;
  time: number;
  unreadCount: number;
  avatar: string;
}

const UserModule = namespace('userModule');

@Component({ components: { DropDownMenu, NewsList, UniSwipeAction, uniSwipeActionItem } })
export default class News extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private dataList: INews[] = [];

  private isShowMenu: boolean = false;

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
    const data: INews[] = uni.getStorageSync(NEWS_LIST(this.userInfo.id));
    if (data) {
      this.dataList = data;
    } else {
      this.dataList = [];
    }
  }

  // 确定userinfo的id存在 如果不存在则等到存在在执行
  async determineId() {
    await new Promise((resolve, reject) => {
      let num: number = 0;
      const getStorageTimer: number = setInterval(() => {
        num++;
        if (num === 10) {
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
  openChat(id: number) {
    uni.navigateTo({
      url: `/pages/chat/chat?id=${id}`,
    });
  }

  // 点击添加好友
  addFriend() {
    this.changeIsShow();
    uni.showToast({ title: '添加好友' });
  }

  // 清除未读
  clearUnread() {
    this.dataList.forEach((item) => {
      item.unreadCount = 0;
    });
    this.changeIsShow();
    uni.showToast({ title: '清除未读' });
  }

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
      // this.dataList = [
      //   {
      //     id: +(Math.random() * 1000 + 1).toFixed(),
      //     username: '低头看云',
      //     content: '你干嘛呢, 嗯嗯嗯?',
      //     time: '13.50',
      //     unreadCount: 23,
      //     avatar: '/static/demo/userpic/8.jpg',
      //   },
      // ];
      uni.stopPullDownRefresh();
    }, 2000);
  }
  //   原生导航栏点击监听
  onNavigationBarButtonTap(d: { index: number }) {
    if (d.index === 0) {
      uni.showToast({ title: '进入好友列表' });
    } else {
      // 显示添加好友弹框
      this.isShowMenu = true;
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
