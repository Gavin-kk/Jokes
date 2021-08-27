<template>
  <view>
    <nav-bar title="我的关注" page-path="/pages/mine/mine"></nav-bar>
    <view class="box">
      <block v-for="item in followList" :key="item.id">
        <news-list :data="item" @openChat="openUser">
          <view slot="right"> </view>
        </news-list>
      </block>
      <template v-if="isEmpty">
        <empty />
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { getFollowUserRequest } from '@services/follow.request';
import { IFans } from '@pages/new-attention/new-attention.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import Empty from '@components/empty/empty.vue';

@Component({
  components: { Empty, NavBar, NewsList },
})
export default class MyFollow extends Mixins(CheckLoginMixin) {
  private followList: IFans[] = [];

  get isEmpty(): boolean {
    return this.followList.length === 0;
  }

  created() {
    this.getData();
  }

  async getData() {
    try {
      const result: AxiosResponse<IResponse<IFans[]>> = await getFollowUserRequest();
      this.followList = result.data.data;
    } catch (err) {
      uni.showToast({ title: '获取失败,请稍候重试', icon: 'none' });
    }
  }

  openUser(userId: number) {
    uni.navigateTo({
      url: `/pages/personal-space/personal-space?userId=${userId}`,
    });
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 20rpx;
}
</style>
