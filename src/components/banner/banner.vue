<template>
  <view class="swiper-box">
    <swiper
      :autoplay="autoplay"
      :indicator-dots="true"
      circular
      indicator-color="rgba(255, 255, 255, .6)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="item in bannerImageList" :key="item.id" @tap="clickBanner(item.id)">
        <image class="banner-image" :src="item.pic" mode="widthFix"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Banner extends Vue {
  //  是否自动轮播
  private autoplay: boolean = true;

  @Prop(Array)
  private bannerImageList!: { id: number; pic: string }[];

  clickBanner(id: number) {
    this.$emit('clickBanner', id);
  }
}
</script>

<style lang="scss" scoped>
.swiper-box {
  width: 100%;
  height: 300rpx;
  margin: 15rpx 0;
  border-radius: 10rpx;
  overflow: hidden;

  .banner-image {
    height: 100%;
    width: 100%;
  }
}
</style>
