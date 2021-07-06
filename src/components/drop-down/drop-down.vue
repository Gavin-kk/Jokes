<template>
  <view>
    <view class="select-list" v-show="isShowSelectList">
      <view
        v-for="(item, index) in selectList"
        :key="item.id"
        :class="[{ border: selectList.length - 1 !== index }, 'select-item']"
        @tap="selectEvent(index)"
        >{{ item.name }}</view
      >
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

type Select = { id: number; name: string };

@Component({})
export default class DropDown extends Vue {
  private currentSelectedIndex: number = 0;
  @Prop(Boolean)
  private isShowSelectList: boolean = false;
  @Prop(Array)
  private selectList: Select[] = [
    { id: 2, name: '所有人可见' },
    { id: 3, name: '仅自己可见' },
  ];
  selectEvent(index: number): void {
    this.currentSelectedIndex = index;
    this.isShowSelectList = false;
  }
}
</script>

<style lang="scss" scoped>
.select-list {
  width: 180rpx;
  height: 120rpx;
  text-align: center;
  position: absolute;
  top: 90rpx;
  left: -10rpx;
  box-shadow: 0 3px 15px 0 #cccccc;
  border-top: none;
  z-index: -1;

  .select-item {
    line-height: 60rpx;
  }
  .border {
    border-bottom: 1px solid #cccccc;
  }
}
</style>
