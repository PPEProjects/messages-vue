<template>
  <div
    class="file-bubble text-[13px] bubble-content !px-4 relative"
    :class="{
      'audio': isAudio,
      'video': isVideo
    }"
  >

    <audio v-if="isAudio && showPlayer" controls>
      <source :src="file" :type="'audio/' + fileExtention">
    </audio>

    <video v-else-if="isVideo && showPlayer" controls>
      <source :src="file" :type="'video/' + fileExtention">
    </video>

    <div v-else @click="download">
      <van-icon v-if="isAudio" name="volume-o" class="mr-1" />
      <van-icon v-else name="orders-o" />
      <span class="file-name">{{ fileName }}</span>
      <slot name="prefix"></slot>
    </div>


    <bubble-remove :inbox="inbox" type="files" class="top-0" />

  </div>
</template>

<script>
export default {
  name: "FileBubble",
  props: {
    inbox: {
      type: Object,
      default: () => {}
    },
    file: {
      type: String,
      required: true
    },
    downloadEnabled: {
      type: Boolean,
      default: true
    },
    showPlayer: {
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
    },
    isAudio() {
      return ['wav', 'mp3', 'm4a'].includes(this.fileExtention)
    },
    isVideo() {
      return ['mp4'].includes(this.fileExtention)
    },
    isDocument() {
      return ['csv', 'ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'gif', 'potx', 'txt', 'xlt'].includes(this.fileExtention)
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
