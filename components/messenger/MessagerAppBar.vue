<template>

  <van-nav-bar
    left-arrow
    @click-left="$router.back()"
    @click-right="callAction()"
  >
    <template #right>
      <button class="text-primary-500 flex justify-center items-center">
        <svg class="fill-current" width="20" height="20">
          <use xlink:href="#i-videocam" />
        </svg>
      </button>
    </template>

    <template #title>

      <div
        v-if="room.avatar"
        class="w-9 h-9 bg-white rounded-full border-2 border-white overflow-hidden user-appbar-item"
        @click="showRoomInfo()"
      >
        <img
          class="w-full h-full object-cover"
          :src="room.avatar"
          :alt="room.name"
        >
      </div>

      <div v-else id="room-users" ref="listUsers" class="flex justify-center px-5 cursor-pointer" @click="showRoomInfo()">
        <div
          v-for="(user, index) in members.slice(0, 3)"
          :key="user.id"
          :data-index="index"
          class="w-9 h-9 bg-white rounded-full border-2 border-white overflow-hidden mx-[-5px] user-appbar-item"
        >
          <img
            class="w-full h-full object-cover"
            :src="user.avatar || 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/223.jpg'"
            :alt="user.name"
          >
        </div>
      </div>

    </template>

  </van-nav-bar>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "MessagerAppBar",
  data() {
    return {
      showCallBadge: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['room', 'members', 'calling']),
    countCalling() {
      return this.calling.length
    }
  },
  watch: {
    countCalling(val) {
      if(!this.showCallBadge && val) {
        this.showCallBadge = true
      }
      if(!val) {
        this.showCallBadge = false
      }
    }
  },
  methods: {
    showRoomInfo() {
      if(this.members.length) {
        this.$nuxt.$emit("showRoomInfo");
      }
    },
    callAction() {
      this.$jitsi.open(this.room.id, 1200, 800)
    }
  }
}
</script>
