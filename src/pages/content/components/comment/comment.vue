<template>
  <!--  <view :class="['box', { reply-comment: !!data.reply-comment.length }]">-->
  <view class="box" style="animation-duration: 200ms">
    <view class="left">
      <view class="avatar-box" @tap="userClick">
        <image class="avatar" :src="data.user.avatar" mode="widthFix"></image>
      </view>
    </view>
    <view class="right-box">
      <view class="right">
        <view class="username" @tap="userClick">{{ username }}</view>
        <view class="comment-text" @tap="contentClick">{{ content }}</view>
        <view class="time">{{ data.createAt | timeFilter }}</view>
        <view style="overflow: hidden">
          <reply-comment
            :reply-list="replyList"
            v-if="replyListComponentIsShow"
            @contentClick="replyClick"
          ></reply-comment>
        </view>

        <view
          class="load-comment"
          v-if="isShowLoadComment"
          @tap="loadComments"
          style="overflow: hidden; position: relative"
          >{{ replyCount }}
          <image v-if="imageIconIsShow" class="load-comment-icon" src="/static/pull.png"></image>
          <loading :loading="loading" class="loading"></loading>
        </view>
      </view>

      <view :class="['iconfont', 'icon-ccdbaa', { isLike: isLike }]" @tap="like">
        <text class="count">{{ 1 }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IComments, IReply } from '@pages/content/content.interface';
import ReplyComment from '@pages/content/components/reply-comment/reply-comment.vue';
import { getCommentChildListRequest } from '@services/common.request';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import Loading from '@components/loading/loading.vue';
import { timeFilter } from '@common/filters/time.filter';

@Component({
  components: { Loading, ReplyComment },
  filters: { timeFilter },
})
export default class Comment extends Vue {
  @Prop({ type: Object, default: {} })
  private data?: IComments;
  private replyList: IReply[] = [];
  // 评论的加载loading状态
  private loading: boolean = false;
  private isLike: boolean = false;

  get username(): string {
    return this.data?.user.nickname || this.data?.user.username || '';
  }
  get content(): string {
    return this.data?.content || '';
  }
  get isShowLoadComment(): boolean {
    return !!this.data?.replyCount;
  }
  get replyListComponentIsShow(): boolean {
    return !!this.replyList.length;
  }
  // 计算当前还有多少条回复评论展示
  get replyCount(): string {
    if (!this.data) return '—没有更多评论了';
    const count: number = this.data.replyCount - this.replyList.length;
    if (count === 0) {
      return '—没有更多评论了';
    }
    return `—展开${count}条回复`;
  }
  // imageIcon 是否显示
  get imageIconIsShow(): boolean {
    if (!this.data) return false;
    return !(this.replyCount === '—没有更多评论了');
  }

  async loadComments() {
    this.loading = true;
    if (!this.data?.id) return;
    const result: AxiosResponse<IResponse<IComments>> = await getCommentChildListRequest(this.data.id);
    this.replyList = result.data.data.reply;
    this.loading = false;
    // console.log(result.data.data.reply);
  }
  // 给评论点赞
  like() {
    this.isLike = !this.isLike;
  }
  contentClick() {
    this.$emit('contentClick', this.data?.id);
  }
  // 回复 commentId 是共同的一级评论id id是当前点击的要回复评论的id
  replyClick(payload: { commentId: number; id: number }) {
    this.$emit('replyClick', payload);
  }
  userClick() {
    this.$emit('userClick', this.data?.user.id);
  }
}
</script>

<style lang="scss" scoped>
@import '../style/common';

.loading {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  left: 50%;
}
.icon-ccdbaa {
  right: 55rpx;
}
</style>
