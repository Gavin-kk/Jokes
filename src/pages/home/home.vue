<template>
  <!--  <view :style="{ marginTop: `${systemInfo.statusBarHeight}px` }">-->
  <!--    <uni-nav-bar left-icon="back" class="uni-nav-bar">-->
  <!--      <view class="search">-->
  <!--        <view class="search-icon-wrapper">-->
  <!--          <uni-icons type="search" color="#C8C8C8"></uni-icons>-->
  <!--        </view>-->
  <!--        1234-->
  <!--      </view>-->
  <!--      <view slot="left">left</view>-->
  <!--      <view slot="right">right</view>-->
  <!--    </uni-nav-bar>-->
  <!--  </view>-->
  <view>
    <dynamic />
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
// import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
// import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import Dynamic from '@components/dynamic/dynamic.vue';

const SystemModule = namespace('systemModule');
@Component({ components: { Dynamic } })
export default class Home extends Vue {
  @SystemModule.State('systemInfo') private readonly systemInfo!: SystemInfo;
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  width: 100%;
  height: 100%;
  background: #2c405a;
}

//.uni-nav-bar {
//  width: 750rpx;
//  display: flex;
//  justify-content: space-evenly;
//  align-items: center;
//}
</style>
