<template>
  <view class="mask" :class="maskState === 0 ? 'none' : maskState === 1 ? 'show' : ''" @click="toggleMask">
    <view class="mask-content animate__animated animate__fadeInUp" @click.stop.prevent="stopPrevent">
      <view class="mask-content-topbar">
        <view class="left" @click="toggleMask">取消</view>
        <view class="right" @click="pubComment">反馈</view>
      </view>
      <view class="mask-content-input">
        <textarea
          class="textarea"
          v-model="content"
          :placeholder="placeholder"
          :cursor-spacing="100"
          :show-confirm-bar="false"
          :focus="focus"
          maxlength="140"
        ></textarea>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ygcComment',
  // 属性
  props: {
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      maskState: 0,
      content: '',
      focus: false,
    };
  },
  methods: {
    stopPrevent() {},
    toggleMask(type) {
      const timer = type === 'show' ? 10 : 300;
      const state = type === 'show' ? 1 : 0;
      // this.maskState = 2;
      setTimeout(() => {
        this.maskState = state;
        // #ifdef APP-PLUS
        // 安卓app软键盘自动弹出有点问题，暂时还没有很好的解决方案，所以就禁止安卓app软键盘自动弹出，如果哪位朋友有好的解决方案可以在评论里告诉大家参考一下
        if (uni.getSystemInfoSync().platform == 'ios') {
          this.focus = !!this.maskState;
        }
        // #endif
        // #ifndef APP-PLUS
        this.focus = !!this.maskState;
        // #endif
      }, timer);
    },
    pubComment() {
      this.$emit('pubComment', this.content);
    },
  },
};
</script>

<style lang="scss" scoped>
$font-color-base: #606266;
$base-color: #ffe933;
.mask {
  transition: all 0.3s;
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 9995;
  -webkit-transition: 0.3s;
  .mask-content {
    transition: all 0.3s;
    width: 100%;
    background: #ffffff;
    transform: translateY(100%);
    -webkit-transition: 0.3s; //底部弹出的持续时间
    // overflow-y:scroll;
    display: flex;
    flex-direction: column;
    .mask-content-topbar {
      transition: all 0.3s;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20upx 30upx 10upx;
      font-size: 32upx;
      .left {
        transition: all 0.3s;
        padding: 10upx 0upx;
        color: $font-color-base;
      }
      .right {
        transition: all 0.3s;
        padding: 10upx 100upx;
        border-radius: 6upx;
        color: #000;
        font-weight: 500;
        background-color: $base-color;
      }
    }
    .mask-content-input {
      transition: all 0.3s;
      width: 718upx; //如果textarea的宽带有问题可以把width改为100%试试
      // width: 100%;
      padding: 10upx 16upx 20upx;
      .textarea {
        height: 100px;
        width: 686upx; //如果textarea的宽带有问题可以把width改为100%试试
        // width: 100%;
        padding: 16upx;
        border: 2upx solid #d5d5d6;
        border-radius: 8upx;
      }
    }
  }
  &.none {
    display: none;
  }
  &.show {
    background: rgba(0, 0, 0, 0.4);
    .mask-content {
      transform: translateY(0);
    }
  }
}
</style>
