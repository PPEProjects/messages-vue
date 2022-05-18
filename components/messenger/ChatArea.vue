<template>

  <van-pull-refresh
    v-model="isLoading"
    loading-text="Loading..."
    loosing-text="Release to load more"
    pulling-text="Pull to load more"
    class="opacity-0"
    @refresh="onRefresh"
  >
    <div ref="scroll" class="h-full overflow-y-auto scrollbar-hide pb-9">

      <div
        v-for="(inbox, index) in inboxs"
        :key="inbox.id"
        :data-index="index"
        class="px-4"
      >
        <message-bubble :message="inbox">

          <template v-if="inbox.content">
            {{ inbox.content }}
          </template>

          <images-bubble v-else-if="inbox.images" :images="inbox.images" />

          <file-bubble v-else-if="inbox.file" :file="inbox.file" />

        </message-bubble>
      </div>

    </div>
  </van-pull-refresh>
</template>

<script>
import {mapGetters} from "vuex";
import {SUB_NEW_MESSAGE} from "~/apollo/subscription/room.subscription";
import {GET_ROOM_MESSAGES} from "~/apollo/queries/room.queries";
import {GET_INBOXS} from "~/apollo/queries/inbox.queries";

export default {
  name: "ChatArea",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['messages', 'inboxs']),
  },
  watch: {
    inboxs: {
      handler(current, old) {
        this.$nextTick(() => {
          // scroll to bottom
          // this.$refs.areaRef.scrollTop = this.$refs.areaRef.scrollHeight;
          if(!old.length) {
            // Thay đổi lần đầu tiên
            this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
            setTimeout(() => {
              this.$anime({
                targets: this.$el.querySelectorAll('.chat-item'),
                opacity: [0, 1],
                translateY: [-50, 0],
                delay: this.$anime.stagger(100)
              })
            }, 100);
          } else {
            // khi thêm tin nhắn
            this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
            this.$anime({
              targets: this.$el.querySelectorAll('.chat-item')[current.length - 1],
              opacity: [0, 1],
              translateY: [50, 0],
            })
          }
        });
      },
      deep: true
    }
  },
  mounted() {
    // this.$nextTick(() => this.getMessages())
    this.$nextTick(() => this.getInboxs())
  },
  apollo: {
    $subscribe: {
      roomSubMessage: {
        query: SUB_NEW_MESSAGE,
        variables () {
          return {
            roomId: this.$route.params.id,
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          this.$store.dispatch('room/setMessages', [...this.messages, data.roomSubMessage]);
        },
      }
    }
  },
  methods: {
    async getMessages() {
      this.isLoading = true
      this.$nuxt.$loading.start()
      try {
        const { data } = await this.$apollo.query({
          query: GET_ROOM_MESSAGES,
          variables: {
            filter: {
              roomID: this.$route.params.id,
              limit: 10,
              offset: this.messages.length
            }
          },
          fetchPolicy: 'network-only'
        })
        const _mess = structuredClone(this.messages)
        await this.$store.dispatch('room/setMessages', [...data.messagesByRoom, ..._mess])
      } catch (e) {}
      this.$nuxt.$loading.finish()
      this.isLoading = false
    },
    async onRefresh() {
      const _oldlength = this.messages.length
      await this.getMessages()
      const _newlength = this.messages.length

      // có dữ liệu
      if(_oldlength !== _newlength) {
        const $els = this.$el.querySelectorAll('.chat-item')
        const arr = []
        for(let i = 0; i < _newlength - _oldlength; i++) {
          arr.push($els[i])
        }
        console.log(arr)
        this.$anime({
          targets: arr,
          opacity: [0, 1],
          translateY: [-50, 0],
          delay: this.$anime.stagger(100)
        })
      }

    },

    async getInboxs() {
      this.isLoading = true
      this.$nuxt.$loading.start()
      try {
        const { data } = await this.$apollo.query({
          query: GET_INBOXS,
          variables: {
            filter: {
              roomID: this.$route.params.id,
              limit: 10,
              offset: this.inboxs.length
            }
          },
          fetchPolicy: 'no-cache'
        })
        const _mess = structuredClone(this.inboxs)

        await this.$store.dispatch('room/setInboxs', [...data.inboxsGet, ..._mess])

      } catch (e) {}
      this.$nuxt.$loading.finish()
      this.isLoading = false
    },

  }
}
</script>
