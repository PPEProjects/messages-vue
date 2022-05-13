export const actions = {
  async nuxtServerInit({ commit, state, dispatch }, { route }) {
    const userID = route.query.userID
    if(userID) {
      await dispatch('user/getMe', userID)
    }
  }
}
