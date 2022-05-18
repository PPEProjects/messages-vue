<template>
  <div class="file-bubble">
    <div class="px-0.5" @click="download">
      <van-icon name="volume-o" class="mr-1" />
      <span class="file-name">{{ fileName }}</span>
      <slot name="prefix"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileBubble",
  props: {
    file: {
      type: String,
      required: true
    },
    downloadEnabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    fileName() {
      return this.file.split('/')[this.file.split('/').length - 1]
    },
    fileExtention() {
      return this.fileName.split('.')[this.fileName.split('.').length - 1]
    }
  },
  methods: {
    download() {
      if(!this.downloadEnabled) {
        return
      }
      window.open(this.file, '_blank').focus();
    }
  }
}
</script>
