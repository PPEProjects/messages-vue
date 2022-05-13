<template>
  <div>

    <messager-app-bar ref="navRef" />

    <!-- Messages Area -->

    <chat-area ref="areaRef" />

    <!-- End Messages Area -->

    <messenger-inbox-tool ref="toolRef" />

    <room-info />

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {SUB_USER_ONLINE} from "~/apollo/subscription/room.subscription";

export default {
  name: "MessengerRoom",
  asyncData({ app }) {
    app.store.dispatch("room/setMessages", []);
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['user'])
  },
  mounted() {
    this.$nextTick(() => this.configView())
  },
  apollo: {
    $subscribe: {
      roomOnlines: {
        query: SUB_USER_ONLINE,
        variables() {
          return {
            roomId: this.$route.params.id,
            userId: String(this.user.id)
          }
        },
        result ({ data }) {
          // Let's update the local data
         this.$store.dispatch('room/setOnlines', data.roomOnlines.onlines);
        },
      }
    }
  },
  methods: {
    configView() {
      const h1 = this.$refs.navRef.$el.offsetHeight
      const h2 = this.$refs.toolRef.$el.offsetHeight
      this.$refs.areaRef.$el.style.height = `calc(100vh - ${h1 + h2}px)`
      this.$refs.areaRef.$el.style.opacity = '1'
    },
  }
}
</script>

<style>
#messenger .messInput {
  padding: 0 10px;
  background: transparent;
}
#messenger .messInput:after {
  display: none;
}
</style>
