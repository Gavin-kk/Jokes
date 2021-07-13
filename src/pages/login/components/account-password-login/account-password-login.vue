<template>
  <view class="input-box">
    <view class="username">
      <input
        v-model="username"
        @blur="usernameChange"
        type="text"
        class="username-input"
        placeholder="请输入昵称/手机号/邮箱"
      />
    </view>

    <view class="password">
      <view class="input-box">
        <input v-model="password" @blur="passwordChange" class="password-input" type="text" placeholder="请输入密码" />
      </view>
      <view class="forgot-password">忘记密码?</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class AccountPasswordLogin extends Vue {
  private username: string = '';
  private password: string = '';

  // username 失去焦点时触发
  usernameChange() {
    this.$emit('usernameChange', this.username);
  }
  //  password 失去焦点时触发
  passwordChange() {
    this.$emit('passwordChange', this.password);
  }
}
</script>

<style lang="scss" scoped>
$inputHeight: 100rpx;

.input-box {
  width: 100%;
  box-sizing: border-box;

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
