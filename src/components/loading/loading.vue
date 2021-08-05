<template>
  <image
    class="loading"
    src="/static/loading.png"
    v-show="loading"
    :style="{ transform: `rotate(${rotationUnit})` }"
  ></image>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Loading extends Vue {
  @Prop({ type: Boolean, default: false })
  private loading!: boolean;
  private degreeOfRotation: number = 360;
  private timer: number | null = null;
  // 携带旋转的单位
  get rotationUnit(): string {
    return `${this.degreeOfRotation}deg`;
  }

  @Watch('loading')
  watchLoading() {
    if (this.loading) {
      this.whirling();
    } else {
      this.stop();
    }
  }

  mounted() {
    if (this.loading) {
      this.whirling();
    }
  }

  whirling() {
    this.timer = setInterval(() => {
      this.degreeOfRotation += 360;
      if (this.degreeOfRotation > 1800) this.degreeOfRotation = 0;
    }, 500);
  }

  stop() {
    clearInterval(this.timer || undefined);
  }

  destroyed() {
    this.stop();
  }
}
</script>

<style lang="scss" scoped>
.loading {
  transition: all 0.5s;
  width: 100%;
  height: 100%;
  //min-width: 10rpx;
  //min-height: 10rpx;
  //max-height: 100rpx;
  //max-width: 100rpx;
}
</style>
