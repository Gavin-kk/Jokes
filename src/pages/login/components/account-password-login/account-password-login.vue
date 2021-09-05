<template>
  <view class="input-box">
    <view class="username">
      <input
        @input="usernameChange"
        type="text"
        class="username-input"
        placeholder-class="placeholder"
        placeholder="请输入昵称/手机号/邮箱"
      />
    </view>

    <view class="password">
      <view class="input-box">
        <input
          @input="passwordChange"
          class="password-input"
          type="text"
          placeholder-class="placeholder"
          placeholder="请输入密码"
        />
      </view>
      <view class="forgot-password" @tap="forgotPasswordClick">忘记密码?</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class AccountPasswordLogin extends Vue {
  // private username: string = '';
  // private password: string = '';

  // username 失去焦点时触发
  usernameChange(data: { detail: { value: string } }) {
    this.$emit('usernameChange', data.detail.value);
  }
  //  password 失去焦点时触发
  passwordChange(data: { detail: { value: string } }) {
    this.$emit('passwordChange', data.detail.value);
  }
  // 点击忘记密码触发事件
  forgotPasswordClick() {
    uni.showModal({
      title: '忘记密码提示',
      content: '请使用邮箱验证码登录\n然后进入个人设置重置密码',
      success: (res) => {
        if (res.confirm) {
          this.$emit('changeLoginMethod');
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped>
$inputHeight: 100rpx;

.input-box {
  width: 100%;
  box-sizing: border-box;

  .placeholder {
    font-size: 32rpx;
  }
  .username {
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    height: $inputHeight;
    border-bottom: 1px solid $borderColor;
    box-sizing: border-box;

    .username-input {
      width: 100%;
      height: $inputHeight;
    }
  }

  .password {
    position: relative;

    .input-box {
      display: flex;
      align-items: center;
      width: 100%;
      height: $inputHeight;
      border-bottom: 1px solid $borderColor;

      .password-input {
        box-sizing: border-box;
        width: 400rpx;
        height: $inputHeight;
        padding: 20rpx;
      }
    }
    .forgot-password {
      position: absolute;
      right: 20rpx;
      bottom: 50%;
      transform: translateY(50%);
      font-size: 32rpx;
    }
  }
}
</style>
