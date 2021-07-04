<template>
  <view class="loading">{{ text }}</view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class PullUpLoading extends Vue {
  @Prop({ type: String, default: '上拉加载更多' })
  private text?: string;
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
