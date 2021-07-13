<template>
  <view class="input-box">
    <view class="phone">
      <view class="area-code">+86</view>
      <input
        class="phone-input"
        type="text"
        v-model="phone"
        placeholder="请输入手机号"
        placeholder-class="placeholder"
        @blur="phoneBlur"
      />
    </view>
    <verification-code-input-box type="phone" class="verification-code-input" :value="phone">
      <input
        slot="input"
        type="text"
        v-model="verificationCode"
        placeholder="请输入手机验证码"
        placeholder-class="placeholder"
        @blur="blur"
      />
    </verification-code-input-box>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';

@Component({ components: { VerificationCodeInputBox } })
export default class VerificationCodeLogin extends Vue {
  private phone: string = '';
  private verificationCode: string = '';

  //  验证码输入框 失去焦点事件
  blur() {
    this.$emit('VerificationCodeValue', this.verificationCode);
  }
  phoneBlur() {
    this.$emit('phoneValue', this.phone);
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  width: 100%;
  box-sizing: border-box;

  .phone {
    display: flex;
    align-items: center;
    font-size: 32rpx;
    box-sizing: border-box;
    padding: 0 20rpx;
    border-bottom: 1px solid $borderColor;
    height: 100rpx;

    .area-code {
      font-weight: bolder;
    }

    .phone-input {
      box-sizing: border-box;
      padding: 0 20rpx;
    }
  }

  .placeholder {
    font-size: 32rpx;
  }

  .verification-code-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 100rpx;
  }
}
</style>
