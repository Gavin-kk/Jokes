<template>
  <view>
    <nav-bar title="我的关注" page-path="/pages/mine/mine"></nav-bar>
    <view class="box">
      <block v-for="item in fansList" :key="item.id">
        <news-list :data="item" @openChat="openUser">
          <view slot="right"> </view>
        </news-list>
      </block>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { IFans } from '@pages/new-attention/new-attention.vue';
import { getAListOfFansRequest } from '@services/follow.request';
import NavBar from '@components/nav-bar/nav-bar.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';

@Component({
  components: { NewsList, NavBar },
})
export default class MyFans extends Mixins(CheckLoginMixin) {
  private fansList: IFans[] = [];
  created() {
    this.getData();
  }
  async getData() {
    try {
      const result: AxiosResponse<IResponse<IFans[]>> = await getAListOfFansRequest();
      this.fansList = result.data.data;
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
