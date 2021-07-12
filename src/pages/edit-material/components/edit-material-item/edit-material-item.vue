<template>
  <view class="item-box">
    <view class="left">
      {{ title }}
    </view>
    <view class="right" @tap="clickRight">
      <template v-if="!isUseSlot">
        <!--      头像图片-->
        <view class="avatar-box" v-if="avatar">
          <image class="avatar" :src="avatar" mode="aspectFill"></image>
        </view>
        <!--      输入框-->
        <view v-else-if="isInput" class="input-box">
          <input type="text" v-model="inputValue" @blur="inputBlur" class="input" />
        </view>
        <!--      基本内容-->
        <view v-else>
          <view class="option">{{ options }}</view>
        </view>
      </template>
      <template v-else>
        <slot></slot>
      </template>
      <view class="iconfont icon-bianji1"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class EditMaterialItem extends Vue {
  private inputValue: string = '';

  @Prop({ type: String, default: '' })
  private title!: string;
  @Prop({ type: String, default: '' })
  private avatar!: string;
  @Prop(String)
  private options!: string;
  @Prop({ type: Boolean, default: false })
  private isInput!: boolean;
  @Prop({ type: Boolean, default: false })
  private isUseSlot!: boolean;

  created() {
    if (this.isInput) {
      this.inputValue = this.options;
    }
  }

  // input失去焦点
  inputBlur() {
    this.$emit('blur', this.inputValue);
  }

  clickRight() {
    this.$emit('clickRight');
  }
}
</script>

<style lang="scss" scoped>
.item-box {
  @include bothSides;
  width: 100%;
  padding: 0 20rpx;
  height: 120rpx;
  box-sizing: border-box;
  border-bottom: 1px solid $borderColor;

  .left {
    font-size: 32rpx;
    color: #696969;
    flex-shrink: 0;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    //width: 150rpx;
    @include ellipsis(480rpx);
    height: 100%;

    .avatar-box {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      overflow: hidden;

      .avatar {
        width: 100%;
        height: 100%;
      }
    }
    // 输入框
    .input-box {
      max-width: 400rpx;
      .input {
        text-align: right;
      }
    }

    .option {
      font-size: 32rpx;
      width: 100%;
    }

    .icon-bianji1 {
      margin-left: 20rpx;
      font-size: 38rpx;
      color: #969494;
    }
  }
}
</style>
