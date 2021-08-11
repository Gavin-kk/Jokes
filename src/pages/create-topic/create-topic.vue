<template>
  <view>
    <nav-bar title="创建话题"></nav-bar>
    <view class="box">
      <view class="content-box">
        <view class="pic-box">
          <template v-if="imageUrlIsExists">
            <view @tap="uploadImage" class="upload-btn-box">
              <view class="plus">+</view>
              <view>上传封面</view>
            </view>
          </template>
          <template v-else>
            <image class="image" :src="imageUrl" mode="scaleToFill"></image>
          </template>
        </view>
        <view class="title-input-box">
          <input type="text" v-model="title" class="title-input" placeholder="话题名称" />
        </view>
        <view class="desc-box">
          <textarea v-model="desc" type="text" class="desc" maxlength="50" placeholder="话题描述"></textarea>
        </view>
        <view class="select-topic-category" @tap="selectTopicClassify">{{ selectedTopicTitle }}</view>
        <button class="submit" @tap="submit">发布话题</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import { BASE_URL } from '@config/service.config';
import { IResponse } from '@services/interface/response.interface';
import { namespace } from 'vuex-class';
import { ITopicClassify } from '@pages/moment/store';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import { ModuleConstant } from '@store/module.constant';
import { createTopicRequest } from '@services/topic.request';

export interface CreateTopicDto {
  title: string;
  desc: string;
  imageUrl: string;
  TCId: number;
}
const MomentModule = namespace('momentModule');
@Component({ components: { NavBar } })
export default class CreateTopic extends Vue {
  @MomentModule.State('topicClassifyList')
  private topicClassifyList!: ITopicClassify[];

  private title: string = '';
  // 已经上传的图片url
  private imageUrl: string = '';
  // 话题的描述
  private desc: string = '';
  // 选择的话题分类
  private topicClassify: ITopicClassify | null = null;

  get imageUrlIsExists(): boolean {
    return this.imageUrl === '';
  }

  // 选择话题的title
  get selectedTopicTitle(): string {
    if (this.topicClassify !== null) {
      return this.topicClassify.title;
    }
    return '选择话题分类';
  }
  get topicClassifyListMap(): string[] {
    return this.topicClassifyList.map((item) => item.title);
  }

  created() {
    const pages: any = getCurrentPages();
    const { options } = pages[pages.length - 1];
    this.title = options.title;

    this.getTopIcClassifyList();
  }

  // 获取话题分类 如果不存在的话
  async getTopIcClassifyList() {
    if (this.topicClassifyList.length === 0) {
      try {
        await this.$store.dispatch(`${ModuleConstant.momentModule}/${MomentStoreActionType.GET_ALL_TOPIC_CATEGORIES}`);
      } catch ({ response }) {
        console.log(response);
      }
    }
  }

  // 提交话题
  async submit() {
    if (!this.checkInput()) return;

    const payload: CreateTopicDto = {
      TCId: this.topicClassify!.id,
      desc: this.desc,
      imageUrl: this.imageUrl,
      title: this.title,
    };
    try {
      await createTopicRequest(payload);
      uni.showToast({ title: '创建成功' });
      setTimeout(() => {
        uni.navigateBack({ delta: 1 });
      }, 200);
    } catch ({ response }) {
      console.log(response);
    }
  }

  // 选择话题分类
  selectTopicClassify() {
    uni.showActionSheet({
      itemList: this.topicClassifyListMap,
      success: (res) => {
        this.topicClassify = this.topicClassifyList[res.tapIndex];
      },
    });
  }

  checkInput() {
    if (!this.title) {
      uni.showToast({ title: '话题名称不可为空哦', icon: 'none' });
      return false;
    }
    if (!this.imageUrl) {
      uni.showToast({ title: '话题封面不可为空哦', icon: 'none' });
      return false;
    }
    if (!this.desc) {
      uni.showToast({ title: '话题描述不可为空哦', icon: 'none' });
      return false;
    }
    if (this.topicClassify === null) {
      uni.showToast({ title: '话题分类是必选的哦', icon: 'none' });
      return false;
    }
    return true;
  }

  // 选择并上传图片
  async uploadImage() {
    try {
      const sourceType = ['camera', 'album'];
      const sourceTypeIndex: number = await new Promise((resolve, reject) => {
        uni.showActionSheet({
          itemList: ['拍照', '从相册选择'],
          success: (res) => {
            resolve(res.tapIndex);
          },
          fail: () => {
            reject();
          },
        });
      });
      uni.chooseImage({
        count: 1,
        sizeType: 'compressed',
        sourceType: [...sourceType[sourceTypeIndex]],
        success: (res) => {
          uni.uploadFile({
            name: 'files',
            url: `${BASE_URL}/upload/images`,
            header: {
              Authorization: `Bearer ${uni.getStorageSync('_token')}`,
            },
            filePath: res.tempFilePaths[res.tempFilePaths.length - 1],
            success: ({ data }) => {
              const response: IResponse<{
                success: string[];
                notSupport: string[];
                restricted: string[];
              }> = JSON.parse(data);
              this.imageUrl = response.data.success[response.data.success.length - 1];
            },
            fail: () => {
              uni.showToast({ title: '啊哦出错了,请重试' });
            },
          });
        },
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
}
</script>

<style lang="scss" scoped>
@mixin roundBorder {
  border: 1px solid $borderColor;
  border-radius: 20rpx;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50rpx;

  .content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600rpx;
    //height: 700rpx;

    .pic-box {
      @include centered;
      border: 1px solid $borderColor;
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      overflow: hidden;
      font-size: 32rpx;
      .plus {
        font-size: 50rpx;
      }
      .image {
        width: 100%;
        height: 100%;
      }

      .upload-btn-box {
        @include centered;
        flex-direction: column;
      }
    }

    .topic-pic-msg {
      font-size: 32rpx;
    }

    .title-input-box {
      @include roundBorder;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30rpx;
      width: 100%;
      height: 100rpx;
      box-sizing: border-box;
      padding: 20rpx;
      .title-input {
        width: 100%;
      }
    }
    .desc-box {
      @include roundBorder;
      margin-top: 30rpx;
      width: 100%;
      height: 200rpx;
      box-sizing: border-box;
      padding: 20rpx;
      .desc {
        width: 100%;
        height: 100%;
      }
    }

    .select-topic-category {
      @include roundBorder;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 20rpx;
      font-size: 32rpx;
      margin-top: 30rpx;
      width: 100%;
      height: 100rpx;
    }

    .submit {
      margin-top: 30rpx;
      width: 100%;
      font-size: 32rpx;
      background: rgb(251, 228, 87);
    }
  }
}
</style>
