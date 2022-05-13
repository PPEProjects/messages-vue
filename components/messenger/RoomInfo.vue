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
      left: left + 'px',
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
                {{ roomGet.users.length }}
              </div>
            </div>

            <div class="pl-4 h-full flex flex-col justify-center w-full">
              <h5 class="line-clamp-2">{{ roomGet.name || 'Chat Room' }}</h5>
              <div class="text-gray-400 text-sm mt-1">
                Created At:
                {{ $dayjs(roomGet.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>

            <button class="mx-4 flex-shrink-0">
              <van-icon name="edit" />
            </button>
          </div>
        </div>

        <div class="px-4">
          <van-tabs
            v-model="active"
            class="border-t border-gray-100 room-info-tab"
          >
            <van-tab title="Members">
              <div id="membersList" class="w-full mt-2">
                <members-item
                  v-for="(user, index) in roomGet.users"
                  :key="user.id"
                  :data-index="index"
                  :member="user"
                />
              </div>
            </van-tab>

            <van-tab title="Privacy"> Coming soon :))) </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_ROOM } from '~/apollo/queries/room.queries'

export default {
  name: 'RoomInfo',
  data() {
    return {
      show: false,
      roomGet: {
        users: [],
      },
      left: 0,
      active: 0,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  apollo: {
    roomGet: {
      query: GET_ROOM,
      variables() {
        return {
          roomId: this.$route.params.id,
          userId: String(this.user.id),
        }
      },
    },
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
