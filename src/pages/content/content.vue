<template>
  <view class="content-box">
    <!--导航栏-->
    <i-nav-bar :title="dataCt.content" @leftClick="back" @rightClick="openMore"></i-nav-bar>
    <template v-if="data">
      <!-- 主题内容-->
      <template v-if="data">
        <moment-list :data="data" is-the-end>
          <view slot="time">{{ dataCt.createAt }}</view>
        </moment-list>
      </template>
      <!--评论模块-->
      <view class="comment-title">最新评论</view>
      <block v-for="item in commentList" :key="item.id">
        <comment :data="item" @contentClick="contentClick" @userClick="userClick"></comment>
      </block>
      <!--      <reply-comment-comment :replyList="commentList[1].reply-comment" />-->
    </template>
    <chat-input-btn @confirm="submit"></chat-input-btn>
    <share :is-show="isShowShare" @touchShareMask="touchShareMask"></share>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import INavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import MomentList from '@components/moment-list/moment-list.vue';
import Comment from '@pages/content/components/comment/comment.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import Share from '@components/share/share.vue';
import { getArticleDetailRequest } from '@services/common.request';
import { AxiosResponse } from 'axios';
import { IArticleDetail } from '@pages/content/content.interface';
import { IResponse } from '@services/interface/response.interface';
import ReplyComment from '@pages/content/components/reply-comment/reply-comment.vue';

@Component({
  components: { Share, ChatInputBtn, Comment, MomentList, INavBar, ReplyComment },
})
export default class Content extends Vue {
  // 是否显示分享框
  private isShowShare: boolean = false;
  // 主题内容
  private data: IArticleDetail | null = null;
  // 是否显示输入框
  private inputShow: boolean = false;

  get commentList() {
    return this.data?.comments || [];
  }

  get dataCt(): IArticleDetail | Record<string, any> {
    return this.data || {};
  }

  async mounted() {
    const routes: any = getCurrentPages();
    const { id } = routes[routes.length - 1].options;

    const result: AxiosResponse<IResponse<IArticleDetail>> = await getArticleDetailRequest(+id);
    this.data = result.data.data;
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
    // this.commentList.push({
    //   isReply: false,
    //   avatar: '/static/demo/userpic/1.jpg',
    //   username: '张三',
    //   content: value,
    //   createAt: moment().startOf('hour').fromNow(),
    // });
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

  // 评论的数据
  // private commentList: ICommentData[] = [
  //   {
  //     isReply: false,
  //     avatar: '/static/demo/userpic/1.jpg',
  //     username: '张三',
  //     content: '今天天气很不错',
  //     createAt: moment().startOf('day').fromNow(),
  //   },
  //   {
  //     isReply: true,
  //     avatar: '/static/demo/userpic/1.jpg',
  //     username: '张三',
  //     content: '今天天气很不错',
  //     createAt: moment().startOf('day').fromNow(),
  //   },
  //   {
  //     isReply: true,
  //     avatar: '/static/demo/userpic/1.jpg',
  //     username: '张三',
  //     content:
  //       '今天天气4444444444443333333333333333333333333444444444444444444444444444422222222222222222222222fffffffffffffffffeeeeeeeeeeeeeeeeeeeeeee很不错',
  //     createAt: moment().startOf('day').fromNow(),
  //   },
  //   {
  //     isReply: false,
  //     avatar: '/static/demo/userpic/1.jpg',
  //     username: '张三',
  //     content: '今天天气很不错',
  //     createAt: moment().startOf('day').fromNow(),
  //   },
  // ];
}
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
}
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
