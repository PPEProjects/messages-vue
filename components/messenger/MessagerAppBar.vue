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
          v-for="(user, index) in members"
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
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['room', 'members']),
  },
  apollo: {
    roomGet: {
      query: GET_ROOM,
      variables() {
        return {
          roomId: this.$route.params.id,
          userId: String(this.user.id)
        }
      },
      fetchPolicy: 'cache-only',
      manual: true,
      result({ data }) {
        if(data && data.roomGet) {
          this.$store.dispatch('room/setRoom', data.roomGet);
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.getRoom())
  },
  methods: {
    showRoomInfo() {
      if(this.members.length) {
        this.$nuxt.$emit("showRoomInfo");
      }
    },
    async getRoom() {
      try {
        await this.$apollo.query({
          query: GET_ROOM,
          variables: {
            roomId: this.$route.params.id,
            userId: String(this.user.id)
          }
        });
      } catch (e) {}
    }
  }
}
</script>
