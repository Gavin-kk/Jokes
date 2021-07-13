<template>
  <view>
    <view :style="{ height: `${statusBarHeight}px`, background: '#ffe933' }"></view>
    <!--    背景图-->
    <view class="login-bg">
      <image class="bg" src="/static/login-bg.png" mode="widthFix"></image>
      <view class="iconfont icon-guanbi" @tap="back"></view>
    </view>
    <view class="box">
      <!-- 验证码登录组件-->
      <template v-if="currentShow">
        <verification-code-login @VerificationCodeValue="setVerificationCodeValue" @phoneValue="setPhoneValue" />
      </template>
      <!-- 账号密码登录组件-->
      <template v-else>
        <account-password-login @usernameChange="usernameChange" @passwordChange="passwordChange" />
      </template>

      <view class="login-btn">
        <button @tap="login">登录</button>
      </view>
      <view class="change-login-method">
        <text @tap="changeLoginMethod">{{ currentLoginMethodsText }} {{ '>' }}</text>
      </view>
      <view class="sign-in-with">
        <view class="prompt">
          <view class="prompt-text">第三方登录</view>
        </view>
        <!--第三方登录组件-->
        <login-methods if-use-icon />
        <view class="user-agreement">注册即代表您同意<view style="color: #0a98d5">《用户协议》</view></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LoginMethods from '@pages/mine/components/login-methods/login-methods.vue';
import VerificationCodeLogin from '@pages/login/components/verification-code-login/verification-code-login.vue';
import AccountPasswordLogin from '@pages/login/components/account-password-login/account-password-login.vue';

export const enum LoginMethodsEnum {
  password,
  verificationCode,
}

@Component({
  components: { AccountPasswordLogin, VerificationCodeLogin, LoginMethods },
})
export default class Login extends Vue {
  // statusBar的高度
  private statusBarHeight: number = 0;
  // 要发送验证码的手机号
  private phone: string = '';
  // 输入的验证码
  private verificationCode: string = '';

  // 账号密码登录
  private username: string = '';
  private password: string = '';

  // 当前登录方法
  private loginMethods: LoginMethodsEnum = LoginMethodsEnum.verificationCode;

  // 点击登录按钮触发
  login() {
    //  判断是否输入框是否有值 与合法
    if (!this.checkInput()) return;
    uni.showToast({ title: '校验成功' });
  }

  checkInput(): boolean {
    const phoneReg: RegExp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (this.loginMethods === LoginMethodsEnum.verificationCode && this.phone && this.verificationCode) {
      if (!phoneReg.test(this.phone)) {
        uni.showToast({ title: '手机号不合法', icon: 'none' });
        return false;
      }
      return true;
    }
    return !!(this.loginMethods === LoginMethodsEnum.password && this.username && this.password);
  }

  usernameChange(value: string) {
    this.username = value;
  }
  passwordChange(value: string) {
    this.password = value;
  }

  // 更改登录方法
  changeLoginMethod() {
    this.clearInput();
    // eslint-disable-next-line no-unused-expressions
    this.loginMethods === LoginMethodsEnum.verificationCode
      ? (this.loginMethods = LoginMethodsEnum.password)
      : (this.loginMethods = LoginMethodsEnum.verificationCode);
  }

  // 验证码失去焦点事件
  setVerificationCodeValue(value: string) {
    this.verificationCode = value;
  }
  // 输入框手机号失去焦点事件
  setPhoneValue(value: string) {
    this.phone = value;
  }

  clearInput() {
    this.password = '';
    this.phone = '';
    this.username = '';
    this.verificationCode = '';
  }

  back() {
    uni.navigateBack({ delta: 1 });
  }

  created() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
  }

  get currentLoginMethodsText(): string {
    return this.loginMethods === LoginMethodsEnum.verificationCode ? '账号密码登录' : '验证码登录';
  }
  //  判断当前显示什么
  get currentShow(): boolean {
    return this.loginMethods === LoginMethodsEnum.verificationCode;
  }
}
</script>

<style lang="scss" scoped>
$promptFontColor: #b4b4b4;

.login-bg {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 372rpx;

  .bg {
    width: 100%;
    height: 100%;
  }

  .icon-guanbi {
    position: absolute;
    left: 20rpx;
    top: 20rpx;
    font-size: 40rpx;
    z-index: 1;
  }
}

.box {
  box-sizing: border-box;
  margin-top: 50rpx;
  padding: 0 20rpx;

  .login-btn {
    margin-top: 40rpx;
  }

  .change-login-method {
    @include centered;
    width: 100%;
    height: 200rpx;
    font-size: $fontMini;
  }

  .sign-in-with {
    width: 100%;

    .prompt {
      @include centered;
      width: 100%;
      box-sizing: border-box;

      .prompt-text {
        box-sizing: border-box;
        padding: 0 30rpx;
        font-size: 28rpx;
        color: $promptFontColor;
      }

      &:before {
        content: '';
        display: inline-block;
        width: 100rpx;
        height: 1rpx;
        background: $promptFontColor;
      }

      &:after {
        content: '';
        display: inline-block;
        width: 100rpx;
        height: 1rpx;
        background: $promptFontColor;
      }
    }

    .user-agreement {
      @include centered;
      width: 100%;
      font-size: $fontSize;
      margin-top: 40rpx;
    }
  }
}
</style>
