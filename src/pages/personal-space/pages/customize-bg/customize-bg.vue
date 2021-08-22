<template>
  <view>
    <nav-bar title="自定义封面"></nav-bar>
    <item-list :list="list" @clickListEvent="itemClick"></item-list>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@components/nav-bar/nav-bar.vue';
import ItemList, { IItemList } from '@components/list/item-list.vue';
import { UPLOAD_IMAGE_URL } from '@common/constant/upload-path.constant';
import { TOKEN_KEY } from '@common/constant/storage.constant';
import { IResponse, IUploadResponse } from '@services/interface/response.interface';
import { changeUserBgRequest } from '@services/user.request';
import { UserStoreActionType } from '@store/module/user/constant';
import { namespace } from 'vuex-class';

export const enum selectList {
  photoAlbum, // 使用本地照片
  photography, // 使用拍照
}
const UserModule = namespace('userModule');
@Component({
  components: { ItemList, NavBar },
})
export default class CustomizeBg extends Vue {
  @UserModule.Mutation(UserStoreActionType.CHANGE_BG)
  private readonly changeBg!: (url: string) => void;
  private list: IItemList[] = [
    { text: '从手机相册选择', url: `${selectList.photoAlbum}` },
    { text: '拍一张', url: `${selectList.photography}` },
  ];

  itemClick(item: IItemList) {
    let sourceType: string = '';
    if (+item!.url! === selectList.photography) {
      // 使用本地照片
      sourceType = 'camera';
    }
    if (+item!.url! === selectList.photoAlbum) {
      // 使用拍照
      sourceType = 'album';
    }
    uni.chooseImage({
      count: 1,
      sourceType: [sourceType],
      success: (res) => {
        uni.uploadFile({
          url: UPLOAD_IMAGE_URL,
          name: 'files',
          filePath: res.tempFilePaths[res.tempFilePaths.length - 1],
          header: {
            Authorization: `Bearer ${uni.getStorageSync(TOKEN_KEY)}`,
          },
          success: async (response) => {
            const data: IResponse<IUploadResponse> = JSON.parse(response.data);
            if (data.data.success && data.data.success.length > 0) {
              const url: string = data.data.success[data.data.success.length - 1];
              // uni.$emit('change-user-bg', url);
              try {
                await changeUserBgRequest(url);
                uni.showToast({ title: '修改成功', duration: 1500 });
                this.changeBg(url);
                setTimeout(() => {
                  const pages: any = getCurrentPages();
                  if (pages.length > 1) {
                    uni.navigateBack({ delta: 1 });
                  } else {
                    uni.redirectTo({ url: '/pages/personal-space/personal-space' });
                  }
                }, 1600);
              } catch ({ response }) {
                uni.showToast({ title: response.data.message, icon: 'none' });
              }
            }
          },
        });
        // 这里可以直接拿到文件对象
      },
      fail(res) {
        if (res.errCode === 12) {
          uni.showToast({ title: '已取消', icon: 'none' });
          return;
        }
        if (res.errCode === 11) {
          uni.showToast({ title: '相机拉取失败', icon: 'none' });
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped></style>
