<template>
  <view class="box">
    <!--背景图-->
    <user-page-head class="bg-height" />
    <!--信息-->
    <view class="information-box info-height">
      <view class="section-list-box">
        <section-list class="information" :sectionList="sectionList" />
      </view>
      <view class="segmentation" />
    </view>
    <!--tab导航-->
    <view class="tab">
      <home-top-bar
        class="top-bar-height"
        :list="tabBarList"
        itemStyle="width:33%"
        :activeIndex="currentTabBarIndex"
        @currentSwiperIndexChange="swiperIndexChange"
      />
      <swiper :style="{ height: `${swiperHeight}px` }" :current="currentTabBarIndex" @change="swiperChange">
        <swiper-item>
          <view class="content" id="home-height">
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
        <swiper-item>
          <view class="content" id="content-height">
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
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="content" id="dynamic-height">
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
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
            </view>
            <view class="content-item">
              <view class="row title">个人信息</view>
              <view class="row">嘻龄: 1年零8个月6天</view>
              <view class="row">嘻ID: 10390</view>
              <view class="row">故乡: 内蒙古</view>
              <view class="row">情感状态: 未婚</view>
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

moment.locale('zh-cn');
@Component({
  components: { SectionList, UserPageHead, HomeTopBar },
})
export default class PersonalSpace extends Vue {
  // 当前swiper 的高度
  private swiperHeight: number = 0;
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
  // 当前tabbar所在的索引
  private currentTabBarIndex: number = 0;

  mounted() {
    this.getHeight('#home-height');
  }

  // tabbar切换事件
  swiperIndexChange(index: number) {
    this.currentTabBarIndex = index;
  }

  // swiper 改变事件
  swiperChange(e: { detail: { current: number } }) {
    const idArr: string[] = ['#home-height', '#content-height', '#dynamic-height'];
    this.getHeight(idArr[e.detail.current]);
    this.currentTabBarIndex = e.detail.current;
  }

  getHeight(id: string) {
    const query = uni.createSelectorQuery().in(this);
    query
      .select(id)
      .boundingClientRect((res?) => {
        if (res?.height) {
          this.swiperHeight = res.height;
        }
      })
      .exec();
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
