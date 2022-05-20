export const actions = {
  async nuxtServerInit({ commit, state, dispatch }, { route }) {

    const queryToken = route.query._token

    console.log('queryToken', queryToken)

    if(queryToken) {
      this.$cookies.set('_token', route.query._token)
      await dispatch('user/getMe')
    } else {
      const _token = this.$cookies.get('_token')
      if(_token) {
        await dispatch('user/getMe')
      }
    }
  }
}
