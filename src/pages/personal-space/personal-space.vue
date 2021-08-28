<template>
  <view class="box">
    <nav-bar-s
      class="title-bar"
      bg-color="rgba(0,0,0,0)"
      :border="false"
      color="#fff"
      :right-show="false"
      @leftClick="topbarLeftClick"
    ></nav-bar-s>
    <!--    <view class="title-bar"></view>-->
    <!--背景图-->
    <user-page-head
      class="height"
      :user.sync="userInfo"
      :constellation="calculateTheConstellation"
      :sectionList="sectionList"
      :isMe="isMe"
    />
    <!--tab导航-->
    <view class="tab">
      <home-top-bar
        class="height home-top-bar"
        :list="tabBarList"
        itemStyle="width:33%"
        :activeIndex="currentTabBarIndex"
        @currentSwiperIndexChange="swiperIndexChange"
      />
      <swiper :style="{ height: `${swiperHeight}px` }" :current="currentTabBarIndex" @change="swiperChange">
        <!--个人页-->
        <swiper-item>
          <view class="content" :id="idArr[0]">
            <view class="content-item">
              <view class="row title">账号信息</view>
              <view class="row">嘻龄: {{ usageTime }}年</view>
              <view class="row">嘻ID: {{ userInfo.id }}</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">星座: {{ calculateTheConstellation }}</view>
              <view class="row">职业: {{ info.job || ifNullText }}</view>
              <view class="row">故乡: {{ info.hometown || ifNullText }}</view>
              <view class="row">情感状态: {{ info.emotion || ifNullText }}</view>
            </view>
          </view>
        </swiper-item>
        <!--内容页-->
        <swiper-item>
          <view class="content" :id="idArr[1]">
            <block v-for="item in articleList" :key="item.id">
              <moment-list :data="item"></moment-list>
            </block>
            <template v-if="isEmptyArticle">
              <empty />
            </template>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="content" :id="idArr[2]">
            <block v-for="item in topicArticleList" :key="item.id">
              <moment-list :data="item"></moment-list>
            </block>
            <template v-if="isEmptyTopicArticle">
              <empty />
            </template>
          </view>
        </swiper-item>
      </swiper>
      <!-- 下拉加载组件-->
      <pull-up-loading v-show="isShowLoadingText" :text="dropDownLoadingText"></pull-up-loading>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UserPageHead from '@pages/personal-space/components/user-page-head/user-page-head.vue';
import SectionList from '@pages/mine/components/section-list/section-list.vue';
import HomeTopBar from '@components/home-topbar/home-topbar.vue';
import moment from 'moment';
import { getHoroscope } from '@src/utils/date-to-constellation';
import MomentList from '@components/moment-list/moment-list.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import { IUser, IUserinfo } from '@store/module/user';
import { namespace } from 'vuex-class';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { getUserInfoRequest } from '@services/user.request';
import { IArticle } from '@pages/home/store';
import { getTopicArticleListRequest, getUserArticlesRequest } from '@services/article.request';
import NavBarB from '@components/nav-bar/nav-bar.vue';
import NavBarS from '@pages/content/components/nav-bar/nav-bar.vue';
import Empty from '@components/empty/empty.vue';
import { UserStoreActionType } from '@store/module/user/constant';
import { addGuestRequest } from '@services/common.request';

moment.locale('zh-cn');

enum CurrentPage {
  homePage,
  contentPage,
  dynamicPage,
}
enum RequestTypeEnum {
  article,
  topic,
}
const UserModule = namespace('userModule');

@Component({
  components: { Empty, NavBarS, NavBarB, PullUpLoading, MomentList, SectionList, UserPageHead, HomeTopBar },
})
export default class PersonalSpace extends Vue {
  @UserModule.State('userInfo')
  private user!: IUser;
  @UserModule.Action(UserStoreActionType.GET_USER_INFO)
  private readonly getUserInfo!: () => Promise<void>;
  private userInfo: IUser | Record<string, any> = {};
  private ifNullText: string = '快去填写吧';
  // 是不是自己
  private isMe: boolean = false;
  // 用户的文章列表
  private articleList: IArticle[] = [];
  private articlePageNum: number = 1;
  // 用户的话题列表
  private topicArticleList: IArticle[] = [];
  private topicArticlePageNum: number = 1;
  // 当前用户的id
  private currentUserId: number = 0;

