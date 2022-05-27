<template>
  <div
    ref="container"
    class="images-bubble bubble-content grid relative"
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

    <bubble-remove :inbox="inbox" type="images" class="top-0" />

  </div>
</template>

<script>

import {ImagePreview} from "vant";

export default {
  name: "ImagesBubble",
  props: {
    inbox: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      images: this.inbox.images
    }
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
