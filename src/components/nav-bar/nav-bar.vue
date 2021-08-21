<template>
  <view>
    <uni-nav-bar status-bar :border="false">
      <view slot="default" class="title-center">{{ title }}</view>
      <view slot="left" class="iconfont icon-fanhui" @tap="clickLeft"></view>
      <view slot="right">
        <slot name="right"></slot>
      </view>
    </uni-nav-bar>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';

@Component({ components: { UniNavBar } })
export default class NavBar extends Vue {
  @Prop({ type: String, default: '设置' })
  private title!: string;

  @Prop({ type: String, default: '/pages/home/home' })
  private pagePath!: string;

  clickLeft() {
    const pages: any = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack({
        delta: 1,
      });
      return;
    }
    uni.redirectTo({
      url: this.pagePath,
      fail: () => {
        uni.switchTab({ url: this.pagePath });
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.title-center {
  font-size: 32rpx;
  @include centered;
  width: 100%;
}
.icon-fanhui {
  font-size: 40rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
