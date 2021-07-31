<template>
  <view class="input-box-m">
    <input
      v-model="text"
      @confirm="confirm"
      class="input"
      type="text"
      placeholder="文明发言"
      placeholder-class="input-placeholder"
    />
    <view class="send" @tap="confirm">
      <view class="iconfont icon-fabu"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class ChatInputBtn extends Vue {
  private text: string = '';

  confirm() {
    if (!this.text) return;
    this.$emit('confirm', this.text);
    this.text = '';
  }
}
</script>

<style lang="scss" scoped>
.input-box-m {
  position: fixed;
  bottom: 0;
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
