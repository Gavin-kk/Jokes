<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="绑定邮箱" />
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
      <verification-code-input-box type="email" :value="email">
        <input
          slot="input"
          class="input"
          type="text"
          v-model="eMailVerificationCode"
          placeholder="请输入邮箱验证码"
          placeholder-class="item-input-placeholder"
        />
      </verification-code-input-box>
    </view>
    <!--    <view class="err-msg" v-show="passwordConsistencyCheck"><view class="iconfont icon-guanyuwomen"></view>{{ errMsg }}</view>-->
    <!--    <button-encapsulation text="完成" @clickBtn="clickBtn" />-->
    <button :loading="loading" :disabled="loading" @tap="clickBtn" class="btn">完成</button>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ButtonEncapsulation from '@components/button-encapsulation/button-encapsulation.vue';
import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';

@Component({ components: { VerificationCodeInputBox, NavBar, ButtonEncapsulation, UniNavBar } })
export default class BindEmail extends Vue {
  private email: string = '';
  private password: string = '';
  // 邮箱的验证码
  private eMailVerificationCode: string = '';
  // 按钮的loading
  private loading: boolean = false;

  created() {
    //  判断是否登录 如果未登录跳转到登陆页面
  }

  checkEmail(): boolean {
    const emailReg = /^[^_$].{4,}@(163|126|qq|sina)\.(com|cn|net)$/;
    return emailReg.test(this.email);
  }

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
  clickBtn() {
    // 判断输入框是否为空
    if (!this.checkValue()) return;

    // 让按钮的loading 动起来
    this.loading = true;
    uni.showLoading({ title: '请稍候', mask: true });
    setTimeout(() => {
      // 取到数据 停止loading 和 disabled
      this.loading = false;
      uni.hideLoading();
    }, 1000);
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

  //.verification-code {
  //  @include bothSides;
  //  box-sizing: border-box;
  //  width: 100%;
  //  height: 80rpx;
  //  padding: 0 20rpx;
  //  border-bottom: 1px solid $borderColor;
  //
  //  .get-btn {
  //    font-size: $fontSize;
  //  }
  //  .countdown {
  //    font-size: $fontSize;
  //  }
  //}
}

.btn {
  background: #ffe933;
  color: #000000;
  margin: 30rpx 20rpx;
}
</style>
