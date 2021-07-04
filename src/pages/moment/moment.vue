<template>
  <view>
    <uni-nav-bar :status-bar="isStatusBar">
      <view class="nav-left" slot="left">
        <view class="iconfont icon-qiandao"></view>
      </view>
      <block slot="default">
        <view class="nav-center">
          <view :class="['item', 'follow', { active: isActive }]" @tap="changeActive(true)">关注</view>
          <view :class="['item', 'topic', { active: !isActive }]" @tap="changeActive(false)">话题</view>
        </view>
      </block>
      <view class="nav-right" slot="right">
        <view class="iconfont icon-bianji1"></view>
      </view>
    </uni-nav-bar>
    <!--   列表组件-->
    <moment-list :data="textData"></moment-list>
    <moment-list :data="data"></moment-list>
    <moment-list :data="videoData"></moment-list>
    <moment-list :data="shareData"></moment-list>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import { IMomentList } from '@src/components/moment-list/moment-list';
import MomentList from '@components/moment-list/moment-list.vue';

@Component({ components: { MomentList, UniNavBar } })
export default class Moment extends Vue {
  private isStatusBar: boolean = true;
  // 文字数据
  private textData: IMomentList = {
    username: '名字',
    gender: 0,
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
  };

  // 图片数据
  private data: IMomentList = {
    username: '名字',
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
  };
  // 视频数据
  private videoData: IMomentList = {
    username: '名字',
    age: 32,
    gender: 0,
    avatar: '/static/demo/userpic/8.jpg',
    content: '六道快手家常菜，11111111好吃又下饭，是覅额温暖危机让佛文件佛额我I今日份为节日哦就你发',
    momentPic: '/static/demo/datapic/2.jpg',
    video: {
      playCount: '20w',
      totalTime: '2:40',
    },
    share: null,
    address: '上海',
    forwardCount: 30,
    commentCount: 30,
    likeCount: 20,
    isLike: 0, // 0未点赞 1点赞
    isFollow: 0, // 是否关注
  };
  // 分享数据
  private shareData: IMomentList = {
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
  };

  created() {
    // #ifdef MP-WEIXIN
    this.isStatusBar = false;
    // #endif
  }

  private isActive: boolean = true;

  changeActive(active: boolean) {
    this.isActive = active;
  }
}
</script>

<style lang="scss">
@import 'src/common/style/global';

.iconfont {
  font-size: 22px;
}
.icon-qiandao {
  color: rgb(215, 169, 91);
}

.nav-right,
.nav-left {
  /*  #ifdef APP-PLUS*/
  padding: 0 10rpx;
  /*  #endif*/
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.nav-center {
  @include centered;
  width: 100%;
  height: 100%;

  .item {
    @include centered;
    position: relative;
    width: 100rpx;
    height: 100%;
  }

  .active:after {
    content: '';
    position: absolute;
    bottom: 10rpx;
    display: inline-block;
    width: 80%;
    height: 10rpx;
    background: #fbe351;
  }
}
</style>
