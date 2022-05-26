export const state = () => ({
  onlines: [],
  messages: [],
  room: {},
  inboxs: [],
  calling: []
})

// getters
export const getters = {
  onlines: (state) => state.onlines,
  messages: (state) => state.messages,
  room: (state) => state.room,
  members: state => state.room.users || [],
  inboxs: state => state.inboxs,
  offset: state => state.inboxs.filter((e) => e.content).length,
  calling: state => state.calling,
}

// mutations
export const mutations = {
  SET_ONLINES(state, data) {
    state.onlines = data
  },
  SET_ROOM(state, data) {
    state.room = data
  },

  SET_INBOXS(state, data) {
    state.inboxs = data
  },

  SET_CALLING(state, data) {
    state.calling = data
  }
}

// actions
export const actions = {

  setOnlines({ commit }, payload) {
    commit('SET_ONLINES', payload)
  },
  setRoom({ commit }, payload) {
    commit('SET_ROOM', payload)
  },
  setInboxs({ commit }, payload) {
    commit('SET_INBOXS', payload)
  },
  setCalling({ commit }, payload) {
    commit('SET_CALLING', payload)
  }
}
