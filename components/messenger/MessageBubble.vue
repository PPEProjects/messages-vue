<template>
  <div
    class="flex my-10 items-start chat-item opacity-0"
    :data-current="isOwn"
    :data-id="message.id"
    :class="{
          '_content': message.content,
          '_images': message.images,
          '_images _file': message.file,
          'flex-row-reverse': isOwn
    }"
  >

    <div class="w-[70px] flex-shrink-0 chat-user">
      <div class="w-[50px] h-[50px] rounded-full overflow-hidden border-[3px] border-white shadow-lg"><img
        class="w-full h-full object-cover"
        src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/454.jpg" alt="">
      </div>
    </div>

    <label class="bubble-content bg-[#f4f7fb] px-5 rounded-xl py-3 text-[13px] relative chap-content cursor-pointer text-gray-700" style="overflow-wrap: anywhere;">
      <input class="hidden" type="checkbox">
      <slot></slot>
      <span
        class="flex items-center text-gray-500 flex-shrink-0 opacity-0 absolute -bottom-5 _read left-0 animate">
        <svg
        stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"></path><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"></path>
      </svg>
        <span class="text-[12px] ml-1">Đã xem</span>
      </span>
    </label>

    <div class="w-[70px] flex-shrink-0"></div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "MessageBubble",
  props: {
    message: {
      type: Object,
      required: true
    },
  },
  computed: {
    ...mapGetters('user', ['user']),
    isRead() {
      return this.message.readAt.includes((e) => {
        return e.user.userID === String(this.user.id);
      });
    },
    isOwn() {
      return this.message.from.userID === String(this.user.id);
    }
  },
}
</script>
