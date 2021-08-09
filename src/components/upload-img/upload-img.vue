<template>
  <view class="uni-list list-pd">
    <view class="uni-list-cell cell-pd">
      <view class="uni-uploader">
        <view class="uni-uploader-head">
          <view class="uni-uploader-title">点击可预览选好的图片</view>
          <view class="uni-uploader-info">{{ imageList.length }}/9</view>
        </view>
        <view class="uni-uploader-body">
          <view class="preview-picture">
            <block v-for="(image, index) in imageList" :key="index">
              <view class="images-box">
                <view class="delete-img iconfont icon-shanchu" @tap="deleteImg(index)"></view>
                <image class="images" :src="image" :data-src="image" @tap.stop="previewImage" mode="aspectFill"></image>
              </view>
            </block>
            <!--            文件上传按钮-->
            <view class="upload-btn" @tap="chooseImage">
              <view>+</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import permision from '@utils/permission';
import { IResponse } from '@services/interface/response.interface';
import { deleteUploadImage } from '@services/release.request';

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

  @PropSync('cache', { type: Array, default: [] })
  private imageCache!: string[];

  created() {
    if (this.imageCache.length > 0) {
      this.imageList.push(...this.imageCache);
    }
  }

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
        // eslint-disable-next-line no-restricted-syntax
        for (const filePath of res.tempFilePaths as string[]) {
          uni.uploadFile({
            filePath,
            name: 'files',
            url: 'http://localhost:5000/api/v1/upload/images',
            success: (response) => {
              const data: IResponse<{ success: string[]; notSupport: string[]; restricted: string[] }> = JSON.parse(
                response.data,
              );
              this.imageList.push(...data.data.success);
              this.$emit('imageListChange', this.imageList);
            },
            header: {
              Authorization: `Bearer ${uni.getStorageSync('_token')}`,
            },
          });
        }

        // this.imageList = this.imageList.concat(res.tempFilePaths);
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
      success: async (res) => {
        if (res.confirm) {
          const pathArr: string[] = this.imageList[index].split('/');
          try {
            await deleteUploadImage(pathArr[pathArr.length - 1]);
          } catch (err) {
            uni.showToast({ title: '删除失败', icon: 'none' });
          }
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
.uni-uploader__input-box {
  width: 200px;
  height: 200px;
  background: #4cd964;
}

.upload-btn {
  @include centered;
  box-sizing: border-box;
  //margin: 10rpx;
  width: 200rpx;
  height: 200rpx;
  background: #f1f1f1;
  font-size: 100rpx;
  font-weight: 200;
  color: #bbbbbb;
}
.preview-picture {
  margin-top: 15rpx;
  display: grid;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(auto-fill, 200rpx);
  grid-gap: 15rpx;
  flex-wrap: wrap;
}

.images-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200rpx;
  height: 200rpx;
  object-fit: fill;
  vertical-align: bottom;
  .images {
    width: 100%;
    height: 100%;
  }
  .delete-img {
    position: absolute;
    right: 0;
    top: 0;
    width: 50rpx;
    height: 50rpx;
    z-index: 10;
    text-align: center;
    line-height: 50rpx;
  }
}
</style>
