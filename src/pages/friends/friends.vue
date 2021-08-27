<template>
  <view>
    <nav-bar title="好友" page-path="/pages/news/news"></nav-bar>
    <view class="box">
      <block v-for="item in userList" :key="item.id">
        <news-list :data="item" @openChat.stop="openUser(item.id)" is-use-slot>
          <view slot="right">
            <view class="btn-box" @tap.stop="openChat(item)">聊天</view>
          </view>
        </news-list>
      </block>
      <template v-if="isEmpty">
        <empty />
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import { getAllMutualFollowingListsRequest } from '@services/follow.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { IUser } from '@store/module/user';
import { NEWS_LIST } from '@common/constant/storage.constant';
import { INews } from '@pages/news/news.vue';
import { namespace } from 'vuex-class';
import Empty from '@components/empty/empty.vue';

const UserModule = namespace('userModule');
@Component({
  components: { Empty, NewsList, NavBar },
})
export default class Friends extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private userList: IUser[] = [];

  get isEmpty(): boolean {
    return this.userList.length === 0;
  }

  created() {
    this.getData();
  }

  async getData() {
    const result: AxiosResponse<IResponse<any>> = await getAllMutualFollowingListsRequest();
    this.userList = result.data.data;
  }

  // 打开用户页面
  openUser(userId: number) {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${userId}` });
  }
  // 打开聊天页面
  async openChat(user: IUser) {
    await new Promise((resolve) => {
      uni.getStorage({
        key: NEWS_LIST(this.userInfo.id),
        success: (res) => {
          const data: INews[] = res.data;
          const isExists: number = data.findIndex((item) => item.userId === user.id!);
          if (isExists === -1) {
            data.unshift({
              userId: user.id!,
              username: user.username!,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: user.avatar!,
            });
          } else {
            const news = data.splice(isExists, 1);
            data.unshift(news[0]);
          }
          uni.setStorageSync(NEWS_LIST(this.userInfo.id), data);
          resolve('');
        },
        fail: () => {
          uni.setStorageSync(NEWS_LIST(this.userInfo.id), [
            {
              userId: user.id!,
              username: user.username!,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: user.avatar!,
            },
          ]);
          resolve('');
        },
      });
    });
    uni.navigateTo({ url: `/pages/chat/chat?id=${user.id}` });
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 0 20rpx;
}
.btn-box {
  width: 100rpx;
  height: 50rpx;
  background: #5cb2fb;
  border-radius: 20rpx;
  color: #faffff;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
