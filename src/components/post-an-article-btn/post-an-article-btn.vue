<template>
  <view class="box" :style="{ left: leftPx, top: topPx }" @touchmove.stop="move">
    <view :class="['btn', 'iconfont', iconClass]"></view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface IBoundaryValue {
  top: number;
  right: number;
  left: number;
  bottom: number;
}

let timer: number | undefined;

@Component({})
export default class PostAnArticleBtn extends Vue {
  @Prop({ type: String, default: 'icon-bianji1' })
  private iconClass!: string;
  private isShow: boolean = false;
  private left: number = 100000;
  private top: number = 100000;
  // 可用窗口高度
  private windowHeight: number = 0;
  // 可用窗口宽度
  private windowWidth: number = 0;
  // box 高度
  private boxHeight: number = 0;
  // box 宽度
  private boxWidth: number = 0;
  // 左右上下边界值
  private boundaryValue: IBoundaryValue = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  };

  get leftPx(): string {
    if (!this.isShow) {
      return '10000px';
    }
    if (this.left - this.boxWidth / 2 > this.boundaryValue.right) {
      this.left = this.boundaryValue.right + this.boxWidth / 2;
    }
    if (this.left <= this.boxWidth) {
      this.left = this.boxWidth / 2;
    }
    if (this.left > this.windowWidth / 2) {
      this.left = this.boundaryValue.right + this.boxWidth / 2;
    } else {
      this.left = this.boxWidth / 2;
    }
    return `${this.left}px`;
  }

  get topPx(): string {
    if (!this.isShow) {
      return '10000px';
    }
    if (this.top - this.boxHeight / 2 > this.boundaryValue.bottom) {
      this.top = this.boundaryValue.bottom + this.boxHeight / 2;
    }
    if (this.top <= this.boxHeight) {
      this.top = this.boxHeight + 10;
    }
    return `${this.top}px`;
  }
  //
  // get transition(): string {
  //   return this.isShow ? 'all 0.2s' : 'all;';
  // }

  async mounted() {
    await this.getWindowHeightAndWidth();
    this.getBoxInfo();
  }

  // 获取窗口高度和宽度
  getWindowHeightAndWidth() {
    return new Promise((resolve, reject) => {
      uni.getSystemInfo({
        success: (res) => {
          this.windowHeight = res.windowHeight;
          this.windowWidth = res.windowWidth;
          resolve('');
        },
        fail: () => {
          reject(new Error('未获取到窗口高度和宽度'));
        },
      });
    });
  }
  // 获取盒子的高度和宽度
  getBoxInfo() {
    uni
      .createSelectorQuery()
      .in(this)
      .select('.box')
      .boundingClientRect((res) => {
        if (res && res.height && res.width) {
          this.boxHeight = res.height;
          this.boxWidth = res.width;
          this.top = this.windowHeight - res.height / 2;
          this.left = this.windowWidth - res.width / 2;
          this.boundaryValue.right = this.windowWidth - this.boxWidth;
          this.boundaryValue.bottom = this.windowHeight - this.boxHeight;
          this.boundaryValue.left = this.boxWidth;
          this.boundaryValue.top = this.boxHeight;
          this.isShow = true;
        }
      })
      .exec();
  }

  move(e: { changedTouches: { clientX: number; clientY: number; pageX: 40; pageY: 61 }[] }) {
    if (typeof timer === 'undefined') {
      timer = setTimeout(() => {
        this.left = e.changedTouches[0].clientX;
        this.top = e.changedTouches[0].clientY;
      }, 100);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.left = e.changedTouches[0].clientX;
        this.top = e.changedTouches[0].clientY;
      }, 100);
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: fixed;
  right: 0;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fae351;
  transform: translate(-50%, -50%);
  transition: all 0.2s;
}
</style>
