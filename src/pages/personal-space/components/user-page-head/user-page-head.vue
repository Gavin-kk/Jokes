<template>
  <view class="top">
    <view class="bg-box">
      <image class="bg-img" :src="bgImage" mode="aspectFill"></image>
    </view>
    <view class="box">
      <view class="user-info">
        <view class="avatar-box">
          <image class="avatar" :src="userInfoC.avatar" mode="widthFix"></image>
        </view>
        <view class="username">{{ usernameOrNickname }} <gender-tag :gender="info.gender" :age="info.age" /></view>
        <view class="tags">
          <view class="tag">{{ constellationC }}</view>
        </view>
        <view class="count-box">
          <block v-for="item in sectionListC" :key="item.text">
            <view class="count">
              {{ item.count | countFilter }} <text class="msg">{{ item.text }}</text>
            </view>
          </block>

          <view class="level">
            <view class="text-box">
              <text class="current-level-progress grade">{{ userCurrentLevelText }}</text>
              <text class="current-level-progress">{{ userLevelProgressText }}</text>
            </view>
            <view class="level-progress-box">
              <progress
                class="level-progress"
                :percent="userLevelProgress"
                active
                activeColor="#fbe351"
                border-radius="20"
              ></progress>
            </view>
          </view>
        </view>
      </view>
      <view class="follow-box" v-if="!isMe">
        <view class="attention-btn" @tap="toChatWith">
          <view class="follow-text to-chat-with">
            <image src="/static/to-chat-with.png" class="to-chat-with-icon"></image>
            {{ '聊天' }}
          </view>
        </view>
        <view class="attention-btn">
          <view :class="['follow-text', { followed: isFollow }]" @tap="attention">
            <view class="iconfont icon-zengjia" v-if="!isFollow"></view>
            {{ attentionText }}
          </view>
        </view>
      </view>
      <view class="me" v-else>
        <view class="edit-data iconfont icon-bianji" @tap="editData">编辑资料</view>
        <view class="edit-data" @tap="clickBg">
          <image src="/static/fingerprint.png" class="image-icon"></image>
          <text>修改背景</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync, Prop } from 'vue-property-decorator';
import GenderTag from '@components/gender-tag/gender-tag.vue';
import { IUser } from '@store/module/user';
import { countFilter } from '@common/filters/count.filter';
import { followUsersRequest } from '@services/user.request';
import { IFollowEventPayload } from '@components/dynamic/dynamic.vue';
import { INews } from '@pages/news/news.vue';
import { NEWS_LIST } from '@common/constant/storage.constant';
import { checkIsFollowEachOtherRequest } from '@services/follow.request';
import { namespace } from 'vuex-class';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';

const UserModule = namespace('userModule');

@Component({ components: { GenderTag }, filters: { countFilter } })
export default class UserPageHead extends Vue {
  @UserModule.State('userInfo')
  private readonly IuserInfo!: IUser;

  @PropSync('constellation', { type: String, default: '' })
  private readonly constellationC!: string;
  @PropSync('sectionList', { type: Array, default: [] })
  private readonly sectionListC!: { text: string; count: undefined | number }[];
  @PropSync('user', { type: Object, default: {} })
  private readonly userInfoC!: IUser;
  @Prop({ type: Boolean, default: false })
  private readonly isMe!: boolean;
  // 是否关注
  private isFollow: boolean = false;
  private bgImageUrl: string = '/static/default-user-bg.jpeg';

  get bgImage(): string {
    return (this.isMe ? this.IuserInfo.bgUrl : this.userInfoC.bgUrl) || this.bgImageUrl;
  }

  get attentionText(): string {
    return this.isFollow ? '已关注' : '关注';
  }

  get usernameOrNickname(): string {
    return this.userInfoC.nickname ? this.userInfoC.nickname : this.userInfoC.username;
  }

  get userLevelProgressText(): string {
    if (Array.isArray(this.userInfoC.userExperiences) && this.userInfoC.userExperiences.length > 0) {
      const currentExperience: number = this.userInfoC.userExperiences[0].experience;
      const currentLevel: number = this.userInfoC.userExperiences[0].grade * 500 + 500;
      return `${currentLevel}/${currentExperience}`;
    }
    return '500/0';
  }
  get userLevelProgress(): number {
    if (Array.isArray(this.userInfoC.userExperiences) && this.userInfoC.userExperiences.length > 0) {
      return Math.ceil((this.userInfoC.userExperiences[0].experience % 500) / 500);
    }
    return 0;
  }
  get userCurrentLevelText(): string {
    if (Array.isArray(this.userInfoC.userExperiences) && this.userInfoC.userExperiences.length > 0) {
      const currentLevel: number = this.userInfoC.userExperiences[0].grade;
      return `V${currentLevel}`;
    }
    return 'V0';
  }

