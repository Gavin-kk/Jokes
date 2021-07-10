<template>
  <view class="button">
    <view class="text" hover-class="text-hover" @tap="clickBtn">{{ text }}</view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ButtonEncapsulation extends Vue {
  @Prop({ type: String, default: '提交' })
  private text!: string;

  clickBtn() {
    this.$emit('clickBtn');
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90rpx;
  padding: 20rpx 0;

  .text {
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: 0 40rpx;
    background: #f4f4f4;
    border: 1px solid #e9e8e8;
    width: 100%;
    height: 100%;
  }

  .text-hover {
    background: #eeeeee;
  }
}
</style>
