<template>
  <view>{{ value }} </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';

@Component({ components: { UniSearchBar } })
export default class Search extends Vue {
  private value: string = '';

  mounted() {
    // #ifdef H5
    (document!.querySelector('.uni-page-head-hd') as HTMLElement).style.display = 'none';
    // #endif
  }

  // 监听原生输入框输入内容改变事件
  onNavigationBarSearchInputChanged({ text }: { text: string }) {
    this.value = text;
  }
  // 用户点击输入法中的搜索触发的事件
  onNavigationBarSearchInputConfirmed({ text }: { text: string }) {
    uni.showToast({ title: `您想搜索${text}` });
  }
  // 原生顶栏按钮点击监听事件
  onNavigationBarButtonTap(e: INavigationBarButtonTapEvent) {
    if (e.index === 0) {
      uni.navigateBack({ delta: 1 });
    }
  }
}
</script>

<style lang="scss" scoped></style>
