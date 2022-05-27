<template>
  <NuxtLink
    :to="toRoom(room)"
    class="py-4 border-b last:border-0 border-gray-100 block"
  >
    <div class="flex">

      <div ref="avatarRef">
        <avatar-border :avatar="room.avatar" class="relative flex-shrink-0" :onlines="onlines.length" />
      </div>

      <div
        class="w-full"
        :class="{
          'opacity-50': isRead
        }"
      >
        <div
          ref="contentRef"
          class="w-full pl-3"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-medium line-clamp-1">
              {{ roomName }}
            </h4>

            <span v-if="isRead" ref="readAt" class="ml-4 flex items-center text-gray-500 flex-shrink-0 opacity-90">
            <svg class="fill-current" width="18" height="18">
              <use xlink:href="#i-check"/>
            </svg>
          <span class="text-[12px] ml-1">Đã xem</span>
        </span>

          </div>
          <p class="line-clamp-2 text-sm">

          <template v-if="inbox.isRecall">
            Message has been recalled
          </template>

            <template v-else-if="inbox.content">
              {{ inbox.content }}
            </template>

            <template v-else-if="inbox.images">
              {{ inbox.from.name }} đã gửi {{ inbox.images.length }} hình ảnh
            </template>

            <template v-else-if="inbox.file">
              {{ inbox.from.name }} đã gửi một tệp đính kèm
            </template>

          </p>
        </div>
      </div>

    </div>
  </NuxtLink>
</template>

<script>
import {mapGetters} from "vuex";
import linkBuilder from "~/plugins/mixins/linkBuilder";
import {SUB_USER_ONLINE} from "~/apollo/subscription/room.subscription";
import {GET_INBOXS} from "~/apollo/queries/inbox.queries";
import {SUB_INBOX_BY_ROOM} from "~/apollo/subscription/inbox.subscription";
// import {SUB_INBOX_BY_ROOM} from "~/apollo/subscription/inbox.subscription";

export default {
  name: "RoomMessages",
  mixins: [linkBuilder],
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      onlines: [],
      inbox: {
        readAt: []
      }
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    isRead() {

      let _index = -1

      this.inbox.readAt?.forEach((e, index) => {
        if(String(e.user.userID)) {
          _index = index
        }
      })

      return _index > -1
    },
    roomName() {
      if(this.room.name) {
        return this.room.name
      } else if (this.room.users.length === 1) {
        return 'Room of your self'
      } else if(this.room.users.length === 2) {
        const _index = this.room.users.findIndex((e) => String(e.userID) === String(this.user.id))
        return this.room.users[_index === 0 ? 1 : 0].name
      } else {
        return 'Group ' + this.room.users.length + ' members'
      }
    }
  },
  apollo: {
    $subscribe: {
      roomOnlines: {
        query: SUB_USER_ONLINE,
        variables() {
          return {
            roomId: this.room.id,
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          this.onlines = data.roomOnlines.onlines
        },
      },
      subNewInboxByRoom: {
        query: SUB_INBOX_BY_ROOM,
        variables() {
          return {
            userId: String(this.user.id),
            roomId: this.room.id
          }
        },
        result ({ data }) {
          this.inbox = data.subNewInboxByRoom
        },
        fetchPolicy: 'no-cache'
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.showAnimation())
    this.$nextTick(() => this.getInboxs())
  },
  methods: {
    showAnimation() {
      const tl = this.$anime.timeline({
        duration: 1700
      })

      tl.add({
        targets: this.$refs.avatarRef,
        scale: [0, 1],
        opacity: [0, 1]
      })
        .add({
          targets: this.$refs.contentRef,
          translateY: [30, 0],
          opacity: [0, 1]
        }, 400)
        .add({
          targets: this.$refs.readAt,
          scale: [0, 1],
          opacity: [0, 1]
        }, 1700)

    },

    async getInboxs() {
      try {
        const { data } = await this.$apollo.query({
          query: GET_INBOXS,
          variables: {
            filter: {
              roomID: this.room.id,
              limit: 1,
              offset: 0
            }
          },
          fetchPolicy: 'no-cache'
        })
        this.inbox = data?.inboxsGet[0] || {}
      } catch (e) {}
    }
  }
}
</script>
