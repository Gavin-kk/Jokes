<template>
  <view>
    <view class="grade" :style="{ background: tagBgColor }">
      <view :class="['iconfont', genderIconClassName]">{{ age }}</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export const enum Gender {
  male,
  female,
}
@Component({})
export default class GenderTag extends Vue {
  @Prop({ type: Number, default: 0 })
  gender!: Gender;
  @Prop({ type: Number, default: 0 })
  age!: number;

  get tagBgColor(): string {
    return this.gender === Gender.male ? '#44b3ff' : '#ff6a8d';
  }

  get genderIconClassName(): string {
    return this.gender === Gender.male ? 'icon-nan' : 'icon-nv';
  }
}
</script>

<style lang="scss" scoped>
.grade {
  @include centered;
  height: 30rpx;
  box-sizing: border-box;
  border: 1px solid #f1f1f1;

  border-radius: 30rpx;
  overflow: hidden;
  padding: 0 10rpx;
  margin-left: 10rpx;

  .iconfont {
    font-size: 24rpx;
    color: #dbf0ff;
  }
}
</style>
