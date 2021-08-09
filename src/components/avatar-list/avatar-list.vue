<template>
  <view class="box" @tap="clickItem">
    <template v-if="picIsExists">
      <view class="image-box">
        <image class="image" :src="picC" mode="aspectFill"></image>
      </view>
    </template>
    <view class="content">
      <view class="title">{{ titleC }}</view>
      <view class="bottom">
        <view class="desc">{{ descC }}</view>
        <view class="count"> 帖子 {{ countC }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';

@Component({})
export default class AvatarList extends Vue {
  @PropSync('title', { type: String, default: '1234' })
  private titleC!: { title: string; count: number; pic: string };
  @PropSync('pic', { type: String, default: '' })
  private picC!: string;
  @PropSync('count', { type: Number, default: 0 })
  private countC!: string;
  @PropSync('desc', { type: String, default: '' })
  private descC!: string;
  @Prop({ type: Number, required: true })
  private index!: number;

  get picIsExists(): boolean {
    return this.picC !== '';
  }

  clickItem() {
    this.$emit('clickItem', this.index);
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  height: 140rpx;
  box-sizing: border-box;
  margin: 20rpx;
  border-bottom: 1px solid #e9e8e8;

  .image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    border-radius: 10rpx;
    overflow: hidden;
    margin-right: 30rpx;
    flex-shrink: 0;

    .image {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    flex-grow: 1;
    height: 120rpx;

    .title {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: 500;
      height: 45rpx;
    }
    .bottom {
      height: 50rpx;
      color: #bbbbbb;
      font-size: 20rpx;
      .desc {
        @include ellipsis(550rpx);
        height: 30rpx;
        flex-shrink: 0;
      }
    }
  }
}
</style>
