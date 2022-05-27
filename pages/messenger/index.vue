<template>
  <div>

    <div class="w-screen max-w-2xl mx-auto fixed z-50">
      <messager-app-bar ref="navRef" />
    </div>
    <!-- Messages Area -->

    <chat-area ref="areaRef" />

    <!-- End Messages Area -->

    <div class="w-screen max-w-2xl mx-auto fixed z-50 bottom-0">
      <messenger-inbox-tool ref="toolRef" />
    </div>

    <room-info />

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {SUB_ROOM_CALLING, SUB_USER_ONLINE} from "~/apollo/subscription/room.subscription";
import {GET_ROOM, GET_ROOM_CALLING} from "~/apollo/queries/room.queries";
import {SUB_UPDATING_INBOX} from "~/apollo/subscription/inbox.subscription";

export default {
  name: "MessengerRoom",
  data() {
    return {
      isLoading: false,
      showReCall: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['inboxs'])
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
      },
      subCallingRooms: {
        query: SUB_ROOM_CALLING,
        variables() {
          return {
            roomId: this.$route.params.id
          }
        },
        result ({ data }) {
          // Let's update the local data
          this.setCalling(data.subCallingRooms)
        },
      },
      subUpdatingInbox: {
        query: SUB_UPDATING_INBOX,
        variables() {
          return {
            roomId: this.$route.params.id
          }
        },
        manual: true,
        result ({ data, loading }) {
          !loading && this.updateInbox(data.subUpdatingInbox)
        },
        fetchPolicy: 'no-cache'
      }
    },
    getRoomCalling: {
      query: GET_ROOM_CALLING,
      variables() {
        return {
          roomId: this.$route.params.id
        }
      },
      manual: true,
      result ({ data, loading }) {
        if (!loading) {
          this.setCalling(data.getRoomCalling)
        }
      },
      fetchPolicy: 'no-cache'
    }
  },
  methods: {

    ...mapActions('room', ['setCalling']),

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
    },

    async updateInbox(e) {
      const _mess = [...this.inboxs]

      for (let i = 0; i < _mess.length; i++) {
        if(_mess[i].id === e.id) {
          _mess[i] = Object.assign({}, _mess[i], { isRecall: true })
          await this.$store.dispatch('room/setInboxs', _mess)
          break
        }
      }
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
