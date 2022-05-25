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
    state.rooms = data.sort((a, b) => b.updatedAt - a.updatedAt)
  },
}

// actions
export const actions = {

  setRooms({ commit }, payload) {
    commit('SET_ROOMS', payload)
  }
}
