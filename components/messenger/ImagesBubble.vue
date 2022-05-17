<template>
  <div class="images-bubble">
    <van-grid :column-num="4" :border="false" :square="true">
      <van-grid-item v-for="(image, index) in images" :key="index">
        <van-image class="w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-md" :src="image" fit="cover" @click="previews(index)" />
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>

import {ImagePreview} from "vant";

export default {
  name: "ImagesBubble",
  props: {
    images: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    previews(index) {
      ImagePreview({
        images: this.images,
        index
      });
    }
  }
}
</script>
