<template>
  <scroll-view :scroll-x="true" :scroll-y="false" class="scroll-box">
    <block v-for="(item, index) in list" :key="item.id">
      <view @tap="itemClick(index)" :class="[{ active: index === activeIndex }, 'item']" :style="itemStyle">
        {{ item.title }}
      </view>
    </block>
  </scroll-view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class HomeTopBar extends Vue {
  @Prop(Number)
  private activeIndex!: number;

  @Prop({ type: String, default: '' })
  private itemStyle!: string;

  @Prop(Array)
  private list!: { id: number; title: string }[];

  private itemClick(index: number): void {
    this.$emit('currentSwiperIndexChange', index);
  }
}
</script>

<style lang="scss" scoped>
.scroll-box {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  white-space: nowrap;
  border-bottom: 1px solid $borderColor;
}

.item {
  position: relative;
  display: inline-block;
  width: 120rpx;
  text-align: center;
  font-size: 32rpx;
  color: #000000;
}

.active:after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 20rpx;
  transform: translateX(-50%);
  display: inline-block;
  width: 70rpx;
  height: 10rpx;
  background: #fbe351;
  border-radius: 20rpx !important;
}
</style>
