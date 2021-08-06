<template>
  <view v-if="replyList.length" class="animate__animated animate__fadeInUp" style="animation-duration: 200ms">
    <block v-for="reply in replyList" :key="reply.id">
      <view :class="['box', 'reply']">
        <view class="left">
          <view class="avatar-box" @tap="userClick(reply.user.username)">
            <image class="avatar" :src="reply.user.avatar" mode="widthFix"></image>
          </view>
        </view>
        <view class="right-box">
          <view class="right">
            <view style="display: flex; justify-content: flex-start">
              <view class="username" @tap.self="userClick(reply.user.username)"
                >{{ reply.user.username || reply.user.nickname }}
                <text v-if="reply.target" style="margin-left: 10rpx" @tap="userClick(reply.target.user.username + 1)">
                  @ {{ reply.target.user.nickname || reply.target.user.username }}
                </text>
              </view>
            </view>
            <view class="comment-text" @tap="contentClick(reply)">{{ reply.content }}</view>
            <view class="time">{{ reply.createAt | timeFilter }}</view>
          </view>
          <view :class="['iconfont', 'icon-ccdbaa', { isLike: isLike }]" @tap="like">
            <text class="count">{{ 1 }}</text>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IReply } from '@pages/content/content.interface';
import { timeFilter } from '@common/filters/time.filter';

@Component({
  filters: { timeFilter },
})
export default class ReplyComment extends Vue {
  @Prop({ type: Array, required: true, default: [] })
  private replyList!: IReply[];
  private isLike: boolean = false;

  contentClick(reply: IReply) {
    if (this.replyList) {
      this.$emit('contentClick', { commentId: reply.commentId, id: reply.id });
    }
  }
  userClick(username: string) {
    uni.showToast({ title: `打开${username}个人主页` });
  }
  // 给评论点赞
  like() {
    this.isLike = !this.isLike;
  }
}
</script>

<style lang="scss" scoped>
@import '../style/common';
</style>
