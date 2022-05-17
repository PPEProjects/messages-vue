<template>
  <div>
    <div class="px-0.5">
      <van-icon name="volume-o" class="mr-1" />
      {{ fileName }}
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
  },
  computed: {
    fileName() {
      return this.file.split('/')[this.file.split('/').length - 1]
    },
    fileExtention() {
      return this.fileName.split('.')[this.fileName.split('.').length - 1]
    }
  }
}
</script>
