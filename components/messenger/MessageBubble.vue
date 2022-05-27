<template>
  <div
    class="flex my-10 items-start chat-item opacity-0"
    :data-current="isOwn"
    :data-id="inbox.id"
    :class="{
      'flex-row-reverse': isOwn
    }"
  >

    <div
      class="w-[50px] h-[50px] rounded-full overflow-hidden border-[3px] border-white shadow-lg flex-shrink-0"
      :class="{
        'ml-5': isOwn,
        'mr-5': !isOwn
      }"
    >
      <img class="w-full h-full object-cover" :src="inbox.from.avatar" alt="">
    </div>

    <slot></slot>

    <div class="w-[70px] flex-shrink-0 mx-auto"></div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "MessageBubble",
  props: {
    inbox: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isOwn: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    isRead() {
      return this.inbox.readAt.includes((e) => {
        return e.inbox.userID === String(this.user.id);
      });
    }
  },
  mounted() {
    this.setup()
  },
  methods: {
    setup() {

      this.isOwn = this.inbox.from.userID === String(this.user.id)

    }
  }
}
</script>
