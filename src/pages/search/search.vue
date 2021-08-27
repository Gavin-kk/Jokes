<template>
  <view>
    <view class="top"></view>
    <uni-search-bar
      focus
      v-model="value"
      cancelButton="always"
      cancelText="返回"
      @confirm="confirm"
      @cancel="comeBack"
    ></uni-search-bar>
    <view v-show="isShowSearchHistory">
      <view class="title">搜索历史</view>
      <view class="search-list">
        <block v-for="(item, index) in searchHistory" :key="index">
          <text class="search-history" @tap="searchConfirm(item)">{{ item }}</text>
        </block>
        <view v-if="!searchHistory.length" style="font-size: 28rpx; text-align: center; width: 100%"> 没有记录 </view>
      </view>
    </view>
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
      <view v-if="!data.length">
        <empty />
      </view>
      <!--      <pull-up-loading v-if="data.length" :text="pullMsg"></pull-up-loading>-->
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';
import SearchList from '@components/search-preview/search-preview.vue';
import { IArticle } from '@pages/home/store';
import { searchArticlesRequest } from '@services/home.request';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import Dynamic from '@components/dynamic/dynamic.vue';
import Empty from '@components/empty/empty.vue';
import { ARTICLE_SEARCH_HISTORY } from '@common/constant/storage.constant';
import { IUser, UserModule } from '@store/module/user';

let timer: number | undefined;
@Component({ components: { Empty, Dynamic, PullUpLoading, SearchList, UniSearchBar } })
export default class Search extends Vue {
  @UserModule.State('userInfo')
  private userInfo?: IUser;
  private value: string = '';
  private data: IArticle[] = [];
  // 搜索的页码 搜索预览也就是用户没点软键盘上的搜索按钮执行输入搜索时预览的 title 那个搜索页码只能为 1 否则太多了
  private pageNum: number = 1;
  private pullMsg: LoadingStatus = LoadingStatus.load;
  // 是否显示详细内容
  private isDetailShow: boolean = false;
  // 搜索的历史
  private searchHistory: string[] = [];
  private isShowSearchHistory: boolean = true;

  @Watch('value')
  watchValue(value: string) {
    this.valueChange(value);
  }

  created() {
    this.getCache();
  }

  mounted() {
    // #ifdef H5
    // (document!.querySelector('.uni-page-head-hd') as HTMLElement).style.display = 'none';
    // #endif
  }

  // 点击预览的列表项事件
  clickToPreviewTheItem(data: IArticle) {
    uni.navigateTo({
      url: `/pages/content/content?id=${data.id}`,
    });
  }

  // 监听原生输入框输入内容改变事件
  valueChange(text: string) {
    this.isDetailShow = false;
    this.value = text;
    this.data = [];
    if (typeof timer !== 'undefined') {
      clearInterval(timer);
      timer = setTimeout(() => {
        this.search();
      }, 200);
      return;
    }
    timer = setTimeout(() => {
      this.search();
    }, 200);
  }

  /*
  // 监听页面滚动到底部事件
  async onReachBottom() {
    this.pullMsg = LoadingStatus.loading;
    this.pageNum++;
    const isShowMsg: boolean | undefined = await this.search(this.pageNum);
    isShowMsg ? (this.pullMsg = LoadingStatus.load) : (this.pullMsg = LoadingStatus.air);
  }
*/

  // 发送搜索请求
  async search(pageNum: number = 1): Promise<boolean | undefined> {
    if (!this.value) {
      this.data = [];
      return;
    }
    try {
      const result: AxiosResponse<IResponse<IArticle[]>> = await searchArticlesRequest(this.value, pageNum);
      if (result.data.data.length === 0) {
        this.data = [];
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

  // 点击搜索记录搜索
  async searchConfirm(value: string) {
    this.value = value;
    await this.search();
    this.isDetailShow = true;
  }

  // 保存搜索记录
  saveSearchRecords(value: string) {
    uni.getStorage({
      key: ARTICLE_SEARCH_HISTORY(this.userInfo?.id || 0),
      success: (res: { data: string[] }) => {
        res.data.push(value);
        const data = res.data.splice(res.data.length - 10);
        this.searchHistory = data;
        uni.setStorage({
          key: ARTICLE_SEARCH_HISTORY(this.userInfo?.id || 0),
          data,
        });
      },
      fail: () => {
        uni.setStorage({
          key: ARTICLE_SEARCH_HISTORY(this.userInfo?.id || 0),
          data: [value],
        });
      },
    });
  }

  // 获取本地缓存的搜索记录
  getCache() {
    uni.getStorage({
      key: ARTICLE_SEARCH_HISTORY(this.userInfo?.id || 0),
      success: (res: { data: string[] }) => {
        this.searchHistory = res.data.slice(res.data.length - 10);
      },
    });
  }

  // 用户点击输入法中的搜索触发的事件
  confirm({ value }: { value: string }) {
    this.isDetailShow = true;
    // 存储搜索记录
    this.saveSearchRecords(value);
  }

  // 原生顶栏按钮点击监听事件
  comeBack() {
    const pages: any = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack({ delta: 1 });
    } else {
      uni.switchTab({
        url: '/pages/home/home',
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  margin-top: var(--status-bar-height);
}
.title {
  font-size: 30rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
}

.search-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10rpx;
  .search-history {
    box-sizing: border-box;
    padding: 10rpx;
    border-radius: 20rpx;
    background: #f8f8f8;
    font-size: 28rpx;
    margin: 15rpx;
  }
}
</style>
