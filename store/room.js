export const state = () => ({
  onlines: [],
  messages: [],
  room: {}
})

// getters
export const getters = {
  onlines: (state) => state.onlines,
  messages: (state) => state.messages,
  room: (state) => state.room,
  members: state => state.room.users || [],
}

// mutations
export const mutations = {
  SET_ONLINES(state, data) {
    state.onlines = data
  },
  SET_MESSAGES(state, data) {
    state.messages = data
  },
  SET_ROOM(state, data) {
    state.room = data
  }
}

// actions
export const actions = {

  setOnlines({ commit }, payload) {
    commit('SET_ONLINES', payload)
  },
  setMessages({ commit }, payload) {
    commit('SET_MESSAGES', payload)
  },
  setRoom({ commit }, payload) {
    commit('SET_ROOM', payload)
  }
}
