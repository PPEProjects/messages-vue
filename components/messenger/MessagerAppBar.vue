<template>

  <van-nav-bar
    left-arrow
    @click-left="$router.back()"
  >
    <template #right>
      <van-icon name="phone" size="22" />
    </template>

    <template #title>
      <div id="room-users" class="flex justify-center px-5 cursor-pointer" @click="showRoomInfo()">
        <div
          v-for="(user, index) in roomGet.users"
          :key="user.id"
          :data-index="index"
          class="w-9 h-9 bg-white rounded-full border-2 border-white overflow-hidden mx-[-5px]"
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
import {GET_ROOM} from "~/apollo/queries/room.queries";

export default {
  name: "MessagerAppBar",
  data() {
    return {
      roomGet: {
        users: []
      }
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  apollo: {
    roomGet: {
      query: GET_ROOM,
      variables() {
        return {
          roomId: this.$route.params.id,
          userId: String(this.user.id)
        }
      }
    }
  },
  methods: {
    showRoomInfo() {
      if(this.roomGet.users.length) {
        this.$nuxt.$emit("showRoomInfo");
      }
    }
  }
}
</script>
