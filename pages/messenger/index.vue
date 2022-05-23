<template>
  <div>

    <messager-app-bar ref="navRef" />

    <!-- Messages Area -->

    <chat-area ref="areaRef" style="height: calc(100vh - 103px); opacity: 1;" />

    <!-- End Messages Area -->

    <messenger-inbox-tool ref="toolRef" />

    <room-info />

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {SUB_USER_ONLINE} from "~/apollo/subscription/room.subscription";
import {GET_ROOM} from "~/apollo/queries/room.queries";

export default {
  name: "MessengerRoom",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user'])
  },
  beforeDestroy() {
    this.$store.dispatch("room/setInboxs", [])
    this.$store.dispatch("room/setRoom", {})
  },
  mounted() {
    this.$nextTick(() => this.getRoom())
  },
  apollo: {
    $subscribe: {
      roomOnlines: {
        query: SUB_USER_ONLINE,
        variables() {
          return {
            roomId: this.$route.params.id,
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          // Let's update the local data
         this.$store.dispatch('room/setRoom', data.roomOnlines.room)
         this.$store.dispatch('room/setOnlines', data.roomOnlines.onlines);
        },
      }
    }
  },
  methods: {

    async getRoom() {
      try {
        const { data } = await this.$apollo.query({
          query: GET_ROOM,
          variables: {
            roomId: this.$route.params.id,
            userId: String(this.user.id)
          },
          fetchPolicy: 'no-cache'
        });

        await this.$store.dispatch('room/setRoom', data.roomGet)

      } catch (e) {}
    }
  }
}
</script>

<style>
#messenger .messInput {
  padding: 0 10px;
  background: transparent;
}
#messenger .messInput:after {
  display: none;
}
.images-bubble .van-grid-item__content {
  padding: 8px 8px;
}

.van-image-preview__image {
  background: white;
}
</style>
