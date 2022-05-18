<template>

  <div id="messageInput">
    <div class="absolute bottom-0 px-4 py-2 border-t border-gray-100 w-full z-10 bg-white">
      <div class="w-full bg-gray-50 px-3 py-2 flex items-center rounded-[30px]">

        <van-popover v-if="!attchEnable" v-model="showPopover" trigger="click" :actions="actions" placement="top-start" @select="onSelect">
          <template #reference>
            <button class="w-[18px] h-[18px] relative top-[1px]">
              <van-icon size="18px" name="add-o" color="#6a7280"/>
            </button>
          </template>
        </van-popover>

        <button v-else-if="imagesAttached" class="w-[18px] h-[18px] relative" :disabled="files.length >= 30" @click="onSelect(null, 0)">
          <van-icon size="18px" name="photo-o" color="#6a7280"/>
        </button>


        <div v-if="attchEnable" class="w-full px-3">
          <div v-if="imagesAttached" class="scrollbar-hide overflow-y-auto flex flex-wrap justify-evenly">
            <div
              v-for="(image, index) in imagesPreview"
              :key="index"
              class="inline-block relative"
            >
              <van-image
                class="rounded-md overflow-hidden mx-1.5 border-2 border-white shadow-md z-10"
                width="70"
                height="70"
                :src="image"
                fit="cover"
              />

              <button class="absolute top-1 right-2.5 text-white bg-rose-500 w-5 h-5 rounded-full overflow-hidden border-2 border-white flex justify-center items-center shadow-md shadow-rose-300 z-20" @click="removeAt(index)">
                <van-icon size="10" name="cross" />
              </button>

            </div>

            <div class="ml-auto" style="width: 70px; height: 70px"></div>
          </div>

          <file-bubble v-else class="relative" :file="files[0].name" :download-enabled="false">

            <template #prefix>
              <button class="absolute top-1 right-2.5 text-white bg-rose-500 w-5 h-5 rounded-full overflow-hidden border-2 border-white flex justify-center items-center shadow-md shadow-rose-300 z-20" @click="removeAt(0)">
                <van-icon size="10" name="cross" />
              </button>
            </template>

          </file-bubble>

        </div>

        <van-field
          v-else
          v-model.trim="message"
          class="messInput"
          type="textarea"
          placeholder="Message"
          rows="1"
          :autosize="{ maxHeight: 70 }"
          @keyup.enter="message && sendInbox()"
        />

        <button
          class="w-[18px] h-[18px] animate transform"
          :class="{
          'translate-x-[30px]': !message && !files.length,
        }"
          @click="showDrawn = true"
        >
          <svg class="fill-current text-gray-500" width="18" height="18">
            <use xlink:href="#i-draw"/>
          </svg>
        </button>

        <button
          class="w-[18px] h-[18px] animate transform ml-2"
          :class="{
          'translate-x-[30px]': !message && !files.length,
        }"
        >
          <svg class="fill-current text-gray-500" width="18" height="18">
            <use xlink:href="#i-mic"/>
          </svg>
        </button>

        <button
          class="w-[18px] h-[18px] ml-3 animate"
          :disabled="!message && !files.length || isLoading"
          :class="{ 'opacity-50': isLoading }"
          @click="sendInbox()"
        >
          <svg
            class="fill-current text-gray-500 animate"
            width="18"
            height="18"
            :class="{
            'scale-0 opacity-0': !message && !files.length
          }"
          >
            <use xlink:href="#i-send"/>
          </svg>
        </button>

      </div>
    </div>

    <van-popup
      id="roomInfo"
      v-model="showDrawn"
      position="bottom"
      :style="{
      height: '60%',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
      maxWidth: '42rem',
      left: left + 'px'
    }"
    >

      <div class="px-4 py-3">

        <div class="flex">
          <h4 class="font-medium text-[16px]">Writing</h4>

          <div class="px-2 mr-2 ml-auto opacity-75">
            <van-button type="danger" size="small" round @click="resetSignaturePad">Clear</van-button>
          </div>

          <van-button
            class="px-2" type="primary" size="small" round :loading="uploadingImage"
            @click="onConfirmSignaturePad()">Send
          </van-button>

        </div>

        <div class="w-full border-b border-gray-100 mt-2 mb-3"></div>

        <client-only>
          <div id="signaturePad" class="border rounded border-white rounded-lg shadow-md">
            <VueSignaturePad ref="signaturePad" height="250px"/>
          </div>

          <p class="text-gray-400 text-xs mt-2">Draw something on the board</p>
        </client-only>

      </div>

    </van-popup>

  </div>

</template>

<script>
import {mapGetters} from "vuex";
import { v4 as uuidv4 } from 'uuid'

import {SEND_FILE, SEND_IMAGES, SEND_MESSAGE} from "~/apollo/mutation/message.mutation";

