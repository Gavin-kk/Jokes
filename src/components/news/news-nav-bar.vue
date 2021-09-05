<template>
  <uni-nav-bar :status-bar="isStatusBar" :border="false">
    <view class="nav-left" slot="left" @tap="leftClick">
      <view class="iconfont icon-qiandao"></view>
    </view>
    <slot name="default">
      <block slot="default">
        <view class="nav-center">
          <view
            :class="['item', 'follow', { active: currentIndex === index }]"
            v-for="(item, index) in navList"
            :key="item"
            @tap="changeActive(item, index)"
          >
            {{ item }}
          </view>
        </view>
      </block>
    </slot>
    <slot name="right">
      <view class="nav-right" slot="right" v-if="rightIsShow" @tap="rightClick">
        <view class="iconfont icon-bianji1"></view>
      </view>
    </slot>
  </uni-nav-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';

@Component({ components: { UniNavBar } })
export default class NewsNavBar extends Vue {
  private isStatus: boolean = true;

  @Prop(Array)
  private navList!: string[];

  @Prop(Number)
  private currentIndex!: number;
  @Prop({ type: Boolean, default: false })
  private isStatusBarShow!: boolean;
  @Prop({ type: Boolean, default: true })
  private rightIsShow!: boolean;

  get isStatusBar(): boolean {
    return this.isStatusBarShow || this.isStatus;
  }
  created() {
    // #ifdef MP-WEIXIN
    this.isStatus = false;
    // #endif
  }

  leftClick() {
    this.$emit('leftClick');
  }

  rightClick() {
    this.$emit('rightClick');
  }

  changeActive(item: string, index: number) {
    this.$emit('change', { item, index });
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.iconfont {
  font-size: 22px;
}
.icon-qiandao {
  color: rgb(215, 169, 91);
}

.nav-right,
.nav-left {
  /*  #ifdef APP-PLUS*/
  padding: 0 10rpx;
  /*  #endif*/
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.nav-center {
  @include centered;
  width: 100%;
  height: 100%;

  .item {
    @include centered;
    position: relative;
    width: 100rpx;
    height: 100%;
  }
  .active {
    font-weight: bold;
  }

  .active:after {
    content: '';
    position: absolute;
    bottom: 10rpx;
    display: inline-block;
    width: 80%;
    height: 10rpx;
    border-radius: 20rpx;
    background: #fbe351;
  }
}
</style>
