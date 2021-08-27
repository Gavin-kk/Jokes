<template>
  <view class="box" @tap="clickItem">
    <template v-if="picIsExists">
      <view class="image-box">
        <image class="image" :src="picC" mode="aspectFill"></image>
      </view>
    </template>
    <view class="content">
      <view class="content-child">
        <view :class="['title', { 'well-number': typeIsShow }]">
          {{ titleC }}
        </view>
        <view class="bottom">
          <view class="desc" :style="{ height: !countC ? '100%' : '' }">{{ descC }}</view>
          <view class="count" v-if="countC"> 帖子 {{ countC }}</view>
        </view>
      </view>
    </view>
    <view class="create-new-topic" v-if="isCreate" @tap="openCreateTopic"> 创建话题 </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { ArticleTypeEnum } from '@pages/release/release.vue';

@Component({})
export default class AvatarList extends Vue {
  @PropSync('title', { type: String, default: '' })
  private titleC!: { title: string; count: number; pic: string };
  @PropSync('pic', { type: String, default: '' })
  private picC!: string;
  @PropSync('count', { type: Number, default: 0 })
  private countC!: string;
  @PropSync('desc', { type: String, default: '' })
  private descC!: string;
  @Prop({ type: Number, required: false })
  private index!: number;
  @Prop({ type: Boolean, default: false })
  private isCreate!: boolean;
  @Prop({ type: Number })
  private type!: ArticleTypeEnum;

  get picIsExists(): boolean {
    return this.picC !== '';
  }

  get typeIsShow() {
    return this.type === ArticleTypeEnum.topic;
  }

  clickItem() {
    this.$emit('clickItem', this.index);
  }

  openCreateTopic() {
    this.$emit('openCreateTopic', this.titleC);
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  height: 160rpx;
  box-sizing: border-box;
  margin: 20rpx;
  border-bottom: 1px solid #e9e8e8;

  .image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 120rpx;
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
    display: flex;
    align-items: center;
    flex-grow: 1;
    height: 120rpx;

    .content-child {
      height: 100%;
      width: 300rpx;
      .title {
        @include ellipsis(300rpx);
        font-size: 32rpx;
        font-weight: 500;
        height: 50rpx;
        line-height: 50rpx;
      }
      .well-number {
        &:after,
        &:before {
          content: '#';
          font-size: 20rpx;
          box-sizing: border-box;
          padding: 5rpx;
        }
      }
      .bottom {
        height: 50rpx;
        color: #bbbbbb;
        font-size: 20rpx;
        .desc {
          display: flex;
          align-items: center;
          @include ellipsis(350rpx);
          height: 30rpx;
          flex-shrink: 0;
        }
      }
    }
  }

  .create-new-topic {
    font-size: 30rpx;
    padding: 10rpx 15rpx 10rpx 15rpx;
    background: #fae651;
    border-radius: 10rpx;
  }
}
</style>
