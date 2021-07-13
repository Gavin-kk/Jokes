<template>
  <view>
    <nav-bar title="自定义封面"></nav-bar>
    <item-list :list="list" @clickListEvent="itemClick"></item-list>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import ItemList, { IItemList } from '@components/list/item-list.vue';

export const enum selectList {
  photoAlbum, // 使用本地照片
  photography, // 使用拍照
}

@Component({
  components: { ItemList, NavBar },
})
export default class CustomizeBg extends Vue {
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
        // 这里可以直接拿到文件对象
        console.log(res);
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
