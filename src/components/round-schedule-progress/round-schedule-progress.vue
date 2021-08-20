<template>
  <canvas canvas-id="round-schedule" class="round-schedule"></canvas>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class RoundScheduleProgress extends Vue {
  @Prop({ type: String, default: '#FFC055' })
  private color!: string;
  @Prop({ type: String, default: '#cccccc' })
  private bgColor!: string;
  @Prop({ type: Number, default: 0 })
  private progress!: number;
  @Prop({ type: Number, default: 25 })
  private x!: number;
  @Prop({ type: Number, default: 25 })
  private y!: number;
  @Prop({ type: Number, default: 21 })
  private r!: number;

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
    this.ctx.setStrokeStyle(this.bgColor);
    this.ctx.setLineCap('round');
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.ctx.stroke();
    this.ctx.setLineWidth(4);
    this.ctx.setStrokeStyle(this.color);
    this.ctx.setLineCap('butt');
    this.ctx.beginPath();
    // 参数step 为绘制的百分比
    if (step >= 1) {
      step = 2;
    } else {
      step *= 2;
    }
    this.ctx.arc(this.x, this.y, this.r, 0, step * Math.PI, false);
    this.ctx.stroke();
    this.ctx.draw();
  }
}
</script>

<style lang="scss" scoped>
.round-schedule {
  transform: rotate(270deg);
  max-width: 100rpx;
  max-height: 100rpx;
}
</style>
