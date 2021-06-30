<template>
  <view class="loading">{{ text }}</view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class PullUpLoading extends Vue {
  @Prop(String)
  private text?: string;
}
</script>

<style lang="scss" scoped></style>
