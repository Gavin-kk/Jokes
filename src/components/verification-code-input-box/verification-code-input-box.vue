<template>
  <view class="verification-code">
    <slot class="input" name="input"></slot>
    <view v-if="!isSendVCode" @tap="getVCode" class="get-btn">获取验证码</view>
    <view v-else class="countdown">{{ getEmailVCodeCountdown }}秒后可重发</view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getEmailVerificationCode } from '@services/common.request';
import { SendEmailType } from '@common/enum/send-email-type';

let timer: number | undefined;

@Component({})
export default class VerificationCodeInputBox extends Vue {
  // 输入的验证码
  private eMailVerificationCode: string = '';
  // 是否发送验证码
  private isSendVCode: boolean = false;
  // 获取邮箱验证码倒计时
  private getEmailVCodeCountdown: number = 300;
  // 要发送的手机号或邮箱 用于判断是否输入了 如果没输入则 停止发送 和 发送验证码时所用
  @Prop({ type: String, default: '' })
  private value!: string;
  @Prop({ type: String, default: 'phone' })
  private type!: 'phone' | 'email';
  @Prop({ type: Number, default: SendEmailType.Login })
  private emailType!: SendEmailType;

  check(): boolean {
    let reg: RegExp | undefined;
    if (this.type === 'phone') {
      reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    }
    if (this.type === 'email') {
      reg = /^[^_$].{4,}@(163|126|qq|sina)\.(com|cn|net)$/;
    }
    return !!reg?.test(this.value);
  }

  // 获取验证码
  async getVCode() {
    // 验证是否输入了邮箱
    if (!this.check()) {
      if (this.type === 'email') {
        uni.showToast({ title: '邮箱格式不正确', icon: 'none' });
        return;
      }
    }

    try {
      // 发送验证码请求
      await getEmailVerificationCode(this.value, this.emailType);
      uni.showToast({ title: '已发送' });
      this.isSendVCode = true;
      timer = setInterval(() => {
        this.getEmailVCodeCountdown--;
        if (this.getEmailVCodeCountdown === 0) {
          clearInterval(timer || undefined);
          this.getEmailVCodeCountdown = 60;
          this.isSendVCode = false;
        }
      }, 1000);
    } catch (err) {
      clearInterval(timer || undefined);
      this.isSendVCode = false;
      if (err.response.data.message === '操作频繁') {
        uni.showToast({ title: err.response.data.message, icon: 'none' });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verification-code {
  @include bothSides;
  box-sizing: border-box;
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border-bottom: 1px solid $borderColor;

  .get-btn {
    font-size: $fontSize;
  }
  .countdown {
    font-size: $fontSize;
  }
}
</style>
