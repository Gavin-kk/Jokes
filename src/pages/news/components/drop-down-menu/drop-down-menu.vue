<template>
  <view>
    <view class="menu-mask" v-show="isShowMenu" @tap="changeIsShow"></view>
    <view
      v-show="isShowMenu"
      :class="['menu', 'animate__animated', 'animate__backInDown']"
      style="animation-duration: 400ms"
    >
      <view class="iconfont icon-sousuo" hover-class="hover" @tap="addFriend">加好友</view>
      <view class="iconfont icon-qingchu" hover-class="hover" @tap="clearUnread">清除未读</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class DropDownMenu extends Vue {
  @Prop(Boolean)
  private isShowMenu!: boolean;
  changeIsShow() {
    this.$emit('changeIsShow');
  }
  addFriend() {
    this.$emit('addFriend');
  }
  clearUnread() {
    this.$emit('clearUnread');
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
}
.menu {
  width: 300rpx;
  background: #ffffff;
  z-index: 100;
  position: absolute;
  right: 0;
  top: 10rpx;
  box-shadow: 0 0 8px 0 #ccc;

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