  //  tab导航的title
  private tabBarList: { id: number; title: string }[] = [
    { id: 1, title: '主页' },
    { id: 2, title: '文章' },
    { id: 3, title: '话题' },
  ];

  // 可用窗口的高度
  private windowHeight: number = 0;
  // 相对于窗口的swiper可用高度 用于设置最小高度
  private minHeight: number = 0;
  // 当前 swiper 的高度
  private swiperHeight: number = 0;
  // statusBar 的高度
  private navigationBarHeight: number = 44;

  // 当前tabbar所在的索引
  private currentTabBarIndex: number = CurrentPage.homePage;
  // 三个页面的loadingText
  private loadingText: string[] = [LoadingStatus.load, LoadingStatus.load, LoadingStatus.load];
  // 三个页面容器的 id
  private idArr: string[] = ['store-height', 'content-height', 'dynamic-height'];

  get info(): IUserinfo | Record<string, any> {
    return (this.userInfo.userinfo && this.userInfo.userinfo[0]) || {};
  }

  get isEmptyArticle(): boolean {
    return this.articleList.length === 0;
  }
  get isEmptyTopicArticle(): boolean {
    return this.topicArticleList.length === 0;
  }
  // 计算要不要显示loadingtext
  get isShowLoadingText() {
    return this.swiperHeight - this.windowHeight > 0;
  }
  // 下拉加载更多文本
  get dropDownLoadingText() {
    return this.loadingText[this.currentTabBarIndex];
  }
  //  计算嘻龄
  get usageTime(): string {
    return this.userInfo.createAt ? moment().diff(this.userInfo.createAt, 'month', true).toFixed(1) : '';
  }
  // 计算星座
  get calculateTheConstellation(): string {
    if (this.userInfo?.userinfo && this.userInfo.userinfo[0].birthday) {
      return getHoroscope(moment(this.userInfo?.userinfo[0]?.birthday).valueOf());
    }
    return this.ifNullText;
  }

  get sectionList(): { text: string; count: undefined | number }[] {
    return [
      { count: this.userInfo.likeCount, text: '获赞' },
      { count: this.userInfo.followCount, text: '关注' },
      { count: this.userInfo.fansCount, text: '粉丝' },
    ];
  }

  created() {
    // #ifndef MP-WEIXIN
    this.getPagesData();
    //  #endif
  }

  async mounted() {
    // #ifdef MP-WEIXIN
    this.getPagesData();
    //  #endif
    // 获取进入首页的高度
    this.getHeight(this.idArr[this.currentTabBarIndex]);
    //  获取可用窗口高度
    await this.getWindowHeight();
    // 获取swiper最小可用高度 解决屏幕左右滑动断层
    this.getMinWindowHeight();
  }

  // 获取上个页面带来的参数
  async getPagesData() {
    const pages: any = getCurrentPages();
    const {
      // options: { userId },
      options,
    } = pages[pages.length - 1];

    const userId = options?.userId;
    if (+userId === this.user.id) {
      this.isMe = true;
      await this.getUserInfo();
      this.userInfo = this.user;
    }

    if (userId) {
      this.currentUserId = +userId;
      const result: AxiosResponse<IResponse<IUser>> = await getUserInfoRequest(+userId);
      this.userInfo = result.data.data;
      await this.getData(userId, RequestTypeEnum.article);
      await this.getData(userId, RequestTypeEnum.topic);
      if (result.data.data.isMe) {
        this.isMe = true;
        if (!this.user.id) {
          await this.getUserInfo();
          this.userInfo = this.user;
        }
      } else {
        try {
          // 添加访客
          await addGuestRequest(this.userInfo.id);
        } catch (err) {}
      }
    } else {
      this.isMe = true;
      if (!this.user.id) {
        await this.getUserInfo();
      }
      this.userInfo = this.user;
      await this.getData(this.user.id, RequestTypeEnum.article);
      await this.getData(this.user.id, RequestTypeEnum.topic);
    }
  }

