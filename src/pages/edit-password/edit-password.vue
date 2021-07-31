<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="修改密码" page-path="/pages/settings/settings" />
    <!--    输入框-->
    <view class="input-list">
      <input
        class="item-input"
        type="password"
        v-model="newPassword"
        placeholder="输入新密码"
        placeholder-class="item-input-placeholder"
      />
      <input
        class="item-input"
        type="password"
        v-model="confirmPassword"
        placeholder="输入确认密码"
        placeholder-class="item-input-placeholder"
      />
      <verification-code-input-box type="email" :value="userInfo.email" :email-type="1">
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
import { Vue, Component, Mixins } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import ButtonEncapsulation from '@components/button-encapsulation/button-encapsulation.vue';
// import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import VerificationCodeInputBox from '@components/verification-code-input-box/verification-code-input-box.vue';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import { UserStoreActionType } from '@store/module/user/constant';
import { ModuleConstant } from '@store/module.constant';
import CheckLoginMixin from '@src/mixins/check-login.mixin';

const UserModule = namespace('userModule');
@Component({ components: { VerificationCodeInputBox, NavBar, ButtonEncapsulation, UniNavBar } })
export default class EditPassword extends Mixins(CheckLoginMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  @UserModule.State('isLogin') isLogin!: boolean;
  private newPassword: string = '';
  private confirmPassword: string = '';
  private VCode: number | null = null;
  // 按钮的loading
  private loading: boolean = false;

  checkValue(): boolean {
    if (!this.newPassword) {
      uni.showToast({ title: '请输入新密码', icon: 'none' });
      return false;
    }
    if (!this.confirmPassword) {
      uni.showToast({ title: '请输入确认密码', icon: 'none' });
      return false;
    }
    if (!this.VCode) {
      uni.showToast({ title: '请输入验证码', icon: 'none' });
      return false;
    }
    return true;
  }

  // 提交修改的密码
  async clickBtn() {
    // 判断输入框是否为空
    if (!this.checkValue()) return;
    // 判断密码一致性
    if (this.confirmPassword !== this.newPassword) {
      uni.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    // 让按钮的loading 动起来
    this.loading = true;
    uni.showLoading({ title: '请稍候', mask: true });
    try {
      await this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.MODIFY_USER_PASSWORD}`, {
        newPassword: this.newPassword,
        VCode: +this.VCode!,
      });
      // 取到数据 停止loading 和 disabled
      this.loading = false;
      uni.hideLoading();
      uni.showToast({ title: '修改成功' });
    } catch (err) {
      this.loading = false;
      uni.hideLoading();
      uni.showToast({ title: '修改密码失败', icon: 'none' });
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
