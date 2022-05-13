<template>
  <div class="h-full overflow-y-auto scrollbar-hide opacity-0">

    <div
      v-for="(message, index) in messages"
      :key="message.id"
      :data-index="index"
      class="px-4"
    >
      <message-bubble :message="message"/>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {SUB_NEW_MESSAGE} from "~/apollo/subscription/room.subscription";
import {GET_ROOM_MESSAGES} from "~/apollo/queries/room.queries";

export default {
  name: "ChatArea",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['messages']),
  },
  watch: {
    messages: {
      handler(current, old) {
        this.$nextTick(() => {
          // scroll to bottom
          // this.$refs.areaRef.scrollTop = this.$refs.areaRef.scrollHeight;
          if(!old.length) {
            // Thay đổi lần đầu tiên
            this.$el.scrollTop = this.$el.scrollHeight;
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
            this.$el.scrollTop = this.$el.scrollHeight;
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
    this.$nextTick(() => this.getMessages())
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
              offset: 0
            }
          }
        })
        await this.$store.dispatch('room/setMessages', data.messagesByRoom)
      } catch (e) {}
      this.$nuxt.$loading.finish()
      this.isLoading = false
    }

  }
}
</script>
