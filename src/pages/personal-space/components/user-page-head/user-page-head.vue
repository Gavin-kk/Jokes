<template>
  <view class="top">
    <view class="bg-box">
      <image class="bg-img" @tap="clickBg" :src="bgImageUrls[currentBgIndex]" mode="aspectFill"></image>
    </view>
    <view class="user">
      <view class="avatar-box">
        <image class="avatar" :src="userInfo.avatar" mode="widthFix"></image>
      </view>
      <view class="username">{{ userInfo.username }} <gender-tag :gender="info.gender" :age="info.age" /></view>
      <view class="attention-btn">
        <view :class="['follow-text', { followed: isFollow }]" @tap="attention">
          <view class="iconfont icon-zengjia" v-show="!isFollow"></view>
          {{ attentionText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import GenderTag from '@components/gender-tag/gender-tag.vue';
import { IUser, IUserinfo } from '@store/module/user';
import {} from '@pages/edit-material/edit-material.vue';

const UserModule = namespace('userModule');

@Component({ components: { GenderTag } })
export default class UserPageHead extends Vue {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;
  private info: IUserinfo | Record<string, unknown> = {};

  @Watch('userInfo')
  watchUserInfo() {
    if (this.userInfo?.userinfo && !this.info.id) {
      this.info = this.userInfo.userinfo[0];
    }
  }

  mounted() {
    if (this.userInfo?.userinfo && !this.info.id) {
      this.info = this.userInfo.userinfo[0];
    }
  }

  // 是否关注
  private isFollow: boolean = false;
  // 判断是不是自己
  private isMe: boolean = true;

  private bgImageUrls: string[] = [
    '/static/demo/topicpic/2.jpeg',
    '/static/demo/topicpic/3.jpeg',
    '/static/demo/topicpic/1.jpeg',
  ];
  private currentBgIndex: number = 0;
  // 点击关注
  attention() {
    this.isFollow = !this.isFollow;
  }

  clickBg() {
    const itemList: string[] = ['查看封面', '自定义封面'];
    uni.showActionSheet({
      itemList,
      success: (res) => {
        if (res.tapIndex === 0) {
          uni.previewImage({
            urls: [this.bgImageUrls[this.currentBgIndex]],
          });
        } else {
          uni.navigateTo({
            url: '/pages/personal-space/pages/customize-bg/customize-bg',
          });
        }
      },
    });
  }

  get attentionText(): string {
    return this.isFollow ? '已关注' : '关注';
  }
}
</script>

<style lang="scss" scoped>
.top {
  position: relative;

  .bg-box {
    width: 100%;
    height: 450rpx;
    box-sizing: border-box;
    overflow: hidden;

    .bg-img {
      width: 100%;
      height: 100%;
    }
  }
  .user {
    position: absolute;
    top: 100rpx;
    left: 50%;
    transform: translateX(-50%);

    .avatar-box {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      overflow: hidden;

      .avatar {
        width: 100%;
        height: 100%;
      }
    }

    .username {
      @include centered;
      font-weight: bold;
      text-shadow: 2rpx 2rpx 2rpx black;
      width: 100%;
      color: #ffffff;
      font-size: 38rpx;
      line-height: 70rpx;
      margin-top: 20rpx;
    }

    .attention-btn {
      @include centered;
      margin: 15rpx 0;

      .follow-text {
        @include centered;
        box-sizing: border-box;
        background: #ffe933;
        padding: 5rpx 10rpx;
        border-radius: 10rpx;
        font-size: 30rpx;
      }

      .followed {
        background: rgba(255, 255, 255, 0);
        box-sizing: border-box;
        border: 1px solid #ffffff;
        color: #ffffff;
        font-size: 30rpx;
      }
    }
  }
}
</style>
