<template>
  <view>
    <template v-if="!isDetailShow">
      <!-- 预览列表-->
      <block v-for="item in data" :key="item.id">
        <search-list :data="item" @clickItem="clickToPreviewTheItem"></search-list>
      </block>
    </template>
    <template v-else>
      <!-- 详细列表-->
      <block v-for="item in data" :key="item.id">
        <dynamic :moment-data="item"></dynamic>
      </block>
      <pull-up-loading :text="pullMsg"></pull-up-loading>
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';
import SearchList from '@components/search-preview/search-preview.vue';
import { IArticle } from '@pages/home/store';
import { searchArticlesRequest } from '@services/home.request';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import Dynamic from '@components/dynamic/dynamic.vue';

let timer: number | undefined;
@Component({ components: { Dynamic, PullUpLoading, SearchList, UniSearchBar } })
export default class Search extends Vue {
  private value: string = '';
  private data: IArticle[] = [];
  // 搜索的页码 搜索预览也就是用户没点软键盘上的搜索按钮执行输入搜索时预览的 title 那个搜索页码只能为 1 否则太多了
  private pageNum: number = 1;
  private pullMsg: LoadingStatus = LoadingStatus.load;
  // 是否显示详细内容
  private isDetailShow: boolean = false;

  mounted() {
    // #ifdef H5
    (document!.querySelector('.uni-page-head-hd') as HTMLElement).style.display = 'none';
    // #endif
  }

  // 点击预览的列表项事件
  clickToPreviewTheItem(data: IArticle) {
    uni.navigateTo({
      url: `/pages/content/content?id=${data.id}`,
    });
  }

  // 监听原生输入框输入内容改变事件
  onNavigationBarSearchInputChanged({ text }: { text: string }) {
    this.isDetailShow = false;
    this.value = text;
    this.data = [];
    if (typeof timer !== 'undefined') {
      clearInterval(timer);
      timer = setTimeout(this.search, 200);
      return;
    }
    timer = setTimeout(this.search, 200);
  }
  // 监听页面滚动到底部事件
  async onReachBottom() {
    this.pullMsg = LoadingStatus.loading;
    this.pageNum++;
    const isShowMsg: boolean | undefined = await this.search(this.pageNum);
    isShowMsg && typeof isShowMsg !== 'undefined'
      ? (this.pullMsg = LoadingStatus.load)
      : (this.pullMsg = LoadingStatus.air);
  }

  // 发送搜索请求
  async search(pageNum: number = 1): Promise<boolean | undefined> {
    if (!this.value) {
      this.data = [];
      return;
    }
    try {
      const result: AxiosResponse<IResponse<IArticle[]>> = await searchArticlesRequest(this.value, pageNum);
      if (result.data.data.length === 0) {
        // eslint-disable-next-line consistent-return
        return false;
      }

      this.data.push(...result.data.data);
      // eslint-disable-next-line consistent-return
      return true;
    } catch ({ response }) {
      console.log(response);
    }
  }

  // 用户点击输入法中的搜索触发的事件
  onNavigationBarSearchInputConfirmed({ text }: { text: string }) {
    this.isDetailShow = true;
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
