<template>
  <view>
    <nav-bar title="添加好友" page-path="/pages/news/news"></nav-bar>
    <!--    v-model="searchText"-->
    <view class="msg">互相关注后可以向该好友发起聊天</view>
    <uni-search-bar
      cancelButton="none"
      maxlength="40"
      class="test"
      cancel-button="auto"
      :focus="searchFocus"
      @confirm="searchConfirm"
      @clear="searchClear"
      v-model="searchInput"
    ></uni-search-bar>
    <view class="box">
      <view v-show="isShowSearchHistory">
        <view class="title">搜索历史</view>
        <view class="search-list">
          <block v-for="(item, index) in searchHistory" :key="index">
            <text class="search-history" @tap="searchConfirm({ value: item })">{{ item }}</text>
          </block>
          <view v-if="!searchHistory.length" style="font-size: 28rpx; text-align: center; width: 100%"> 没有记录 </view>
        </view>
      </view>
      <view v-show="isShowEmpty">
        <empty />
      </view>
      <block v-for="item in userList" :key="item.id">
        <news-list :data="item" @openChat="openUser(item.id)"> <view slot="right"></view></news-list>
      </block>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import UniSearchBar from '@components/uni-search-bar/uni-search-bar.vue';
import NewsList from '@pages/news/components/news-list/news-list.vue';
import { IUser } from '@store/module/user';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { SEARCH_ADD_FRIEND_HISTORY } from '@common/constant/storage.constant';
import { searchUserRequest } from '@services/user.request';
import Empty from '@components/empty/empty.vue';
import { namespace } from 'vuex-class';

const UserModule = namespace('userModule');

let timer: number | undefined;

@Component({
  components: { Empty, NewsList, NavBar, UniSearchBar },
})
export default class AddFriend extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private userList: IUser[] = [];
  // private searchText: string = '';
  private searchFocus: boolean = true;
  private searchHistory: string[] = [];
  private searchInput: string = '';
  // 是否显示搜索历史
  private isShowSearchHistory: boolean = true;
  // 是否显示空
  private isShowEmpty: boolean = false;

  async created() {
    try {
      this.searchHistory = await this.getSearchHistory();
    } catch (err) {
      console.log(err);
    }
  }

  // 搜索
  async searchConfirm({ value }: { value: string }) {
    const isExists: boolean = await this.getData(value);
    this.isShowEmpty = !isExists;
    this.isShowSearchHistory = !isExists;
    this.searchInput = value;
    try {
      let searchHistory: string[] = await this.getSearchHistory();
      searchHistory.push(value);
      if (searchHistory.length >= 10) {
        searchHistory = searchHistory.slice(searchHistory.length - 11);
      }
      this.searchHistory = searchHistory;
      this.setSearchHistory(searchHistory);
    } catch (err) {
      this.setSearchHistory([value]);
    }
  }
  // 打开user页面
  openUser(id: number) {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${id}` });
  }

  async getData(value: string): Promise<boolean> {
    uni.showLoading({});
    const result: AxiosResponse<IResponse<IUser[]>> = await searchUserRequest(value);
    this.userList = result.data.data;
    uni.hideLoading();
    return result.data.data.length > 0;
  }

  // 清除搜索框事件
  async searchClear() {
    this.isShowSearchHistory = true;
    this.userList = [];
    this.isShowEmpty = false;
    this.searchHistory = await this.getSearchHistory();
  }

  // 读取搜索历史记录
  async getSearchHistory(): Promise<string[]> {
    await new Promise((resolve) => {
      if (!this.userInfo.id) {
        timer = setInterval(() => {
          if (this.userInfo.id) {
            clearInterval(timer);
            resolve('');
          }
        }, 50);
      } else {
        resolve('');
      }
    });

    const content: string[] | '' = uni.getStorageSync(SEARCH_ADD_FRIEND_HISTORY(this.userInfo.id));
    if (typeof content !== 'string') {
      return content;
    }
    return [];
  }
  // 写入搜索历史记录
  setSearchHistory(content: string[]) {
    uni.setStorageSync(SEARCH_ADD_FRIEND_HISTORY(this.userInfo.id), content);
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 20rpx;

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

  .title {
    font-size: 30rpx;
  }

  .btn-box {
    width: 100rpx;
    height: 50rpx;
    background: #5cb2fb;
    border-radius: 20rpx;
    color: #faffff;
    font-size: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.msg {
  @include centered;
  width: 100%;
  height: 70rpx;
  font-size: 24rpx;
  background: #f6f6f6;
  color: #989898;
}
</style>
