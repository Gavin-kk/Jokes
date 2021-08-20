<template>
  <view class="input-box-m">
    <slot name="left"></slot>
    <slot name="center">
      <input
        v-model="text"
        @confirm="confirm"
        class="input"
        type="text"
        :focus="focus"
        @blur="blur"
        placeholder="文明发言"
        placeholder-class="input-placeholder"
      />
    </slot>
    <slot name="right">
      <view class="send" @tap="confirm">
        <view class="iconfont icon-fabu"></view>
      </view>
    </slot>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';

@Component({})
export default class ChatInputBtn extends Vue {
  @PropSync('isFocus', { type: Boolean, default: false })
  private focus!: boolean;
  private text: string = '';

  confirm() {
    if (!this.text) return;
    this.$emit('confirm', this.text);
    this.text = '';
  }
  blur() {
    this.$emit('outOfFocus');
  }
}
</script>

<style lang="scss" scoped>
.input-box-m {
  //position: fixed;
  position: relative;
  top: 0;
  display: flex;
  width: 100%;
  height: 80rpx;
  padding: 10rpx;
  box-sizing: border-box;
  border-top: 1px solid $borderColor;
  background: #ffffff;
  z-index: 1;

  .input {
    flex-grow: 1;
    padding: 0 10rpx;
    height: 100%;
    background: #f7f7f7;
  }

  .input-placeholder {
    font-size: 28rpx;
  }

  .send {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 100%;
  }
}
</style>
