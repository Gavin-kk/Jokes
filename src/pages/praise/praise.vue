<template>
  <view>
    <nav-bar title="赞" page-path="/pages/news/news"></nav-bar>
    <view class="box">
      <block v-for="item in data" :key="item.userId + item.time">
        <news-list :data="item" @openChat="openUser(item)" />
      </block>
      <!-- 点赞列表-->
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

type DataType = Omit<INews, 'time' | 'unreadCount'>;

interface IDataType extends DataType {
  time: string;
}

@Component({
  name: 'praise',
  components: { NewsList, NavBar },
})
export default class Praise extends Vue {
  // 下拉加载的页码
  private pageNum: number = 1;
  // 下拉加载的提示文字
  private pullMsg: LoadingStatus = LoadingStatus.load;
  private data: IDataType[] = [];

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
    uni.removeStorage({ key: USER_NEW_LIKE_COUNT });
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
