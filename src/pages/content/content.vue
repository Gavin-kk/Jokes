<template>
  <view class="content-box">
    <!--导航栏-->
    <!--#ifndef H5-->
    <i-nav-bar :title="dataCt.content" @leftClick="back" @rightClick="openMore"></i-nav-bar>
    <!--#endif-->
    <!--#ifdef H5-->
    <i-nav-bar :title="dataCt.content" @leftClick="back" :right-show="false"></i-nav-bar>
    <!--#endif-->
    <template v-if="data">
      <!-- 主题内容-->
      <template v-if="data">
        <moment-list :data="data" is-the-end>
          <view slot="time">{{ dataCt.createAt | timeFilter }}</view>
        </moment-list>
      </template>
      <!--评论模块-->
      <view class="comment-title">最新评论</view>
      <block v-for="(item, index) in commentList" :key="item.id">
        <comment
          :data="item"
          @contentClick="contentClick"
          @userClick="userClick"
          @replyClick="replyClick"
          @like="like(index)"
        ></comment>
      </block>
      <template v-if="commentOrEmpty">
        <empty />
      </template>
    </template>
    <chat-input-btn
      style="position: fixed; bottom: 0"
      @confirm="submit"
      :isFocus.sync="isFocus"
      @outOfFocus="outOfFocus"
    ></chat-input-btn>
    <share :is-show="isShowShare" :data="data" @touchShareMask="touchShareMask"></share>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import INavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import MomentList from '@components/moment-list/moment-list.vue';
import Comment, { LikeCommentType } from '@pages/content/components/comment/comment.vue';
import ChatInputBtn from '@components/chat-input-btn/chat-input-btn.vue';
import Share from '@components/share/share.vue';
import { getArticleDetailRequest, likeCommentRequest, sendCommentRequest } from '@services/common.request';
import { AxiosResponse } from 'axios';
import { IArticleDetail } from '@pages/content/content.interface';
import { IResponse } from '@services/interface/response.interface';
import ReplyComment from '@pages/content/components/reply-comment/reply-comment.vue';
import { timeFilter } from '@common/filters/time.filter';
import Empty from '@components/empty/empty.vue';

export interface ISendCommentPayload {
  // 文章的id 如果是回复一级评论或其下的评论 此项可不填
  articleId?: number;
  // 如果是回复 回复一级评论的评论 此项必填并且必须传入commentId
  targetId?: number;
  // 评论的内容
  content: string;
  //  一级评论的id 如果只传comment和content 那么就是该一级评论下的评论
  commentId?: number;
}

@Component({
  components: { Empty, Share, ChatInputBtn, Comment, MomentList, INavBar, ReplyComment },
  filters: { timeFilter },
})
export default class Content extends Vue {
  // 是否显示分享框
  private isShowShare: boolean = false;
  // 当前用户评论的目标id 如果为 0 则是一级评论
  private commentId: number = 0;
  // 子评论或者说在一级评论下的评论id
  private childId: number = 0;
  // 主题内容
  private data: IArticleDetail | null = null;
  // input是否聚焦
  private isFocus: boolean = false;

  get commentList() {
    return this.data?.comments || [];
  }

  get dataCt(): IArticleDetail | Record<string, any> {
    return this.data || {};
  }

  get commentOrEmpty(): boolean {
    return !!this.commentList.length;
  }

  async mounted() {
    await this.requestArticleDetails();
  }

  // 请求文章详情数据
  async requestArticleDetails() {
    const routes: any = getCurrentPages();
    const { id } = routes[routes.length - 1].options;
    try {
      const result: AxiosResponse<IResponse<IArticleDetail>> = await getArticleDetailRequest(+id);
      this.data = result.data.data;
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  // 点击评论内容显示回复输入框 id 为一级评论的id
  contentClick(id: number) {
    this.isFocus = true;
    this.commentId = id;
    uni.showToast({ title: `我要回复一级评论${id}` });
  }

  // 点击回复   commentId 是共同的一级评论id id是当前点击的要回复评论的id index 是点击所在数组的 replay中
  replyClick(payload: { commentId: number; id: number }) {
    this.isFocus = true;
    this.commentId = payload.commentId;
    this.childId = payload.id;
  }

  // 点击评论的用户名或头像 进入他的个人主页
  userClick(id: number) {
    uni.navigateTo({ url: `/pages/personal-space/personal-space?userId=${id}` });
  }

  // 点赞评论
  async like(index: number) {
    if (this.data && this.data.comments) {
      if (this.data.comments[index].isLike === 0) {
        this.data.comments[index].isLike = 1;
        this.data.comments[index].commentLikeCount++;
      } else {
        this.data.comments[index].isLike = 0;
        this.data.comments[index].commentLikeCount--;
      }
    }
    try {
      await likeCommentRequest(LikeCommentType.firstLevelComment, this.commentList[index].id);
    } catch ({ response }) {
      console.log(response);
    }
  }

  // 发送评论内容
  async submit(value: string) {
    const sendCommentPayload: ISendCommentPayload = {
      content: value,
    };
    if (!this.commentId) {
      sendCommentPayload.articleId = this.data?.id;
    } else if (this.commentId && !this.childId) {
      sendCommentPayload.commentId = this.commentId;
    } else if (this.commentId && this.childId) {
      sendCommentPayload.commentId = this.commentId;
      sendCommentPayload.targetId = this.childId;
    }
    try {
      await sendCommentRequest(sendCommentPayload);
      await this.requestArticleDetails();
    } catch ({ response }) {
      console.log(response);
    }
    uni.showToast({ title: '发送成功' });
  }

  back() {
    const pages: any = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack({ delta: 1 });
    } else {
      uni.switchTab({
        url: '/pages/home/home',
      });
    }
  }

  // input 框失焦事件
  outOfFocus() {
    this.isFocus = false;
    this.commentId = 0;
    this.childId = 0;
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
