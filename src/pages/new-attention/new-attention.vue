<template>
  <view>
    <nav-bar title="新增关注" page-path="/pages/news/news"></nav-bar>
    <view class="msg">互相关注后可以向该好友发起聊天</view>
    <template v-if="isExistsNewFans">
      <view class="box">
        <view>
          <view class="title">新关注</view>
          <block v-for="(item, index) in newFans" :key="item.id">
            <news-list :data="item" @openChat="openUser" is-use-slot>
              <view slot="right">
                <view class="btn-box" v-if="item.followEachOther" @tap.stop="openChat(index)">聊天</view>
                <view class="btn-box attention" v-else @tap.stop="follow(item.id, index)">关注</view>
              </view>
            </news-list>
          </block>
        </view>
        <view class="title">所有关注</view>
        <block v-for="(item, index) in fans" :key="item.id">
          <news-list :data="item" @openChat="openUser" is-use-slot>
            <view slot="right">
              <view class="btn-box" v-if="item.followEachOther" @tap.stop="openChat(index)">聊天</view>
              <view class="btn-box attention" v-else @tap.stop="follow(item.id, index)">关注</view>
            </view>
          </news-list>
        </block>
      </view>
    </template>
    <template v-else>
      <empty />
    </template>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import { INews } from '@pages/news/news.vue';
import { getAListOfFansRequest, checkIsFollowEachOtherRequest } from '@services/follow.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { IUser } from '@store/module/user';

import { NEWS_LIST, USER_NEW_ATTENTION_COUNT } from '@common/constant/storage.constant';
import { namespace } from 'vuex-class';
import { followUsersRequest } from '@services/user.request';
import { IFollowEventPayload } from '@components/dynamic/dynamic.vue';
import Empty from '@components/empty/empty.vue';

export interface IFans extends Partial<IUser> {
  followEachOther: boolean;
}

const UserModule = namespace('userModule');

@Component({
  name: 'NewAttention',
  components: { Empty, NewsList, NavBar },
})
export default class NewAttention extends Vue {
  @UserModule.State('userInfo')
  private userInfo!: IUser;
  // 新粉丝
  private newFans: IFans[] = [];
  // 除新粉丝外的所有粉丝
  private fans: IFans[] = [];

  // 判断是否有新粉丝
  get isExistsNewFans(): boolean {
    return this.fans.length > 0;
  }
  created() {
    //  请求个人所有粉丝的列表 携带互相关注参数
    this.getData();
    //  删除未读数量
    this.removeUnreadCount();
  }

  async getData() {
    try {
      const result: AxiosResponse<IResponse<IFans[]>> = await getAListOfFansRequest();
      this.newFans = result.data.data.slice(0, 1);
      this.fans = result.data.data;
    } catch (err) {
      uni.showToast({ title: '获取失败,请稍候重试', icon: 'none' });
    }
  }

  // 关注事件
  async follow(userId: number, index: number) {
    this.fans[index].followEachOther = true;
    this.newFans[index] && (this.newFans[index].followEachOther = true);
    // 发送关注请求或取关
    const followRes = await followUsersRequest(userId);
    const isFollow: boolean = followRes.data.data === '关注成功';
    uni.showToast({ title: followRes.data.data, icon: 'none' });
    uni.$emit('follow', { userId, isFollow });
  }

  openUser(userId: number) {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${userId}` });
  }
  // 点击聊天
  async openChat(index: number) {
    const result: AxiosResponse<IResponse<boolean>> = await checkIsFollowEachOtherRequest(
      this.userInfo.id,
      this.fans[index].id!,
    );
    if (!result.data.data) {
      uni.showToast({ title: '没有互相关注呦，需要互相关注才能发送消息呦', icon: 'none', duration: 2500 });
      return;
    }
    await new Promise((resolve) => {
      uni.getStorage({
        key: NEWS_LIST(this.userInfo.id),
        success: (res) => {
          const data: INews[] = res.data;
          const isExists: number = data.findIndex((item) => item.userId === this.fans[index].id!);
          if (isExists === -1) {
            data.unshift({
              userId: this.fans[index].id!,
              username: this.fans[index].username!,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: this.fans[index].avatar!,
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
              userId: this.fans[index].id!,
              username: this.fans[index].username!,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: this.fans[index].avatar!,
            },
          ]);
          resolve('');
        },
      });
    });
    uni.navigateTo({ url: `/pages/chat/chat?id=${this.fans[index].id}` });
  }

  //  删除消息页面右上角的角标
  removeUnreadCount() {
    uni.removeStorage({ key: USER_NEW_ATTENTION_COUNT });
  }
}
</script>

<style lang="scss" scoped>
.box {
  box-sizing: border-box;
  padding: 0 20rpx;

  .title {
    font-size: 30rpx;
    height: 70rpx;
    line-height: 70rpx;
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

  .attention {
    color: #000000;
    background: #fbda4e;
  }
}

.msg {
  @include centered;
  width: 100%;
  height: 70rpx;
  font-size: 24rpx;
  background: #f6f6f6;
  color: #989898;
}
</style>
