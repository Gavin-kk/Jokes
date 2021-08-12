<template>
  <view class="top">
    <view class="bg-box">
      <image class="bg-img" @tap="clickBg" :src="bgImageUrls[currentBgIndex]" mode="aspectFill"></image>
    </view>
    <view class="box">
      <view class="user-info">
        <view class="avatar-box">
          <image class="avatar" :src="userInfoC.avatar" mode="widthFix"></image>
        </view>
        <view class="username">{{ userInfoC.username }} <gender-tag :gender="info.gender" :age="info.age" /></view>
        <view class="tags">
          <view class="tag">{{ constellationC }}</view>
        </view>
        <view class="count-box">
          <block v-for="item in sectionListC" :key="item.text">
            <view class="count">
              {{ item.count | countFilter }} <text class="msg">{{ item.text }}</text>
            </view>
          </block>
        </view>
      </view>
      <view class="follow-box">
        <view class="attention-btn">
          <view class="follow-text to-chat-with" @tap="toChatWith">
            <image src="/static/to-chat-with.png" class="to-chat-with-icon"></image>
            {{ '聊天' }}
          </view>
        </view>
        <view class="attention-btn">
          <view :class="['follow-text', { followed: isFollow }]" @tap="attention">
            <view class="iconfont icon-zengjia" v-show="!isFollow"></view>
            {{ attentionText }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import GenderTag from '@components/gender-tag/gender-tag.vue';
import { IUser, IUserinfo } from '@store/module/user';
import {} from '@pages/edit-material/edit-material.vue';
import { countFilter } from '@common/filters/count.filter';

const UserModule = namespace('userModule');

@Component({ components: { GenderTag }, filters: { countFilter } })
export default class UserPageHead extends Vue {
  // @UserModule.State('userInfo')
  // private readonly userInfo!: IUser;
  @PropSync('constellation', { type: String, default: '' })
  private constellationC!: string;
  @PropSync('sectionList', { type: Array, default: [] })
  private sectionListC!: { text: string; count: undefined | number }[];
  @PropSync('user', { type: Object, default: {} })
  private userInfoC!: IUser;
  // private info: IUserinfo | Record<string, unknown> = {};

  get info(): { gender: number; age: number } {
    return {
      gender: (this.userInfoC.userinfo && this.userInfoC.userinfo[0].gender) || 0,
      age: (this.userInfoC.userinfo && this.userInfoC.userinfo[0].age) || 0,
    };
  }
  // @Watch('userInfo')
  // watchUserInfo() {
  //   if (this.userInfo?.userinfo && !this.info.id) {
  //     this.info = this.userInfo.userinfo[0];
  //   }
  // }
  //
  // mounted() {
  //   console.log(this.userInfo.username);
  //
  //   if (this.userInfo?.userinfo && !this.info.id) {
  //     this.info = this.userInfo.userinfo[0];
  //   }
  // }

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
$height: 555rpx;
.top {
  position: relative;

  .bg-box {
    width: 100%;
    height: $height;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;

    .bg-img {
      position: absolute;
      left: 0;
      width: 100%;
      height: $height;
    }
  }
  .box {
    //position: absolute;
    position: relative;
    z-index: 10;
    //top: 100rpx;
    //left: 10%;
    display: flex;
    //justify-content: center;
    width: 100%;
    height: $height;
    box-sizing: border-box;
    padding: 20rpx;
    //transform: translateX(50%);

    .user-info {
      width: 100%;

      .tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .tag {
          margin-right: 10rpx;
          box-sizing: border-box;
          padding: 5rpx 10rpx;
          background: #24252755;
          font-size: 28rpx;
          border-radius: 10rpx;
          color: #d0d0d2;
        }
      }

      .count-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100rpx;

        .count {
          margin-right: 20rpx;
          font-size: 34rpx;
          color: #ffffff;
          .msg {
            margin-left: 5rpx;
            font-size: 26rpx;
            color: #e3e3e3;
          }
        }
      }
    }

    .avatar-box {
      margin-top: 120rpx;
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #ffffff;
      flex-shrink: 0;

      .avatar {
        width: 100%;
        height: 100%;
      }
    }

    .username {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-grow: 1;
      font-weight: bold;
      text-shadow: 2rpx 2rpx 2rpx black;
      width: 100%;
      color: #ffffff;
      font-size: 38rpx;
      line-height: 70rpx;
      margin-top: 10rpx;
    }

    .follow-box {
      position: absolute;
      right: 30rpx;
      top: 150rpx;
      display: flex;
      align-items: center;
      .attention-btn {
        flex: 1;
        @include centered;
        margin: 15rpx;

        .follow-text {
          width: 150rpx;
          height: 60rpx;
          @include centered;
          box-sizing: border-box;
          background: #ffe933;
          padding: 5rpx 10rpx;
          border-radius: 30rpx;
          font-size: 30rpx;
        }
        .to-chat-with {
          background: rgba(255, 255, 255, 0.5);
          .to-chat-with-icon {
            width: 30rpx;
            height: 30rpx;
            margin-right: 5rpx;
          }
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
}
</style>
