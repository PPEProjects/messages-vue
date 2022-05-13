export const state = () => ({
  /**
   * @property { { name: String, avatar: String, email: String, role: String, verified: Boolean } } user
   */
  user: {}
})

// getters
export const getters = {
  user: (state) => state.user,
  auth: (state) => Object.keys(state.user).length > 0
}

// mutations
export const mutations = {
  SET_USER(state, data) {
    state.user = data
  }
}

// actions
export const actions = {

  async getMe({ commit, dispatch }, payload) {
    try {

      const { data } = await this.$axios.get('https://v2-be.smileeye.edu.vn/detailUser/' + payload)

      if(data) {
        dispatch('setUser', data)
      }

    } catch (e) {}
  },

  setUser({ commit }, payload) {
    commit('SET_USER', payload)
  }
}
