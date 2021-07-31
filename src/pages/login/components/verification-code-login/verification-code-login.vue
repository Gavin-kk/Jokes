<template>
  <view class="input-box">
    <view class="phone">
      <input
        class="phone-input"
        type="text"
        placeholder="请输入邮箱"
        placeholder-class="placeholder"
        @input="phoneInput"
      />
    </view>
    <verification-code-input-box type="email" class="verification-code-input" :value="email">
      <input slot="input" type="number" placeholder="请输入邮箱验证码" placeholder-class="placeholder" @input="input" />
    </verification-code-input-box>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';

@Component({ components: { VerificationCodeInputBox } })
export default class VerificationCodeLogin extends Vue {
  private email: string = '';
  // private verificationCode: string = '';

  //  验证码输入框 失去焦点事件
  input(data: { detail: { value: string } }) {
    this.$emit('VerificationCodeValue', +data.detail.value);
  }
  phoneInput(data: { detail: { value: string } }) {
    this.email = data.detail.value;
    this.$emit('phoneValue', data.detail.value);
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
