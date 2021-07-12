<template>
  <view>
    <view :style="{ height: `${statusBarHeight}px`, background: '#ffe933' }"></view>
    <!--    背景图-->
    <view class="login-bg">
      <image class="bg" src="/static/login-bg.png" mode="widthFix"></image>
    </view>
    <view class="box">
      <view class="input-box">
        <view class="phone">
          <view class="area-code">+86</view>
          <input
            class="phone-input"
            type="text"
            v-model="phone"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
          />
        </view>
        <verification-code-input-box type="phone" class="verification-code-input" :value="phone">
          <input
            slot="input"
            type="text"
            v-model="verificationCode"
            placeholder="请输入手机验证码"
            placeholder-class="placeholder"
          />
        </verification-code-input-box>
      </view>
      <view class="login-btn">
        <button>登录</button>
      </view>
      <view class="change-login-method">账号密码登录 {{ '>' }}</view>
      <view class="sign-in-with">
        <view class="prompt">
          <view class="prompt-text">第三方登录</view>
        </view>
        <login-methods if-use-icon />
        <view class="user-agreement">注册即代表您同意<view style="color: #0a98d5">《用户协议》</view></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';
import LoginMethods from '@pages/mine/components/login-methods/login-methods.vue';

@Component({
  components: { LoginMethods, VerificationCodeInputBox },
})
export default class Login extends Vue {
  // statusBar的高度
  private statusBarHeight: number = 0;
  // 要发送验证码的手机号
  private phone: string = '13154888681';
  // 输入的验证码
  private verificationCode: string = '';

  created() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
  }
}
</script>

<style lang="scss" scoped>
$promptFontColor: #b4b4b4;

.login-bg {
  box-sizing: border-box;
  width: 100%;
  height: 372rpx;
  .bg {
    width: 100%;
    height: 100%;
  }
}

.box {
  box-sizing: border-box;
  margin-top: 50rpx;
  padding: 0 20rpx;

  .input-box {
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
