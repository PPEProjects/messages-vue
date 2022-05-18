export const actions = {
  async nuxtServerInit({ commit, state, dispatch }, { route }) {
    const _token = this.$cookies.get('_token')
    if(_token) {
      await dispatch('user/getMe')
    }
  }
}
