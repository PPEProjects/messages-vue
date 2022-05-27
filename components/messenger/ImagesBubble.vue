<template>
  <div
    ref="container"
    class="images-bubble bubble-content grid"
    :class="{
      _4: images.length >= 4,
      _3: images.length === 3,
      _2: images.length === 2,
      _1: images.length === 1
    }"
  >
    <div v-for="(image, index) in images" :key="index">
      <van-image class="w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-md" :src="image" fit="cover" @click="previews(index)" />
    </div>
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
