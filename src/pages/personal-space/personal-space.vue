<template>
  <view class="box">
    <!--背景图-->
    <user-page-head class="height" />
    <!--信息-->
    <view class="information-box height">
      <view class="section-list-box">
        <section-list class="information" :sectionList="sectionList" />
      </view>
      <view class="segmentation" />
    </view>
    <!--tab导航-->
    <view class="tab">
      <home-top-bar
        class="height"
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
            <block v-for="item in momentList" :key="item.id">
              <moment-list :data="item"></moment-list>
            </block>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="content" :id="idArr[2]">
            <view class="content-item">
              <view class="row title">账号信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
            </view>
            <view> 底部</view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 下拉加载组件-->
      <pull-up-loading v-show="isShowLoadingText" :text="dropDownLoadingText"></pull-up-loading>
    </view>
    <!--右上角点击更多弹出层-->
    <view class="top-menu">
      <drop-down-menu
        :is-show-menu="isShowMenu"
        first-text="拉黑"
        last-text="备注"
        first-iconfont-class="icon-guanbi"
        last-iconfont-class="icon-bianji"
        :nav-bar-height="navigationBarHeight"
        @close="closeMenu"
        @clickOnTheFirst="menuClickOnTheFirst"
        @clickTheLastOne="menuClickTheLastOne"
      />
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import UserPageHead from '@pages/personal-space/components/user-page-head/user-page-head.vue';
import SectionList from '@pages/mine/components/section-list/section-list.vue';
import HomeTopBar from '@components/home-topbar/home-topbar.vue';
import moment from 'moment';
import { getHoroscope } from '@src/utils/date-to-constellation';
import MomentList from '@components/moment-list/moment-list.vue';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import DropDownMenu from '@components/drop-down-menu/drop-down-menu.vue';
import { IUser, IUserinfo } from '@store/module/user';
import { namespace } from 'vuex-class';
import { ModuleConstant } from '@store/module.constant';
import { UserStoreActionType } from '@store/module/user/constant';

moment.locale('zh-cn');

enum CurrentPage {
  homePage,
  contentPage,
  dynamicPage,
}
const UserModule = namespace('userModule');

@Component({
  components: { PullUpLoading, MomentList, SectionList, UserPageHead, HomeTopBar, DropDownMenu },
})
export default class PersonalSpace extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private ifNullText: string = '快去填写吧';

  private info: IUserinfo | Record<string, unknown> = {};

  @Watch('userInfo')
  watchUserInfo() {
    // eslint-disable-next-line no-unused-expressions
    this.userInfo?.userinfo && !this.info.id ? (this.info = this.userInfo.userinfo[0]) : {};
  }

  created() {
    // eslint-disable-next-line no-unused-expressions
    this.userInfo?.userinfo && !this.info.id ? (this.info = this.userInfo.userinfo[0]) : {};
    if (!this.userInfo.userinfo) {
      this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.GET_USER_INFO}`);
    }
  }

  //  tab导航的title
  private tabBarList: { id: number; title: string }[] = [
    { id: 1, title: '主页' },
    { id: 2, title: '内容' },
    { id: 3, title: '动态' },
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

  // 是否显示右上角菜单
  private isShowMenu: boolean = false;

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

  get sectionList(): { count: number | undefined; text: string }[] {
    return [
      { count: this.userInfo.likeCount, text: '获赞' },
      { count: this.userInfo.followCount, text: '关注' },
      { count: this.userInfo.fansCount, text: '粉丝' },
    ];
  }

  async mounted() {
    // 获取进入首页的高度
    this.getHeight(this.idArr[this.currentTabBarIndex]);
    //  获取可用窗口高度
    await this.getWindowHeight();
    // 获取swiper最小可用高度 解决屏幕左右滑动断层
    this.getMinWindowHeight();
  }

  // 监听页面滚动到底部
  onReachBottom() {
    this.downloadData();
  }
  // 监听原生导航栏点击事件
  onNavigationBarButtonTap(detail: { index: number }) {
    if (detail.index === 0) {
      this.isShowMenu = true;
    }
  }

  // 关闭右上角菜单
  closeMenu() {
    this.isShowMenu = false;
  }
  menuClickOnTheFirst() {
    uni.showToast({ title: '点击拉黑' });
  }
  menuClickTheLastOne() {
    uni.showToast({ title: '点击备注' });
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
  downloadData() {
    if (!this.isShowLoadingText) return;
    if (this.loadingText[this.currentTabBarIndex] !== LoadingStatus.load) return;
    // 必须使用set方法 否则由于vue数据劫持原理问题导致不能对数组里的基本数据类型进行响应式
    this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.loading);

    switch (this.currentTabBarIndex) {
      case CurrentPage.homePage:
        //  获取home的数据
        this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.load);
        // 获取内容的数据
        this.$nextTick(() => {
          this.getHeight(this.idArr[CurrentPage.homePage]);
        });
        break;
      case CurrentPage.contentPage:
        // eslint-disable-next-line no-case-declarations
        const obj = {
          id: +(Math.random() * 1000 + 1).toFixed(),
          username: '新的',
          gender: 0,
          avatar: '/static/demo/userpic/8.jpg',
          age: 22,
          content: '六道快手家常菜，爱你 1234，1234',
          momentPic: null,
          video: null,
          share: null,
          address: '上海',
          forwardCount: 30,
          commentCount: 30,
          likeCount: 20,
          isLike: 0, // 0未点赞 1点赞
          isFollow: 0, // 是否关注
        };
        setTimeout(() => {
          // this.momentList.push(obj);

          // 获取内容的数据
          this.$nextTick(() => {
            this.getHeight(this.idArr[CurrentPage.contentPage]);
          });

          this.$set(this.loadingText, this.currentTabBarIndex, LoadingStatus.load);
          // this.loadingText[this.currentTabBarIndex] = LoadingStatus.load;
        }, 1000);
        break;
      case CurrentPage.dynamicPage:
        // 获取动态的数据
        break;
      default:
    }
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
}
</script>

<style lang="scss" scoped>
.box {
  .information-box {
    position: relative;

    .section-list-box {
      transform: translateY(-25rpx);
      border-top-right-radius: 30rpx;
      border-top-left-radius: 30rpx;
      overflow: hidden;
      background: #ffffff;
    }

    .segmentation {
      position: absolute;
      bottom: 0;
      height: 20rpx;
      width: 100%;
      background: #f4f4f4;
      margin-top: -30rpx;
    }
  }

  .tab {
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

  .top-menu {
    //position: absolute;
    //left: 0;
  }
}
</style>
