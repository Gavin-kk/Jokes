<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="绑定邮箱" page-path="/pages/settings/settings" />
    <!--    输入框-->
    <view class="input-list">
      <input
        type="text"
        v-model="email"
        class="item-input"
        placeholder="请输入邮箱"
        placeholder-class="item-input-placeholder"
      />
      <input
        class="item-input"
        type="password"
        v-model="password"
        placeholder="请输入账号密码"
        placeholder-class="item-input-placeholder"
      />
      <verification-code-input-box type="email" :value="email" :email-type="0">
        <input
          slot="input"
          class="input"
          type="number"
          v-model="VCode"
          placeholder="请输入邮箱验证码"
          placeholder-class="item-input-placeholder"
        />
      </verification-code-input-box>
    </view>
    <button :loading="loading" :disabled="loading" @tap="clickBtn" class="btn">完成</button>
  </view>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ButtonEncapsulation from '@components/button-encapsulation/button-encapsulation.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import { editEmailRequest } from '@services/user.request';

@Component({ components: { VerificationCodeInputBox, NavBar, ButtonEncapsulation, UniNavBar } })
export default class BindEmail extends Mixins(CheckLoginMixin) {
  private email: string = '';
  private password: string = '';
  // 邮箱的验证码
  private VCode: string = '';
  // 按钮的loading
  private loading: boolean = false;

  checkValue(): boolean {
    if (!this.email) {
      uni.showToast({ title: '请输入邮箱', icon: 'none' });
      return false;
    }
    if (!this.password) {
      uni.showToast({ title: '请输入密码', icon: 'none' });
      return false;
    }
    return true;
  }

  // 提交绑定的邮箱
  async clickBtn() {
    // 判断输入框是否为空
    if (!this.checkValue()) return;

    // 让按钮的loading 动起来
    this.loading = true;
    uni.showLoading({ title: '请稍候', mask: true });

    try {
      // 换绑邮箱的请求
      await editEmailRequest({
        newEmail: this.email,
        password: this.password,
        VCode: +this.VCode,
      });
      this.loading = false;
      uni.hideLoading();
      uni.showToast({ title: '更新邮箱成功,请重新登录' });
      uni.navigateTo({ url: '/pages/login/login' });
    } catch ({ response: { data } }) {
      this.loading = false;
      uni.hideLoading();
      uni.showToast({ title: data.message, icon: 'none' });
    }
  }
}
</script>

<style lang="scss" scoped>
.input-list {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20rpx;

  .item-input {
    box-sizing: border-box;
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid $borderColor;
    margin: 10rpx 0;
  }

  .item-input-placeholder {
    font-size: $fontSize;
  }
}

.btn {
  background: #ffe933;
  color: #000000;
  margin: 30rpx 20rpx;
}
</style>
