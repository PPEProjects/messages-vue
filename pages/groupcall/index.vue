<template>
  <div id="callInstance" class="min-h-screen"></div>
</template>

<script>
export default {
  name: "CallVideo",
  layout: 'blank',
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