  async getData(userId: number, type: RequestTypeEnum) {
    if (type === RequestTypeEnum.article) {
      const articles = await getUserArticlesRequest(userId, this.articlePageNum);
      if (!articles.data.data || articles.data.data.length === 0) {
        this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.air);
      } else {
        this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.load);
      }
      this.articleList.push(...articles.data.data);
    } else {
      const topicArticles = await getTopicArticleListRequest(this.topicArticlePageNum, userId);
      if (!topicArticles.data.data || topicArticles.data.data.length === 0) {
        this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.air);
      } else {
        this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.load);
      }
      this.topicArticleList.push(...topicArticles.data.data);
    }
  }

  // 监听页面滚动到底部
  onReachBottom() {
    this.downloadData();
  }

  // tabbar切换事件
  swiperIndexChange(index: number) {
    this.currentTabBarIndex = index;
  }

  // swiper 改变事件
  swiperChange(e: { detail: { current: number } }) {
    this.getHeight(this.idArr[e.detail.current]);
    this.currentTabBarIndex = e.detail.current;
  }

  // 动态获取高度事件
  getHeight(id: string) {
    const query = uni.createSelectorQuery().in(this);
    query
      .select(`#${id}`)
      .boundingClientRect((res?) => {
        if (res?.height) {
          if (res.height < this.minHeight) {
            this.swiperHeight = this.minHeight;
          } else {
            this.swiperHeight = res.height;
          }
        }
      })
      .exec();
  }

  // 动态加载数据
  async downloadData() {
    if (!this.isShowLoadingText) return;
    if (this.loadingText[this.currentTabBarIndex] !== LoadingStatus.load) return;
    // 必须使用set方法 否则由于vue数据劫持原理问题导致不能对数组里的基本数据类型进行响应式
    this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.loading);

    switch (this.currentTabBarIndex) {
      case CurrentPage.contentPage:
        this.articlePageNum++;
        await this.getData(this.userInfo.id, RequestTypeEnum.article);
        break;
      case CurrentPage.dynamicPage:
        this.topicArticlePageNum++;
        // 获取动态的数据
        await this.getData(this.userInfo.id, RequestTypeEnum.topic);
        break;
      default:
    }
    this.$nextTick(() => {
      this.getHeight(this.idArr[this.currentTabBarIndex]);
    });
  }

  // 获取swiper最小可用高度 解决屏幕左右滑动断层
  getMinWindowHeight() {
    const query: UniApp.SelectorQuery = uni.createSelectorQuery().in(this);
    query
      .selectAll('.height')
      .boundingClientRect((result) => {
        const res = result as { height: number }[];
        let height: number = 0;
        res.forEach((item) => {
          height += item.height;
        });
        this.minHeight = this.windowHeight - height!;
      })
      .exec();
  }
  // 获取可用窗口高度
  getWindowHeight() {
    return new Promise((resolve) => {
      uni.getSystemInfo({
        success: (res?) => {
          if (res?.windowHeight) {
            this.windowHeight = res.windowHeight;
            this.navigationBarHeight = res.titleBarHeight || 44;
            resolve({});
          }
        },
      });
    });
  }
  // 导航栏点击返回
  topbarLeftClick() {
    const pages: any = getCurrentPages();
    const prePages = pages[pages.length - 2];
    if (typeof prePages !== 'undefined') {
      uni.navigateBack({ delta: 1 });
    } else {
      uni.switchTab({ url: '/pages/home/home' });
    }
  }
}
</script>

<style lang="scss" scoped>
.title-bar {
  position: absolute;
  /*#ifdef MP-WEIXIN*/
  top: var(-status-bar-height);
  /*#endif*/
  top: 0;
  z-index: 100;
  width: 100%;
  background: #00000000;
  height: 100rpx;
}
.box {
  .tab {
    width: 100%;

    .home-top-bar {
      background: #ffffff;
      border-top-right-radius: 20rpx;
      border-top-left-radius: 20rpx;
      transform: translateY(-30%);
    }
    .content {
      width: 100%;

      .content-item {
        width: 100%;
        box-sizing: border-box;
        padding: 20rpx;
        border-bottom: 1rpx solid $borderColor;

        .row {
          color: #cbcbcb;
          font-size: $fontMini;
          line-height: 50rpx;
        }

        .title {
          line-height: 80rpx;
          color: #000000;
          font-size: $fontSize;
        }
      }
    }
  }
}
</style>
