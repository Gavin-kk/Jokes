<template>
  <canvas canvas-id="round-schedule" class="round-schedule"></canvas>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class RoundScheduleProgress extends Vue {
  @Prop({ type: Number, default: 0 })
  private progress!: number;
  private ctx: UniApp.CanvasContext | null = null;

  @Watch('progress')
  watchProgress(newProgress: number) {
    this.drawCircle(newProgress / 100);
  }

  mounted() {
    this.drawCircle(this.progress / 100);
  }

  drawCircle(step: number) {
    this.ctx = uni.createCanvasContext('round-schedule', this);
    this.ctx.setLineWidth(4);
    this.ctx.setStrokeStyle('#cccccc');
    this.ctx.setLineCap('round');
    this.ctx.beginPath();
    this.ctx.arc(25, 25, 21, 0, 2 * Math.PI, false);
    this.ctx.stroke();
    this.ctx?.setLineWidth(4);
    this.ctx?.setStrokeStyle('#FFC055');
    this.ctx?.setLineCap('butt');
    this.ctx?.beginPath();
    // 参数step 为绘制的百分比
    if (step >= 1) {
      step = 2;
    } else {
      step *= 2;
    }
    this.ctx?.arc(25, 25, 21, 0, step * Math.PI, false);
    this.ctx?.stroke();
    this.ctx?.draw();
  }
}
</script>

<style lang="scss" scoped>
.round-schedule {
  transform: rotate(270deg);
  width: 100rpx;
  height: 100rpx;
}
</style>
