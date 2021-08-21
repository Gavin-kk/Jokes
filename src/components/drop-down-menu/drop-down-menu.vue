<template>
  <view>
    <view class="menu-mask" v-show="isShowMenu" @tap="close"></view>
    <view
      v-show="isShowMenu"
      :class="['menu', 'animate__animated', 'animate__backInDown']"
      :style="{ 'animation-duration': '200ms', top: statusBarIsExists }"
    >
      <view :class="['iconfont', firstIconfontClass]" hover-class="hover" @tap="clickOnTheFirst" v-if="firstText">{{
        firstText
      }}</view>
      <view :class="['iconfont', lastIconfontClass]" hover-class="hover" @tap="clickTheLastOne" v-if="lastText">{{
        lastText
      }}</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class DropDownMenu extends Vue {
  @Prop(Boolean)
  private isShowMenu!: boolean; // 控制是否显示

  @Prop({ type: String, default: '' })
  private firstText!: string;
  @Prop({ type: String, default: '' })
  private lastText!: string;
  @Prop({ type: String, default: '' })
  private firstIconfontClass!: string;
  @Prop({ type: String, default: '' })
  private lastIconfontClass!: string;
  @Prop({ type: Number, default: 0 })
  private navBarHeight?: number;

  close() {
    this.$emit('close');
  }

  clickOnTheFirst() {
    this.$emit('clickOnTheFirst');
    this.$emit('close');
  }
  clickTheLastOne() {
    this.$emit('clickTheLastOne');
    this.$emit('close');
  }

  get statusBarIsExists() {
    let height: string = this.navBarHeight ? `${this.navBarHeight}px` : '';
    //   #ifdef APP-PLUS
    height = this.navBarHeight ? '135rpx' : '';
    // #endif
    return height;
  }
}
</script>

<style lang="scss" scoped>
.menu-mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  z-index: 10;
}
.menu {
  width: 300rpx;
  background: #ffffff;
  z-index: 100;
  position: absolute;
  right: 0;
  top: 10rpx;
  box-shadow: 0 0 8px 0 #ccc;
  /*  !*#ifdef APP-PLUS*!
  top: 135rpx !important;
  !* #endif*!*/
  .iconfont {
    display: flex;
    align-items: center;
    height: 80rpx;
  }
  .iconfont:before {
    display: inline-block;
    padding: 0 20rpx;
  }

  .hover {
    background: #eeeeee;
  }
}
</style>
