<template>
  <div id="callInstance" class="min-h-screen"></div>
</template>

<script>
import {mapGetters} from "vuex";
import {SUB_CALLING} from "~/apollo/subscription/room.subscription";

export default {
  name: "CallVideo",
  layout: 'blank',
  computed: {
    ...mapGetters('user', ['user']),
  },
  apollo: {
    $subscribe: {
      subCalling: {
        query: SUB_CALLING,
        variables() {
          return {
            roomId: this.$route.query.room,
            userId: String(this.user.id)
          }
        },
        skip() {
          return !this.$route.query.room
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.configView())
  },
  methods: {
    configView() {
      if(!this.$route.query.room) {
        // không có query => dừng hàm
        return
      }

      const api = this.$jitsi.call(this.$route.query.room)

      api.addEventListener('videoConferenceLeft', (e) => {
        try {
          window.opener.$nuxt.$emit('videoConferenceLeftCallback', e);
          window.close()
        } catch (e) {
          this.$router.push('/')
        }
      })

    }
  }
}
</script>
