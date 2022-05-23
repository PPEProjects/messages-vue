import {UPSERT_GROUP} from "~/apollo/mutation/room.mutation";

export default {
  data() {
    return {
      keyword: '',
      showSearchResults: false,
      searchResults: [],
      choices: [],
      isCreatingGroup: false
    }
  },
  methods: {
    clearSearch() {
      this.showSearchResults = false
      this.searchResults = []
    },

    async createGroup() {

      if(this.choices.length < 1) {
        return
      }

      this.$nuxt.$loading.start()
      this.isCreatingGroup = true
      try {

        const _users = this.choices.map((e) => (
          {
            name: e.name,
            avatar: e.avatar,
            userID: String(e.id)
          }
        ))

        _users.push({
          name: this.user.name,
          avatar: this.user.avatar,
          userID: String(this.user.id)
        })

        const { data } = await this.$apollo.mutate({
          mutation: UPSERT_GROUP,
          variables: {
            input: {
              users: _users
            }
          }
        })
        /* this.$notify({
          type: 'success',
          message: 'Create room successfully!'
        }) */
        await this.$router.push({name: 'messenger', params: { id: data.roomUpsert.id }})
      } catch (e) {}
      this.isCreatingGroup = false
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
  }
}
