<template>
  <view class="loading">{{ text }}</view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { LoadingStatus } from '@components/sliding-list/loading-status';

@Component({})
export default class PullUpLoading extends Vue {
  @Prop({ type: String, default: LoadingStatus.load })
  private text?: string;

  @Watch('text')
  sdf(newText: string) {
    // console.log(newText, 1);
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global.scss';

.loading {
  @include centered;
  width: 100%;
  height: 100rpx;
  font-size: 28rpx;
  color: #aaaaaa;
}
</style>
