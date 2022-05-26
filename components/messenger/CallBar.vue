<template>

  <div :class="{ 'invisible': !showBadge || inCalling }">

    <div
      id="callbar"
      class="absolute -bottom-40 left-1/2 transform -translate-x-1/2 px-10 w-full"
    >

      <div ref="badgeRef" class="bg-white shadow-lg p-4 w-full max-w-[350px] mx-auto rounded-lg overflow-hidden opacity-0">

        <!-- Group top-->
        <div v-if="showBadge && !inCalling" class="flex justify-between">
          <div>
            <h3 class="font-medium text-[18px]">{{ roomName }}</h3>
            <p class="text-gray-500 mt-0.5 text-sm">Video calling</p>
          </div>

          <avatar-border :avatar="room.avatar" avatar-class="w-12 h-12 border-4" />

        </div>

        <div class="my-2 border-b border-gray-100"></div>

        <div class="flex justify-between text-white">

          <button id="cancelCallButton" class="bg-red-500 w-10 h-10 rounded-full flex justify-center items-center" @click="cancelCall()">
            <svg class="fill-current" width="20" height="20">
              <use xlink:href="#i-video-cam-off" />
            </svg>
          </button>

          <button id="acceptcall" class="bg-green-500 w-10 h-10 rounded-full flex justify-center items-center" @click="callAction()">
            <svg class="fill-current" width="20" height="20">
              <use xlink:href="#i-videocam" />
            </svg>
          </button>

        </div>

      </div>

    </div>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import {SUB_WAITING_CALLING} from "~/apollo/subscription/room.subscription";

export default {
  name: "CallBar",
  data() {
    return {
      showBadge: false,
      inCalling: false,
      room: {}
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    roomName() {
      if(Object.keys(this.room).length === 0) {
        return ''
      } else if(this.room.name) {
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
      subWaitingCall: {
        query: SUB_WAITING_CALLING,
        variables() {
          return {
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          this.inComingCall(data.subWaitingCall)
        },
      }
    }
  },
  mounted() {
    this.$nuxt.$on('videoConferenceJoinCallback', () => {
      this.inCalling = true
    })
    this.$nuxt.$on('videoConferenceLeftCallback', () => {
      this.inCalling = false
      this.showBadge = false
    })
    window.test = this.showAnimation
  },
  methods: {
    inComingCall(room) {
      if(this.showBadge || this.inCalling) {
        // đang nghe hoặc đã show badge
        return
      }

      this.room = room

      this.showBadge = true

      this.$nextTick(() => this.showAnimation())

    },

    showAnimation() {

      const height = this.$refs.badgeRef.scrollHeight

      this.$anime({
        targets: this.$refs.badgeRef,
        opacity: [0, 1],
        height: [0, height]
      })
    },
    callAction() {
      this.$jitsi.open(this.room.id, 1200, 800)
    },
    cancelCall() {
      const height = this.$refs.badgeRef.scrollHeight

      this.$anime({
        targets: this.$refs.badgeRef,
        opacity: [1, 0],
        height: [height, 0],
        complete: () => {
          this.showBadge = false
        }
      })
    }
  }
}
</script>

<style scoped>
#callbar {
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  max-width: 42rem;
  width: 100%;
}

/*#cancelCallButton > i {
  transform: rotateZ(135deg);
}*/

/*#acceptcall > i {
  !* Start the shake animation and make the animation last for 0.5 seconds *!
  animation: imcoming 0.5s;

  !* When the animation is finished, start again *!
  animation-iteration-count: infinite;
}*/


@keyframes imcoming {
  0% {
    transform: rotateZ(0);
  }
  50% {
    transform: rotateZ(-50deg);
  }
}
</style>
