<template>
  <view class="section">
    <block v-for="item in sectionList" :key="item.text">
      <view class="item" @tap="clickItem(item)">
        <view class="count">{{ item.count }}</view>
        <view class="text">{{ item.text }}</view>
      </view>
    </block>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

type SectionItem = { count: number; text: string; url: string };
@Component({})
export default class SectionList extends Vue {
  @Prop({ type: Array, default: [] })
  private sectionList!: SectionItem[];

  clickItem(item: SectionItem) {
    uni.navigateTo({
      url: item.url,
      fail: () => {
        uni.switchTab({
          url: item.url,
        });
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.section {
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 10rpx;
  @include centered;

  .item {
    @include centered;
    flex-direction: column;
    flex: 1;
    .count {
      font-size: 38rpx;
    }
    .text {
      color: #a9a8a8;
      font-size: $fontSize;
    }
  }
}
</style>
