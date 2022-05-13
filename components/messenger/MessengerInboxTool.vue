<template>
  <div class="absolute bottom-0 px-4 py-2 border-t border-gray-100 w-full z-10">
    <div class="w-full bg-gray-50 px-3 py-2 flex items-center rounded-[30px]">
      <button class="w-[18px] h-[18px]">
        <svg class="fill-current text-gray-500" width="18" height="18">
          <use xlink:href="#i-document"/>
        </svg>
      </button>

      <van-field
        v-model="message"
        class="messInput"
        type="textarea"
        placeholder="Message"
        rows="1"
        :autosize="{ maxHeight: 70 }"
      />

      <button
        class="w-[18px] h-[18px] animate transform"
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
</template>

<script>
import {mapGetters} from "vuex";
import {SEND_MESSAGE} from "~/apollo/mutation/message.mutation";

export default {
  name: "MessengerInboxTool",
  data() {
    return {
      message: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
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
    }
  }
}
</script>
