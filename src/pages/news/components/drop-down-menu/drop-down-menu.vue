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

<style lang="scss" scoped></style>
