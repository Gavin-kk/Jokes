<template>
  <view class="header" :style="{ paddingTop: `${systemInfo.statusBarHeight - 4}px` }">
    <view class="icon"><uni-icons type="search" size="22" color="rgb(152,152,152)" /></view>
    <view class="center">推荐</view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const SystemModule = namespace('systemModule');
@Component({ components: { uniIcons } })
export default class Header extends Vue {
  // eslint-disable-next-line no-undef
  @SystemModule.State('systemInfo') private readonly systemInfo!: SystemInfo;
}
</script>

<style lang="scss" scoped>
$height: 90rpx;

.header {
  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 750rpx;
  height: $height;
  background: #000000;
  color: $color;

  .icon {
    position: absolute;
    left: 0;
    width: 40px;
    height: $height;
    line-height: $height;
    text-align: center;
  }
  .center {
  }
}
</style>
