<template>
  <div class="w-full">
    <van-nav-bar
      title="Smileeye Messages"
      @click-right="showSearch = !showSearch"
    >
      <template #left>
        <img class="rounded-full" width="35px" height="35px" src="/images/logo.jpeg" alt="" />
      </template>
      <template #right>
        <van-icon v-if="!showSearch" size="16" name="search" />
        <van-icon v-else size="16" name="cross" />
      </template>
    </van-nav-bar>

    <div id="search-messages" ref="searchInputRef" class="absolute opacity-0 top-0 left-0 w-full">
      <van-search v-model="keyword" shape="round" placeholder="Search your message">
        <template #left-icon>
          <van-icon name="search" color="#cccccc" />
        </template>
      </van-search>
    </div>

    <div id="list-messages" ref="messagesRef" class="mt-4 px-4">
      <RoomMessages
        v-for="({ messages, room }, index) in roomsShow"
        :key="room.id"
        :data-index="index"
        :message="messages[0]"
        :room="room"
      />
    </div>

  </div>
</template>

<script>

import {mapGetters} from "vuex";
import {GET_ROOMS} from "~/apollo/queries/room.queries";
import {SUB_MY_ROOMS} from "~/apollo/subscription/room.subscription";

export default {
  name: 'IndexPage',
  asyncData({ app }) {
    app.store.dispatch("home/setRooms", []);
  },
  data() {
    return {
      keyword: '',
      showSearch: false,
      count: 0,
      timer: undefined,
      offset: 0,
      canLoadMore: true
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('home', ['rooms']),
    roomsShow() {
      return this.rooms.filter(room => room.messages.length > 0)
    }
  },
  watch: {
    showSearch(val) {
      if (val) {
        // show search. Animation show messages
        const height = this.$refs.searchInputRef.offsetHeight
        this.$anime({
          targets: this.$refs.messagesRef,
          translateY: [0, height],
        })
        this.$anime({
          targets: this.$refs.searchInputRef,
          translateY: [0, height],
          opacity: [0, 1]
        })
      } else {
        const height = this.$refs.searchInputRef.offsetHeight
        this.$anime({
          targets: this.$refs.messagesRef,
          translateY: [height, 0],
        })
        this.$anime({
          targets: this.$refs.searchInputRef,
          translateY: [height, 0],
          opacity: [1, 0]
        })
      }
    }
  },

  apollo: {
    $subscribe: {
      subMyRooms: {
        query: SUB_MY_ROOMS,
        variables() {
          return {
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          let _index = -1
          for (let i = 0; i < this.rooms.length; i++) {
            if(this.rooms[i].room.id === data.subMyRooms.room.id) {
               _index = i
              break
            }
          }
          if(_index === -1) {
            this.rooms.push(data.subMyRooms)
            this.$store.dispatch('home/setRooms', [data.subMyRooms, ...this.rooms])
          } else {
            const _rooms = structuredClone(this.rooms)
            _rooms.splice(_index, 1)
            this.$store.dispatch('home/setRooms', [data.subMyRooms, ..._rooms])
          }
        },
      }
    }
  },

  mounted() {
    this.$nextTick(() => this.showUsers())
    this.$nextTick(() => this.getRooms())
  },
  methods: {


    showUsers() {
      this.timer = setInterval(() => {
        this.count++;
        if(this.count > 10) {
          clearInterval(this.timer);
        }
      }, 500);
    },

    async getRooms() {
      this.$nuxt.$loading.start()
      try {
        const { data } = await this.$apollo.query({
          query: GET_ROOMS,
          variables: {
            input: {
              userID: String(this.user.id),
              limit: 10,
              offset: this.offset
            }
          },
          fetchPolicy: 'network-only'
        })
        if(data.getRooms.length) {
          await this.$store.dispatch('home/setRooms', data.getRooms)
        } else {
          this.canLoadMore = false
        }
      } catch (e) {}
      this.$nuxt.$loading.finish()
    }
  },
}
</script>