  get info(): { gender: number; age: number } {
    return {
      gender: (this.userInfoC.userinfo && this.userInfoC.userinfo[0].gender) || 0,
      age: (this.userInfoC.userinfo && this.userInfoC.userinfo[0].age) || 0,
    };
  }

  @Watch('userInfoC')
  watchUserInfoC() {
    this.isFollow = !!(this.userInfoC?.followed && this.userInfoC.followed.length);
  }

  created() {
    this.onEvent();
  }

  onEvent() {
    // 监听关注事件
    uni.$on('follow', (payload: IFollowEventPayload) => {
      if (payload.userId === this.userInfoC.id && this.isFollow !== payload.isFollow) {
        this.isFollow = payload.isFollow;
      }
    });
  }

  // 点击关注
  async attention() {
    // 发送关注请求或取关
    const followRes = await followUsersRequest(this.userInfoC.id);
    const isFollow: boolean = followRes.data.data === '关注成功';
    uni.showToast({ title: followRes.data.data, icon: 'none' });
    uni.$emit('follow', { isFollow, userId: this.userInfoC.id } as IFollowEventPayload);
  }

  // 点击聊天
  async toChatWith() {
    const result: AxiosResponse<IResponse<boolean>> = await checkIsFollowEachOtherRequest(
      this.IuserInfo.id,
      this.userInfoC.id,
    );
    if (!result.data.data) {
      uni.showToast({ title: '没有互相关注呦，需要互相关注才能发送消息呦', icon: 'none', duration: 2500 });
      return;
    }
    await new Promise((resolve) => {
      uni.getStorage({
        key: NEWS_LIST(this.IuserInfo.id),
        success: (res) => {
          const data: INews[] = res.data;
          const isExists: number = data.findIndex((item) => item.userId === this.userInfoC.id);
          if (isExists === -1) {
            data.unshift({
              userId: this.userInfoC.id,
              username: this.userInfoC.username,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: this.userInfoC.avatar,
            });
          } else {
            const news = data.splice(isExists, 1);
            data.unshift(news[0]);
          }
          uni.setStorageSync(NEWS_LIST(this.$store.state.userModule.userInfo.id), data);
          resolve('');
        },
        fail: () => {
          uni.setStorageSync(NEWS_LIST(this.$store.state.userModule.userInfo.id), [
            {
              userId: this.userInfoC.id,
              username: this.userInfoC.username,
              content: '',
              time: Date.now(),
              unreadCount: 0,
              avatar: this.userInfoC.avatar,
            },
          ]);
          resolve('');
        },
      });
    });
    uni.navigateTo({ url: `/pages/chat/chat?id=${this.userInfoC.id}` });
  }

  // 点击编辑资料
  editData() {
    uni.navigateTo({
      url: '/pages/edit-material/edit-material?path=/pages/personal-space/personal-space',
    });
  }

  clickBg() {
    const itemList: string[] = ['查看封面', '自定义封面'];
    uni.showActionSheet({
      itemList,
      success: (res) => {
        if (res.tapIndex === 0) {
          uni.previewImage({
            urls: [this.bgImageUrl],
          });
        } else {
          uni.navigateTo({
            url: '/pages/personal-space/pages/customize-bg/customize-bg',
          });
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped>
$height: 555rpx;
/*#ifdef MP-WEIXIN*/
$height: 650rpx;
/*#endif*/
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
      /*  #ifdef MP-WEIXIN*/
      margin-top: 100rpx;
      /* #endif*/
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

        .level {
          margin-left: 20rpx;
          .current-level-progress {
            font-size: 28rpx;
            color: #ffffff;
            text-shadow: 2rpx 2rpx 2rpx black;
            margin-right: 10rpx;
          }
          .grade {
            font-size: 30rpx;
            color: #fbe351;
          }

          .level-progress-box {
            width: 400rpx;
            border-radius: 10rpx;
            overflow: hidden;
            .level-progress {
              width: 100%;
            }
          }
        }

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
      /*  #ifndef MP-WEIXIN*/
      top: 150rpx;
      /* #endif*/
      /*  #ifdef MP-WEIXIN*/
      top: 250rpx;
      /* #endif*/
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

    .me {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 300rpx;
      flex-direction: column;
      right: -20rpx;

      .edit-data {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
        color: #ffffff;
        padding: 20rpx;
        border-radius: 30rpx;
        margin: 15rpx;
        font-size: 28rpx;
        .image-icon {
          margin-right: 5rpx;
          width: 30rpx;
          height: 30rpx;
        }
        &:before {
          margin-right: 5rpx;
        }
      }
    }
  }
}
</style>
