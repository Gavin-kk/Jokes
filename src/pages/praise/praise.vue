<template>
  <view>
    <nav-bar title="赞" page-path="/pages/news/news"></nav-bar>
    <view class="box">
      <!-- 点赞列表-->
      <block v-for="(item, index) in data" :key="index">
        <news-list :data="item" @openChat="openUser(item)" />
      </block>
      <template v-if="isEmpty">
        <empty />
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import { getLikeMineUserRequest } from '@services/article.request';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import { AxiosResponse } from 'axios';
import { IPraiseResponse } from '@pages/praise/praise.interface';
import { IResponse } from '@services/interface/response.interface';
import { INews } from '@pages/news/news.vue';
import { USER_NEW_LIKE_COUNT } from '@common/constant/storage.constant';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import Empty from '@components/empty/empty.vue';

type DataType = Omit<INews, 'time' | 'unreadCount'>;

interface IDataType extends DataType {
  time: string;
}

const UserModule = namespace('userModule');
@Component({
  name: 'praise',
  components: { Empty, NewsList, NavBar },
})
export default class Praise extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  // 下拉加载的页码
  private pageNum: number = 1;
  // 下拉加载的提示文字
  private pullMsg: LoadingStatus = LoadingStatus.load;
  private data: IDataType[] = [];

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  created() {
    //  请求给我点赞的用户携带文章content
    this.getData();
    //  清除未读消息数量
    this.clearUnread();
  }

  openUser(data: IDataType) {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${data.userId}` });
  }

  async getData() {
    const result: AxiosResponse<IResponse<IPraiseResponse[]>> = await getLikeMineUserRequest(this.pageNum);
    this.data = result.data.data.map((item) => ({
      userId: item.user.id,
      username: item.user.username,
      content: `点赞了"${item.article.title}"`,
      time: item.createAt,
      avatar: item.user.avatar,
    }));
  }

  clearUnread() {
    if (this.userInfo.id) {
      uni.removeStorage({ key: USER_NEW_LIKE_COUNT(this.userInfo.id) });
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  box-sizing: border-box;
  padding: 20rpx;
  width: 100%;
}
</style>
