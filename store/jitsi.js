export const state = () => ({
  instance: {}
})

// getters
export const getters = {
  instance: (state) => state.instance
}

// mutations
export const mutations = {
  SET_INSTANCE(state, data) {
    state.instance = data
  },
}

// actions
export const actions = {

  setInstance({ commit }, payload) {
    commit('SET_INSTANCE', payload)
  }
}
