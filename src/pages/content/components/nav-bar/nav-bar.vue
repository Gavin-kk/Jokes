<template>
  <uni-nav-bar class="nav-bar" :border="border" status-bar :background-color="bgColor">
    <view slot="left" class="iconfont icon-fanhui" v-show="leftShow" :style="{ color }" @tap="leftClick"></view>
    <view class="nav-center" :style="{ color }" v-show="textShow">
      <view class="text">{{ title }}</view>
    </view>
    <view slot="right" class="iconfont icon-gengduo1" v-show="rightShow" :style="{ color }" @tap="rightClick"></view>
  </uni-nav-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';

@Component({ components: { UniNavBar } })
export default class NavBar extends Vue {
  @Prop({ type: String, default: '' })
  private title!: string;
  @Prop({ type: String, default: '' })
  private bgColor!: string;
  @Prop({ type: Boolean, default: true })
  private border!: boolean;
  // 文字或内容颜色
  @Prop({ type: String, default: '' })
  private color!: string;
  // 左边按钮是否显示
  @Prop({ type: Boolean, default: true })
  private leftShow!: boolean;
  // 右边按钮是否显示
  @Prop({ type: Boolean, default: true })
  private rightShow!: boolean;
  // 中间是否显示
  @Prop({ type: Boolean, default: true })
  private textShow!: boolean;

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
  box-sizing: border-box;
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
  @include centered;
  width: 100%;

  .text {
    @include centered;
    @include ellipsis(380rpx);
  }
}
</style>
