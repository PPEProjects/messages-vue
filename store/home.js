export const state = () => ({
  rooms: [],
  messages: [],
})

// getters
export const getters = {
  rooms: (state) => state.rooms
}

// mutations
export const mutations = {
  SET_ROOMS(state, data) {
    state.rooms = data
  },
}

// actions
export const actions = {

  setRooms({ commit }, payload) {
    commit('SET_ROOMS', payload)
  }
}
