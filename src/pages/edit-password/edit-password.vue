<template>
  <view>
    <!--     导航栏-->
    <nav-bar title="修改密码" />
    <!--    输入框-->
    <view class="input-list">
      <input
        type="password"
        v-model="oldPassword"
        class="item-input"
        placeholder="输入旧密码"
        placeholder-class="item-input-placeholder"
      />
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

@Component({ components: { NavBar, ButtonEncapsulation, UniNavBar } })
export default class EditPassword extends Vue {
  private oldPassword: string = '';
  private newPassword: string = '';
  private confirmPassword: string = '';
  // 按钮的loading
  private loading: boolean = false;

  created() {
    //  判断是否登录 如果未登录跳转到登陆页面
  }

  checkValue(): boolean {
    if (!this.oldPassword) {
      uni.showToast({ title: '请输入旧密码', icon: 'none' });
      return false;
    }
    if (!this.newPassword) {
      uni.showToast({ title: '请输入新密码', icon: 'none' });
      return false;
    }
    if (!this.confirmPassword) {
      uni.showToast({ title: '请输入确认密码', icon: 'none' });
      return false;
    }
    return true;
  }

  // 提交修改的密码
  clickBtn() {
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
}

.btn {
  background: #ffe933;
  color: #000000;
  margin: 30rpx 20rpx;
}
</style>
