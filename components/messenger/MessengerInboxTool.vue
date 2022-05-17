<template>

  <div>
    <div class="absolute bottom-0 px-4 py-2 border-t border-gray-100 w-full z-10 bg-white">
      <div class="w-full bg-gray-50 px-3 py-2 flex items-center rounded-[30px]">
        <button class="w-[18px] h-[18px]">
          <svg class="fill-current text-gray-500" width="18" height="18">
            <use xlink:href="#i-document"/>
          </svg>
        </button>

        <van-field
          v-model.trim="message"
          class="messInput"
          type="textarea"
          placeholder="Message"
          rows="1"
          :autosize="{ maxHeight: 70 }"
          @keyup.enter="message && sendMessage()"
        />

        <button
          class="w-[18px] h-[18px] animate transform"
          :class="{
          'translate-x-[30px]': !message,
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
          'translate-x-[30px]': !message,
        }"
        >
          <svg class="fill-current text-gray-500" width="18" height="18">
            <use xlink:href="#i-mic"/>
          </svg>
        </button>

        <button
          class="w-[18px] h-[18px] ml-3"
          :disabled="!message"
          @click="sendMessage()"
        >
          <svg
            class="fill-current text-gray-500 animate"
            width="18"
            height="18"
            :class="{
            'scale-0 opacity-0': !message
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
      left: left + 'px',
    }"
    >

      <div class="px-4 py-3">

        <div class="flex">
          <h4 class="font-medium text-[16px]">Writing</h4>

          <div class="px-2 mr-2 ml-auto opacity-75">
            <van-button type="danger" size="small" round @click="resetSignaturePad">Clear</van-button>
          </div>

          <van-button class="px-2" type="primary" size="small" round>Send</van-button>

        </div>

        <div class="w-full border-b border-gray-100 mt-2 mb-3"></div>

        <client-only>
          <div id="signaturePad" class="border rounded border-white rounded-lg shadow-md">
            <VueSignaturePad ref="signaturePad" height="250px" />
          </div>

          <p class="text-gray-400 text-xs mt-2">Draw something on the board</p>
        </client-only>

      </div>

    </van-popup>

  </div>

</template>

<script>
import {mapGetters} from "vuex";
import {SEND_MESSAGE} from "~/apollo/mutation/message.mutation";

export default {
  name: "MessengerInboxTool",
  data() {
    return {
      message: '',
      isLoading: false,
      showDrawn: false,
      left: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  mounted() {
    this.$nextTick(() => this.configModal())
  },
  methods: {
    async sendMessage() {
      this.isLoading = true

      try {
        await this.$apollo.mutate({
          mutation: SEND_MESSAGE,
          variables: {
            input: {
              from: String(this.user.id),
              content: this.message
            },
            roomId: this.$route.params.id,
          }
        })
        this.message = ''
      } catch (e) { }

      this.isLoading = false
    },

    configModal() {
      const width = window.innerWidth
      const maxWidth = document.getElementById('body').scrollWidth
      this.left = (width - maxWidth) / 2
    },

    resetSignaturePad() {
      this.$refs.signaturePad.clearSignature()
    },
    onConfirmSignaturePad() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      console.log(data, isEmpty)
    },
  }
}
</script>
