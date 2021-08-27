<template>
  <view>
    <!--    导航栏-->
    <nav-bar title="意见反馈" page-path="/pages/settings/settings" />
    <!--    -->
    <view>
      <uni-collapse>
        <block v-for="item in list" :key="item.title">
          <uni-collapse-item show-animation :title="item.title" class="item">
            <view class="content">{{ item.content }}</view>
          </uni-collapse-item>
        </block>
      </uni-collapse>
    </view>
    <button-encapsulation text="意见反馈" @clickBtn="openFeedbackInput"></button-encapsulation>
    <ygc-comment ref="commentRef" @pubComment="pubComment" placeholder="请输入反馈内容"></ygc-comment>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniCollapse from '@dcloudio/uni-ui/lib/uni-collapse/uni-collapse.vue';
import UniCollapseItem from '@dcloudio/uni-ui/lib/uni-collapse-item/uni-collapse-item.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import ButtonEncapsulation from '@components/button-encapsulation/button-encapsulation.vue';
import YgcComment from '@components/ygc-comment/ygc-comment.vue';
import { feedbackRequest } from '@services/common.request';

export interface iFeedback {
  title: string;
  content: string;
}

@Component({ name: 'Feedback', components: { YgcComment, ButtonEncapsulation, NavBar, UniCollapse, UniCollapseItem } })
export default class Feedback extends Vue {
  private list: iFeedback[] = [
    {
      title: '客服什么时候在线?',
      content:
        '亲爱的用户，客服的工作时间为:周一至周六10:00-12:00,14:00-19:00,非工作时间的咨询反馈会自动转为留言，客服.上班后会第一时间回复哦~',
    },
    {
      title: '忘记账号/昵称/密码怎么办?',
      content: '可以通过邮箱登录然后重置密码呦~',
    },
    {
      title: '怎么搜索/查找/关注/取关用户?',
      content: '可以在消息页面查找关注取关用户呦~',
    },
  ];

  async pubComment(content: string) {
    try {
      await feedbackRequest(content);
      uni.showToast({ title: '反馈成功' });
      this.closeFeedbackInput();
    } catch ({ response }) {
      console.log(response);
    }
  }

  openFeedbackInput() {
    (this.$refs.commentRef as any).toggleMask('show');
  }
  closeFeedbackInput() {
    (this.$refs.commentRef as any).toggleMask();
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid $borderColor;
}
.content {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 20rpx;
  font-size: $fontMini;
  word-break: break-all;
  line-height: 50rpx;
}
</style>
