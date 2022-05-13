export default {
  methods: {
    toRoom(room) {
      return {
        name: 'messenger',
        params: { id: room.id },
        query: this.$route.query
      }
    }
  }
}
