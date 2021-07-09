<template>
  <view class="content-box">
    <!--导航栏-->
    <nav-bar :title="data.content" @leftClick="back" @rightClick="openMore"></nav-bar>
    <!-- 主题内容-->
    <moment-list :data="data" is-the-end>
      <view slot="time">{{ data.createAt }}</view>
    </moment-list>
    <!--评论模块-->
    <view class="comment-title">最新评论</view>
    <block v-for="(item, index) in commentList" :key="index">
      <comment :data="item" @contentClick="contentClick" @userClick="userClick"></comment>
    </block>
    <chat-input-btn @confirm="submit"></chat-input-btn>
    <share :is-show="isShowShare" @touchShareMask="touchShareMask"></share>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import MomentList from '@components/moment-list/moment-list.vue';
import { IMomentList } from '@components/moment-list/moment-list';
import Comment, { ICommentData } from '@pages/content/components/comment/comment.vue';
import moment from 'moment';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import Share from '@components/share/share.vue';

@Component({
  components: { Share, ChatInputBtn, Comment, MomentList, NavBar },
})
export default class Content extends Vue {
  // 是否显示分享框
  private isShowShare: boolean = false;
  // 主题内容
  private data: IMomentList | null = null;
  // 是否显示输入框
  private inputShow: boolean = false;
  // 评论的数据
  private commentList: ICommentData[] = [
    {
      isReply: false,
      avatar: '/static/demo/userpic/1.jpg',
      username: '张三',
      content: '今天天气很不错',
      createAt: moment().startOf('day').fromNow(),
    },
    {
      isReply: true,
      avatar: '/static/demo/userpic/1.jpg',
      username: '张三',
      content: '今天天气很不错',
      createAt: moment().startOf('day').fromNow(),
    },
    {
      isReply: true,
      avatar: '/static/demo/userpic/1.jpg',
      username: '张三',
      content:
        '今天天气4444444444443333333333333333333333333444444444444444444444444444422222222222222222222222fffffffffffffffffeeeeeeeeeeeeeeeeeeeeeee很不错',
      createAt: moment().startOf('day').fromNow(),
    },
    {
      isReply: false,
      avatar: '/static/demo/userpic/1.jpg',
      username: '张三',
      content: '今天天气很不错',
      createAt: moment().startOf('day').fromNow(),
    },
  ];

  onLoad({ data }: { data: string }) {
    this.data = JSON.parse(data);
  }

  // 点击评论内容显示回复输入框
  contentClick(content: string) {
    this.inputShow = true;
    uni.showToast({ title: `我要回复${content}` });
  }
  // 点击评论的用户名或头像 进入他的个人主页
  userClick(username: string) {
    uni.showToast({ title: `进入${username}` });
  }

  // 发送评论内容
  submit(value: string) {
    this.commentList.push({
      isReply: false,
      avatar: '/static/demo/userpic/1.jpg',
      username: '张三',
      content: value,
      createAt: moment().startOf().fromNow(),
    });
    uni.showToast({ title: `发送评论内容${value}` });
  }

  back() {
    uni.navigateBack({ delta: 1 });
  }

  // 打开分享
  openMore() {
    this.isShowShare = true;
  }
  //  关闭分享
  touchShareMask() {
    this.isShowShare = false;
  }
}
</script>

<style lang="scss" scoped>
.content-box:after {
  content: '';
  display: inline-block;
  height: 80rpx;
}

.input-mask {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  opacity: 0;
}

.comment-title {
  line-height: 80rpx;
  font-size: 30rpx;
  font-weight: bolder;
  margin-left: 20rpx;
}
</style>
