<template>
  <div class="w-full relative">
    <van-nav-bar
      title="Smileeye Messages"
      z-index="40"
      @click-right="showSearch = !showSearch"
    >
      <template #left>
        <img class="rounded-full" width="35px" height="35px" src="/images/logo.jpeg" alt="" />
      </template>

      <template #right>
        <van-button class="add-group-button opacity-0" color="#3b66f5" size="small" round :loading="isCreatingGroup" @click="createGroup()">
          CREATE
          <template #icon>
            <van-icon name="plus" color="#ffffff" />
          </template>
        </van-button>
      </template>

    </van-nav-bar>

    <div id="search-messages" ref="searchInputRef">
      <van-search v-model="keyword" shape="round" placeholder="Search your friends" @search="onSearch" @clear="clearSearch" @input="!keyword && clearSearch()">
        <template #left-icon>
          <van-icon name="search" color="#cccccc" />
        </template>
      </van-search>
    </div>

    <div class="relative">
      <div
        id="list-messages"
        ref="messagesRef"
        class="px-4 bg-white relative"
        :class="[showSearch ? 'z-10 pointer-events-none' : 'z-20']"
      >
        <RoomMessages
          v-for="({ messages, room }, index) in roomsShow"
          :key="room.id"
          :data-index="index"
          :message="messages[0]"
          :room="room"
        />
      </div>

      <div ref="searchResult" class="bg-white top-0 left-0 absolute w-full opacity-0" :class="[showSearch ? 'z-20' : 'z-10 pointer-events-none']">

        <div v-if="!showSearchResults">
          <img class="max-w-[300px] mx-auto block" src="/images/search.webp" alt="" />
          <div class="text-xs text-gray-500 text-center">Enter to search all results</div>
        </div>

        <div v-else>

          <search-results v-if="searchResults.length" v-model="choices" :users="searchResults" />

          <div v-else>
            <img class="max-w-[200px] mx-auto block" src="/images/cat-cry.jpg" alt="" />
            <div class="text-xs text-gray-500 text-center">Not found anyone !!!</div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>

import {mapGetters} from "vuex";
import {GET_ROOMS} from "~/apollo/queries/room.queries";
import {SUB_MY_ROOMS} from "~/apollo/subscription/room.subscription";
import {UPSERT_GROUP} from "~/apollo/mutation/room.mutation";

export default {
  name: 'IndexPage',
  asyncData({ app }) {
    app.store.dispatch("home/setRooms", []);
  },
  data() {
    return {
      keyword: '',
      showSearchResults: false,
      count: 0,
      timer: undefined,
      offset: 0,
      canLoadMore: true,
      searchResults: [],
      choices: [],
      isCreatingGroup: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('home', ['rooms']),
    roomsShow() {
      return this.rooms.filter(room => room.messages.length > 0)
    },
    showSearch() {
      return this.keyword.length > 0
    }
  },
  watch: {
    showSearch(val) {
      this.playAnimation(val)
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
    this.$nextTick(() => this.getRooms())
  },
  methods: {
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
    },

    playAnimation(val) {
      // if(this.timer) {
      //   clearTimeout(this.timer)
      // }
      // this.timer = setTimeout(() => {
      //   this.$nextTick(() => {
          if (val) {
            this.$anime({
              targets: this.$refs.messagesRef,
              opacity: [1, 0],
              translateY: [0, 50],
              // duration: 2000,
              /* begin: () => {
                this.$refs.messagesRef.classList.remove('invisible')
              },
              complete: () => {
                this.$refs.messagesRef.classList.add('invisible')
              } */
            })

            this.$anime({
              targets: this.$refs.searchResult,
              opacity: [0, 1],
              translateY: [50, 0],
              // duration: 2000,
              /* begin: () => {
                this.$refs.searchResult.classList.remove('invisible')
              },
              complete: () => {
                this.$refs.searchResult.classList.remove('invisible')
              } */
            })

          } else {

            this.$anime({
              targets: this.$refs.messagesRef,
              opacity: [0, 1],
              translateY: [50, 0],
              /* duration: 2000,
              begin: () => {
                this.$refs.messagesRef.classList.remove('invisible')
              },
              complete: () => {
                this.$refs.messagesRef.classList.remove('invisible')
              } */
            })

            this.$anime({
              targets: this.$refs.searchResult,
              opacity: [1, 0],
              translateY: [0, 50],
              // duration: 2000,
              /* begin: () => {
                this.$refs.searchResult.classList.remove('invisible')
              },
              complete: () => {
                this.$refs.searchResult.classList.add('invisible')
              } */
            })
          }
      //   })
      // }, 300)
    },

    clearSearch() {
      this.showSearchResults = false
      this.searchResults = []
    },

    async createGroup() {
      this.$nuxt.$loading.start()
      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPSERT_GROUP,
          variables: {
            input: {
              users: this.choices.map((e) => (
                {
                  name: e.name,
                  avatar: e.avatar,
                  userID: String(e.id)
                }
              ))
            }
          }
        })
        console.log(data)
      } catch (e) {}
      this.$nuxt.$loading.finish()
    },

    async onSearch() {
      if(!this.keyword) {
        return
      }
      try {
        const data = await fetch('https://v2-be.smileeye.edu.vn/searchUser/' + this.keyword)
        if(data.status === 200) {
          this.searchResults = ((await data.json()) || []).splice(0, 5)
          this.showSearchResults = true
          if(this.searchResults.length) {
            this.$nextTick(() => {
              this.$anime({
                targets: '.search-item',
                opacity: [0, 1],
                translateY: [-50, 0],
                delay: this.$anime.stagger(100)
              })
            })
          }
        }
      } catch (e) {}
    }
  },
}
</script>
