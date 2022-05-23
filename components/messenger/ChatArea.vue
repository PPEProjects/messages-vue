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
        <message-bubble :inbox="inbox">

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
import {GET_INBOXS} from "~/apollo/queries/inbox.queries";
import {SUB_INBOX_BY_ROOM} from "~/apollo/subscription/inbox.subscription";

export default {
  name: "ChatArea",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['inboxs', 'offset'])
  },
  mounted() {
    this.$nextTick(async () => {
      await this.onRefresh()
    })
  },
  apollo: {
    $subscribe: {
      subNewInboxByRoom: {
        query: SUB_INBOX_BY_ROOM,
        variables() {
          return {
            userId: String(this.user.id),
            roomId: this.$route.params.id
          }
        },
        async result ({ data }) {

          const _mess = structuredClone(this.inboxs)

          await this.$store.dispatch('room/setInboxs', [..._mess, data.subNewInboxByRoom])

          this.$nextTick(() => {
            this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
            this.$anime({
              targets: this.$el.querySelectorAll('.chat-item')[this.inboxs.length - 1],
              opacity: [0, 1],
              translateY: [50, 0],
            })
          })

        },
        fetchPolicy: 'no-cache'
      }
    }
  },
  methods: {
    async onRefresh() {
      const _oldlength = this.inboxs.length
      await this.getInboxs()
      const _newlength = this.inboxs.length

      if(_oldlength === 0 && _newlength) {
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight
      }

      // có dữ liệu
      if(_oldlength !== _newlength) {
        const $els = this.$el.querySelectorAll('.chat-item')
        const arr = []
        for(let i = 0; i < _newlength - _oldlength; i++) {
          arr.push($els[i])
        }
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
              offset: this.offset
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
