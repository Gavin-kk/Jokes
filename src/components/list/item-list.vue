<template>
  <view class="h-box">
    <block v-for="item in list" :key="item.text">
      <view class="box" hover-class="box-click" @tap="clickListEvent(item)">
        <view class="left">
          <view :class="['iconfont', iconExists(item.iconfontClass)]" :style="{ color: item.color }">
            <text class="text">{{ item.text }}</text>
          </view>
        </view>
        <view class="right iconfont icon-jinru"></view>
      </view>
    </block>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface IItemList {
  iconfontClass?: string;
  text: string;
  color?: string;
  url?: string; // 本地的路由页面
}

@Component({})
export default class ItemList extends Vue {
  @Prop(Array)
  private list!: IItemList[];

  clickListEvent(item: IItemList) {
    this.$emit('clickListEvent', item);
  }

  get iconExists(): (itemCLass: string) => string {
    return (itemCLass: string) => itemCLass || '';
  }
}
</script>

<style lang="scss" scoped>
.h-box {
  box-sizing: border-box;
  border-top: 1px solid $borderColor;
}

.box {
  @include bothSides;
  width: 100%;
  height: 100rpx;
  box-sizing: border-box;
  padding: 0 30rpx;
  border-bottom: 1px solid $borderColor;

  .left {
    display: flex;
    justify-content: flex-start;
    font-size: $fontSize;

    .iconfont {
      font-size: $fontSize;

      .text {
        margin-left: 20rpx;
        color: #000000 !important;
      }
    }
  }
  .right {
    color: #bbbbbb;
  }
}

.box-click {
  background: #eeeeee;
}
</style>
