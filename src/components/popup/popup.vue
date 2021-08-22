<template>
  <view class="box" v-if="show">
    <view class="mask" v-if="show"></view>
    <block>
      <view class="animate__animated animate__bounceInUp">
        <view class="popup-box">
          <slot></slot>
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
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.box {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .mask {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    background: #bbbbbb88;
  }
}
</style>
