<template>
  <view class="uni-list list-pd">
    <view class="uni-list-cell cell-pd">
      <view class="uni-uploader">
        <view class="uni-uploader-head">
          <view class="uni-uploader-title">点击可预览选好的图片</view>
          <view class="uni-uploader-info">{{ imageList.length }}/9</view>
        </view>
        <view class="uni-uploader-body">
          <view class="uni-uploader__files">
            <block v-for="(image, index) in imageList" :key="index">
              <view class="uni-uploader__file">
                <view class="delete-img iconfont icon-shanchu" @tap="deleteImg(index)"></view>
                <image class="uni-uploader__img" :src="image" :data-src="image" @tap.stop="previewImage"></image>
              </view>
            </block>
            <view class="uni-uploader__input-box">
              <view class="uni-uploader__input" @tap="chooseImage"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import permision from '@utils/permission';

const sourceType = [['camera'], ['album'], ['camera', 'album']];
const sizeType = [['compressed'], ['original'], ['compressed', 'original']];

@Component({})
export default class UploadImg extends Vue {
  private imageList: string[] = [];
  private sourceTypeIndex = 2;
  private sourceType: string[] = ['拍照', '相册', '拍照或相册'];
  private sizeTypeIndex = 2;
  private sizeType: string[] = ['压缩', '原图', '压缩或原图'];
  private countIndex = 8;
  private count: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  previewImage(e: any) {
    const current = e.target.dataset.src;
    uni.previewImage({
      current,
      urls: this.imageList,
    });
  }
  async chooseImage() {
    // #ifdef APP-PLUS
    // TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
    if (this.sourceTypeIndex !== 2) {
      const status = await this.checkPermission();
      if (status !== 1) {
        return;
      }
    }
    // #endif

    if (this.imageList.length === 9) return;

    uni.chooseImage({
      sourceType: sourceType[this.sourceTypeIndex],
      sizeType: sizeType[this.sizeTypeIndex],
      count:
        this.imageList.length + this.count[this.countIndex] > 9
          ? 9 - this.imageList.length
          : this.count[this.countIndex],
      success: (res) => {
        this.imageList = this.imageList.concat(res.tempFilePaths);
        this.$emit('imageListChange', this.imageList);
      },
      fail: (err) => {
        // #ifdef APP-PLUS
        if (err.code && err.code !== 0 && this.sourceTypeIndex === 2) {
          this.checkPermission(err.code);
        }
        // #endif
        // #ifdef MP
        if (err.errMsg.indexOf('cancel') !== '-1') {
          return;
        }
        uni.getSetting({
          success: (res: any) => {
            let authStatus = false;
            switch (this.sourceTypeIndex) {
              case 0:
                authStatus = res.authSetting['scope.camera'];
                break;
              case 1:
                authStatus = res.authSetting['scope.album'];
                break;
              case 2:
                authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
                break;
              default:
                break;
            }
            if (!authStatus) {
              uni.showModal({
                title: '授权失败',
                content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting({});
                  }
                },
              });
            }
          },
        });
        // #endif
      },
    });
  }

  async checkPermission(code?: any) {
    const type = code ? code - 1 : this.sourceTypeIndex;
    let status = permision.isIOS
      ? await permision.requestIOS(sourceType[type][0])
      : await permision.requestAndroid(
          type === 0 ? 'android.permission.CAMERA' : 'android.permission.READ_EXTERNAL_STORAGE',
        );

    if (status === null || status === 1) {
      status = 1;
    } else {
      uni.showModal({
        content: '没有开启权限',
        confirmText: '设置',
        success(res) {
          if (res.confirm) {
            permision.gotoAppSetting();
          }
        },
      });
    }
    return status;
  }

  deleteImg(index: number) {
    uni.showModal({
      title: '提示',
      content: '是否删除图片',
      success: (res) => {
        if (res.confirm) {
          this.imageList.splice(index, 1);
          uni.showToast({ title: '删除成功' });
          this.$emit('imageListChange', this.imageList);
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.cell-pd {
  padding: 22rpx 0;
}

.list-pd {
  margin-top: 50rpx;
}
.uni-uploader-title {
  font-size: 32rpx;
}
.uni-uploader-info {
  font-size: 32rpx;
}

.uni-uploader__file {
  position: relative;

  .delete-img {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    width: 45rpx;
    height: 45rpx;
    color: #ffffff;
    border-radius: 10rpx;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 45rpx;
  }
}
</style>
