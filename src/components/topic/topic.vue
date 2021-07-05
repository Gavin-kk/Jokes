<template>
  <view>
    <view class="root-box">
      <!--    搜索框-->
      <m-search @confirm="searchConfirm" />
      <!--    轮播图组件-->
      <banner :banner-image-list="bannerList" @clickBanner="clickBanner" />
      <!--    热门分类-->
      <popular-categories
        class="border"
        :classifyTagList="classifyTagList"
        @classifyTagClick="classifyTagClick"
        @clickMoreCategories="clickMoreCategories"
      />
    </view>

    <!--    最近更新-->
    <recently-updated />
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MSearch from '@components/search/m-search.vue';
import Banner from '@components/banner/banner.vue';
import PopularCategories from '@components/popular-categories/popularCategories.vue';
import RecentlyUpdated from '@components/recently-updated/recently-updated.vue';

@Component({
  components: { RecentlyUpdated, PopularCategories, Banner, MSearch },
})
export default class Topic extends Vue {
  private classifyTagList: { id: number; text: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '最新' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '游戏' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '情感' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '打卡' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '故事' },
    { id: +(Math.random() * 1000 + 1).toFixed(), text: '喜爱' },
  ];

  private bannerList: { id: number; pic: string }[] = [
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/1.jpg' },
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/2.jpg' },
    { id: +(Math.random() * 1000 + 1).toFixed(), pic: '/static/demo/datapic/3.jpg' },
  ];

  // 当手机键盘按下搜索 或 确认时触发
  searchConfirm(value: string) {
    uni.showToast({ title: `你要搜索${value}` });
  }

  // 点击轮播图事件
  clickBanner(id: number) {
    uni.showToast({ title: `跳转到id为${id}` });
  }
  //   点击热门分类 tag 事件
  classifyTagClick(id: number, text: string) {
    uni.showToast({ title: `跳转到为${text}id:${id}` });
  }
  //   点击跳转更多热门分类
  clickMoreCategories() {
    uni.showToast({ title: '跳转到更多热门分类' });
  }
}
</script>

<style lang="scss" scoped>
.root-box {
  box-sizing: border-box;
  padding: 20rpx;
}

.border {
  padding-bottom: 20rpx;
}
</style>
