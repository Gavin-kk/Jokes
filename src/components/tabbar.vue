<template>
  <view class="tab-bar-box">
    <view class="tab-bar">
      <view :class="[{ active: getCurPages === 'home' }, 'item']">首页</view>
      <view :class="[{ active: getCurPages === 'moment' }, 'item']">关注</view>
      <view class="item">
        <view class="icon-box">
          <view class="border">
            <uni-iconss type="plusempty" size="28" class="icon" color="#fff" />
          </view>
        </view>
      </view>
      <view :class="[{ active: getCurPages === 'news' }, 'item']">消息</view>
      <view :class="[{ active: getCurPages === 'mine' }, 'item']">我的</view>
    </view>
    <view class="bottom"></view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import uniIconss from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import { IMenuActiveConfig, menuActiveConfig } from '@config/menu-active.config';

@Component({ components: { uniIconss } })
export default class TabBar extends Vue {
  get getCurPages() {
    const pages = getCurrentPages();
    const { route } = pages[pages.length - 1];
    return menuActiveConfig.find((item: IMenuActiveConfig) => item.pagePath === route)?.title;
  }
}
</script>

<style lang="scss" scoped>
.tab-bar-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  background: #000000;

  .tab-bar {
    display: flex;
    width: 100%;
    height: 50px;

    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      color: $color;

      // 选中的颜色
      &.active {
        color: #ffffff;
      }

      .icon-box {
        width: 40px;
        height: 30px;
        border-radius: 6px;
        box-sizing: border-box;
        box-shadow: -3px 0 5px 0 #e13e57;

        .border {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          box-shadow: 3px 0 5px 0 rgb(58, 193, 213);
          width: 100%;
          height: 100%;
          border: 2px solid #ffffff;
          border-radius: 6px;
        }
      }
    }
  }

  .bottom {
    height: 20px;
  }
}
</style>
