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
              <view class="row">嘻龄: {{ userInfo.createAt }}年</view>
              <view class="row">嘻ID: {{ userInfo.id }}</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">星座: {{ userInfo.dateOfBirth }}</view>
              <view class="row">职业: {{ userInfo.profession }}</view>
              <view class="row">故乡: {{ userInfo.hometown }}</view>
              <view class="row">情感状态: {{ userInfo.emotion }}</view>
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
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view> 底部</view>
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
import { IMomentList } from '@src/components/moment-list/moment-list';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';

moment.locale('zh-cn');

enum CurrentPage {
  homePage,
  contentPage,
  dynamicPage,
}
@Component({
  components: { PullUpLoading, MomentList, SectionList, UserPageHead, HomeTopBar },
})
export default class PersonalSpace extends Vue {
  // 内容页面的列表数据
  private momentList: IMomentList[] = [
    // 文字数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '名字',
      gender: 1,
      avatar: '/static/demo/userpic/8.jpg',
      age: 22,
      content:
        '六道快手家常菜，11111111好吃又下4444444444444442让服务器额发去我服媳妇请问发撒地方去玩啊水电费为服装消费我去二商店下啊发顺丰 我温柔风去啊速度发送服务费饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: null,
      video: null,
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 图片数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '4321dsafqwfeasdfqwtqwefsdagwqerewq ',
      gender: 0,
      avatar: '/static/demo/userpic/8.jpg',
      age: 22,
      content:
        '六道快手家常菜，111111111让服务器而且我2222222222222222222222222222222222222222222222222222222222好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: '/static/demo/datapic/2.jpg',
      video: null,
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 视频数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      username: '名字',
      age: 32,
      gender: 0,
      avatar: '/static/demo/userpic/8.jpg',
      content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      momentPic: '/static/demo/datapic/2.jpg',
      video: {
        playCount: 200000,
        totalTime: '2:40',
      },
      share: null,
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 0, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
    // 分享数据
    {
      id: +(Math.random() * 1000 + 1).toFixed(),
      gender: 0,
      age: 42,
      username: '名字',
      avatar: '/static/demo/userpic/8.jpg',
      content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
      video: null,
      momentPic: null,
      share: {
        content: '我是标题',
        momentPic: '/static/demo/datapic/2.jpg',
      },
      address: '上海',
      forwardCount: 30,
      commentCount: 30,
      likeCount: 20,
      isLike: 1, // 0未点赞 1点赞
      isFollow: 0, // 是否关注
    },
  ];
  // 三个页面容器的 id
  private idArr: string[] = ['home-height', 'content-height', 'dynamic-height'];

  // 用户信息
  private userInfo = {
    // 当前时间减去账号创建时间
    createAt: moment()
      .diff(moment().valueOf() - 1000 * 60 * 60 * 24 * 434, 'years', true)
      .toFixed(1),
    id: 19034,
    dateOfBirth: getHoroscope(moment().valueOf()),
    emotion: '未婚',
    hometown: '内蒙古呼和浩特',
    profession: 'IT',
  };

  // 可用窗口的高度
  private windowHeight: number = 0;
  // 相对于窗口的swiper可用高度 用于设置最小高度
  private minHeight: number = 0;
  // 当前 swiper 的高度
  private swiperHeight: number = 0;
  // 当前tabbar所在的索引
  private currentTabBarIndex: number = CurrentPage.homePage;
  // 三个页面的loadingText
  private loadingText: string[] = [LoadingStatus.load, LoadingStatus.load, LoadingStatus.load];

  private sectionList: { count: number; text: string }[] = [
    { count: 1, text: '获赞' },
    { count: 1, text: '关注' },
    { count: 1, text: '粉丝' },
  ];
  //  tab导航的title
  private tabBarList: { id: number; title: string }[] = [
    { id: 1, title: '主页' },
    { id: 2, title: '内容' },
    { id: 3, title: '动态' },
  ];

  async mounted() {
    // 获取进入首页的高度
    this.getHeight(this.idArr[this.currentTabBarIndex]);
    //  获取可用窗口高度
    await this.getWindowHeight();
    // 获取swiper最小可用高度 解决屏幕左右滑动断层
    this.getMinWindowHeight();
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
            return;
          }
          this.swiperHeight = res.height;
        }
      })
      .exec();
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
            resolve({});
          }
        },
      });
    });
  }

  // 监听页面滚动到底部
  onReachBottom() {
    this.downloadData();
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
          this.momentList.push(obj);

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

  // 计算要不要显示loadingtext
  get isShowLoadingText() {
    return this.swiperHeight - this.windowHeight > 0;
  }
  // 下拉加载更多文本
  get dropDownLoadingText() {
    return this.loadingText[this.currentTabBarIndex];
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
      //padding-bottom: 20rpx;
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
}
</style>
