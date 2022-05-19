<template>
  <van-popup
    id="roomInfo"
    v-model="show"
    closeable
    position="bottom"
    :style="{
      height: '90%',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
      maxWidth: '42rem',
      left: left + 'px'
    }"
  >
    <div id="roomInfoBody">
      <h4 class="px-4 py-4 font-medium text-[16px]">Settings</h4>

      <div id="roomInfoContent">
        <div class="px-4 pb-5">
          <div class="flex h-24">
            <div class="relative flex-shrink-0">
              <div
                class="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  class="w-full h-full object-cover"
                  src="https://i.imgur.com/lzv2cPV.png"
                  alt=""
                />
              </div>
              <div
                class="w-8 h-8 rounded-full border-2 border-white absolute bg-primary-500 flex items-center justify-center text-[14px] text-white shadow-lg bottom-0 right-0"
              >
                {{ members.length }}
              </div>
            </div>

            <div class="pl-4 h-full flex flex-col justify-center w-full">
              <h5 class="line-clamp-2">{{ room.name || 'Chat Room' }}</h5>
              <div class="text-gray-400 text-sm mt-1">
                Created At:
                {{ $dayjs(room.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>

            <button class="mx-4 flex-shrink-0">
              <van-icon name="edit" />
            </button>
          </div>
        </div>

        <div class="px-4 relative">

          <div class="flex items-center relative z-20">
            Members
            <button v-if="!openSearch" class="ml-auto text-sm text-gray-300" @click="openSearch = true">
              <span class="text-xs">Add</span>
              <van-icon name="plus" />
            </button>

            <button v-if="openSearch" class="ml-auto text-sm text-gray-300" @click="openSearch = false">
              <span class="text-xs">clear</span>
              <van-icon name="cross" />
            </button>

          </div>

          <div id="search-messages" ref="searchInputRef" class="absolute w-full top-0 left-0 z-10 opacity-0" :class="[openSearch ? '' : 'pointer-events-none']">
            <van-search v-model="keyword" shape="round" placeholder="Search your friends" @search="onSearch" @clear="clearSearch" @input="!keyword && clearSearch()">
              <template #left-icon>
                <van-icon name="search" color="#cccccc" />
              </template>
            </van-search>
          </div>


          <div ref="body" class="relative">

            <div id="membersList" ref="messagesRef" class="w-full mt-2" :class="[showSearch ? 'z-10 pointer-events-none' : 'z-20']">
              <members-item
                v-for="(user, index) in members"
                :key="user.id"
                :data-index="index"
                :member="user"
              />
            </div>

            <div ref="searchResult" class="bg-white top-0 left-0 absolute w-full opacity-0" :class="[showSearch ? 'z-20' : 'z-10 pointer-events-none']">

              <div v-if="!showSearchResults">
                <img class="max-w-[300px] mx-auto block" src="/images/search.webp" alt="" />
                <div class="text-xs text-gray-500 text-center">Enter to search all results</div>
              </div>

              <div v-else>

                <search-results v-if="searchResults.length" v-model="choices" :users="searchResults.filter((e) => e.id !== user.id)" />

                <div v-else>
                  <img class="max-w-[200px] mx-auto block" src="/images/cat-cry.jpg" alt="" />
                  <div class="text-xs text-gray-500 text-center">Not found anyone !!!</div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>

    <button
      class="w-14 h-14 transform animate flex justify-center items-center border-[3px] border-white shadow-md bg-primary-500 absolute bottom-5 right-5 text-white rounded-full"
      :class="{
        'scale-0 opacity-0': !choices.length && show,
        'opacity-50': isLoading
      }"
      :disabled="!choices.length && show || isLoading"
      @click="addToGroup()"
    >
      <van-icon size="25" name="plus" />
    </button>

  </van-popup>
</template>

<script>
import { mapGetters } from 'vuex'
import searchUsers from "~/plugins/mixins/searchUsers";
import {ADD_USERS_TO_GROUP} from "~/apollo/mutation/room.mutation";

export default {
  name: 'RoomInfo',
  mixins: [searchUsers],
  data() {
    return {
      show: false,
      left: 0,
      active: 0,
      openSearch: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('room', ['room', 'members']),
    showSearch() {
      return this.keyword.length > 0
    }
  },
  watch: {
    showSearch(val) {
      this.playAnimation(val)
    },
    openSearch(val, prev) {
      if(val !== prev) {
        if(val) {
          this.$anime({
            targets: this.$refs.searchInputRef,
            opacity: [0, 1],
            translateY: [0, 25],
          })
          this.$anime({
            targets: this.$refs.body,
            translateY: [0, 40],
          })
        } else {

          this.$anime({
            targets: this.$refs.searchInputRef,
            opacity: [1, 0],
            translateY: [25, 0],
          })
          this.$anime({
            targets: this.$refs.body,
            translateY: [40, 0],
          })

        }

      }
    }
  },
  mounted() {
    this.$nuxt.$on('showRoomInfo', () => {
      this.show = true
    })
    this.$nextTick(() => this.configModal())
  },
  beforeDestroy() {
    this.$nuxt.$off('showRoomInfo')
  },
  methods: {
    configModal() {
      const width = window.innerWidth
      const maxWidth = document.getElementById('body').scrollWidth
      this.left = (width - maxWidth) / 2
    },

    async addToGroup() {
      this.isLoading = true
      try {
        await this.$apollo.mutate({
          mutation: ADD_USERS_TO_GROUP,
          variables: {
            input: {
              roomID: this.room.id,
              users: this.choices.map((e) => ({ name: e.name || '', avatar: e.avatar || '', userID: String(e.id) }))
            }
          }
        })
        this.$notify({ message: 'Thêm thành công', type: 'success' })
        this.clearSearch()
      } catch (e) {}
      this.isLoading = false
    },

    clearSearch() {
      this.showSearchResults = false
      this.keyword = ''
      this.searchResults = []
      this.openSearch = false
    },

    playAnimation(val) {
      if (val) {
        this.$anime({
          targets: this.$refs.messagesRef,
          opacity: [1, 0],
          translateY: [0, 50],
        })

        this.$anime({
          targets: this.$refs.searchResult,
          opacity: [0, 1],
          translateY: [50, 0]
        })

      } else {

        this.$anime({
          targets: this.$refs.messagesRef,
          opacity: [0, 1],
          translateY: [50, 0]
        })

        this.$anime({
          targets: this.$refs.searchResult,
          opacity: [1, 0],
          translateY: [0, 50],
        })
      }
    }
  },
}
</script>

<style>
.room-info-tab .van-tabs__line {
  background: linear-gradient(45deg, #5ca0ff, #146be6, #146be6);
}
#membersList .van-swipe-cell__right {
  display: flex;
  align-items: center;
}
</style>