export default {
  name: "MessengerInboxTool",
  data() {
    return {
      message: '',
      isLoading: false,
      showDrawn: false,
      left: false,
      uploadingImage: false,
      showPopover: false,
      attchEnable: false,
      imagesAttached: false,
      actions: [
        {text: 'Images', icon: 'photo-o'},
        {text: 'File', icon: 'orders-o'}
      ],
      imagesPreview: [],
      files: []
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  mounted() {
    this.$nextTick(() => this.configModal())
  },
  methods: {
    onSelect(action, index) {
      // clear input nếu có
      document.querySelector('#inputAttch')?.remove();

      const $input = document.createElement('input')

      $input.id = 'inputAttch'
      $input.type = 'file'
      $input.accept = index === 0 ? 'image/*' : '*'

      $input.multiple = index === 0
      $input.classList.add('hidden')

      $input.addEventListener('change', this.changeInputFiles)

      document.body.append($input)

      $input.click()
    },

    changeInputFiles({target}) {
      const _files = structuredClone(target.files)
      this.files.push(..._files)

      this.attchEnable = true
      if (target.multiple) {
        this.imagesAttached = true

        for (const file of target.files) {
          this.imagesPreview.push(URL.createObjectURL(file))
        }

      } else if (/^image/.test(_files[0].type)) {
          this.imagesAttached = true
          this.imagesPreview.push(URL.createObjectURL(_files[0]))
        } else {
          this.imagesAttached = false
        }
    },

    async uploadImage(file, path, type) {
      this.uploadingImage = true

      await this.$axios.$put('/bunny/' + path, file, {
        headers: {
          AccessKey: process.env.VITE_BUNNY_TOKEN,
          'Content-Type': type
        }
      })

      this.uploadingImage = false
    },

    async sendInbox() {
      this.isLoading = true

      if(this.attchEnable) {

        if(this.imagesAttached) {
          const _filesName = this.files.map((file) => ({
            file: this.buildFilename('images', file.type.replace(/^image\//, '')),
            extension: file.type.replace(/^image\//, '')
          }))


          const _files = []

          this.files.forEach((file, index) => {

            _files.push(new Promise((resolve, reject) => {

              this.uploadImage(file, _filesName[index].file, 'images/' + _filesName[index].extension)
                .then((e) => resolve(_filesName[index].file))
            }))

          })


          const _images = await Promise.all(_files)

          await this.sendAttach(SEND_IMAGES, { images: _images.map((e) => process.env.VITE_BUNNY_CDN + e) })

        } else {

          const _file = this.files[0]

          const _filename = {
            file: this.buildWithPath('files', _file.name),
            extension: _file.type
          }

          await this.uploadImage(_file, _filename.file, _filename.extension)

          await this.sendAttach(SEND_FILE, { file: process.env.VITE_BUNNY_CDN + _filename.file })

        }

        this.files = []

        this.imagesPreview.forEach((image) => URL.revokeObjectURL(image))
        this.imagesPreview = []
        this.attchEnable = false

      } else {
        await this.sendAttach(SEND_MESSAGE, {content: this.message})
        this.message = ''
      }

      this.isLoading = false
    },

    async sendAttach(mutation, input) {

      try {
        await this.$apollo.mutate({
          mutation,
          variables: {
            input: {
              from: String(this.user.id),
              ...input
            },
            roomId: this.$route.params.id,
          }
        })
        this.$notify({ message: 'Đăng thành công', type: 'success' })
      } catch (e) {}

    },

    configModal() {
      const width = window.innerWidth
      const maxWidth = document.getElementById('body').scrollWidth
      this.left = (width - maxWidth) / 2
    },

    resetSignaturePad() {
      this.$refs.signaturePad.clearSignature()
    },

    async onConfirmSignaturePad() {
      const {isEmpty, data} = this.$refs.signaturePad.saveSignature()
      if (!isEmpty) {
        const file = await this.base64Image(data)

        this.files.push(file)
        this.imagesPreview.push(URL.createObjectURL(file))

        this.imagesAttached = true
        this.attchEnable = true
      }
      this.showDrawn = false
    },

    buildWithPath(group, path) {
      return `messages/${group}/${uuidv4()}/${path}`
    },

    buildFilename(group, extension) {
      return `messages/${group}/${uuidv4()}.${extension}`
    },

    async base64Image(str) {
      const res = await fetch(str)

      const blob = await res.blob()

      return new File([blob], 'img.jpeg', {
        type: 'image/jpeg'
      })
    },

    removeAt(index) {
      this.files = this.files.filter((_, _index) => index !== _index)
      this.imagesPreview = this.imagesPreview.filter((_, _index) => index !== _index)
      if(!this.files.length) {
        this.attchEnable = false
      }
    }
  }
}
</script>
