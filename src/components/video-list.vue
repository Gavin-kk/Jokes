<template>
  <swiper class="swiper" :vertical="true" :acceleration="false">
    <swiper-item class="item">
      <view class="swiper-item uni-bg-red">A</view>
    </swiper-item>
    <swiper-item class="item">
      <view class="swiper-item uni-bg-green">B</view>
    </swiper-item>
    <swiper-item class="item">
      <view class="swiper-item uni-bg-blue">C</view>
    </swiper-item>
  </swiper>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Index extends Vue {
  private windowHeight: number = 700;

  created() {
    this.getSystemInfo();
  }

  private getSystemInfo() {
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.swiper-wrapper,
.swiper {
  width: 100%;
  height: 100%;
}

.item {
  height: 500px;
  width: 100%;
  background: #2c405a;
}
</style>
