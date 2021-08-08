<template>
  <view>
    <view class="mask" v-if="show"></view>
    <block v-if="show">
      <view class="animate__animated animate__bounceInUp">
        <view class="popup-box">
          <view class="m-img-box">
            <image class="img" src="/static/bullet-frame-icon.png" mode="aspectFit"></image>
          </view>
          <view class="text">1. 涉及黄色,政治,广告及骚扰信息</view>
          <view class="text">2. 涉及人身攻击</view>
          <view class="text">3. 留联系方式,透露他人隐私</view>
          <view class="text">一经核实将被封禁, 情节严重者永久封禁</view>
          <view class="realize" @tap="confirm">我知道了</view>
          <view class="placeholder"></view>
        </view>
      </view>
    </block>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';

@Component({ components: { UniPopup } })
export default class Popup extends Vue {
  @Prop({ type: Boolean, default: false })
  private show!: boolean;

  confirm() {
    //  点击确认执行的函数
    this.$emit('confirm');
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.mask {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background: #bbbbbb88;
}
.popup-box {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650rpx;
  background: #ffffff;
  border-radius: 10rpx;
  box-sizing: border-box;

  .m-img-box {
    width: 100%;
    height: 200rpx;
    padding: 25rpx 0;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    width: 100%;
    padding: 10rpx 20rpx;
    font-size: 30rpx;
  }

  .realize {
    box-sizing: border-box;
    @include centered;
    width: 600rpx;
    height: 100rpx;
    margin: 20rpx 25rpx;
    background: #ffe934;
  }

  .placeholder {
    height: 20rpx;
  }
}
</style>
