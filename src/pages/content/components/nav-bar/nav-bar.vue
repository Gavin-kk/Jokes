<template>
  <uni-nav-bar class="nav-bar">
    <view slot="left" class="iconfont icon-fanhui" @tap="leftClick"></view>
    <view class="nav-center">
      <view class="text">{{ title }}</view>
    </view>
    <view slot="right" class="iconfont icon-gengduo1" @tap="rightClick"></view>
  </uni-nav-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';

@Component({ components: { UniNavBar } })
export default class NavBar extends Vue {
  @Prop({ type: String, default: '' })
  private title!: string;

  leftClick() {
    this.$emit('leftClick');
  }
  rightClick() {
    this.$emit('rightClick');
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: relative;
  z-index: 100;
}
.iconfont {
  font-size: 48rpx;
}

.icon-fanhui {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.icon-gengduo1 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav-center {
  width: 100%;
  @include centered;

  .text {
    @include ellipsis(380rpx);
  }
}
</style>
