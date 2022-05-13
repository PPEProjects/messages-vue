export const state = () => ({
  onlines: [],
  messages: [],
})

// getters
export const getters = {
  onlines: (state) => state.onlines,
  messages: (state) => state.messages,
}

// mutations
export const mutations = {
  SET_ONLINES(state, data) {
    state.onlines = data
  },
  SET_MESSAGES(state, data) {
    state.messages = data
  },
}

// actions
export const actions = {

  setOnlines({ commit }, payload) {
    commit('SET_ONLINES', payload)
  },
  setMessages({ commit }, payload) {
    commit('SET_MESSAGES', payload)
  },
}
