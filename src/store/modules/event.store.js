import { EventApi } from '@/api'

const state = {
	allEvents: {},
}

const getters = {
	allEvents: (state) => state.allEvents.events,
}

const mutations = {
	SET_EVENT(state, payload) {
		state.allEvents = payload
	},
	SET_NEW_EVENT(state, payload) {
		state.allEvents.events.data.unshift(payload.event)
	},
	SET_UPDATE_EVENT(state, payload) {
		const index = state.allEvents.events.data.findIndex(
			(event) => event.id === payload.id
		)
		if (index !== -1) {
			state.allEvents.events.data.splice(index, 1, payload)
		}
	},
	SET_DELETE_EVENT(state, payload) {
		state.allEvents.events.data = state.allEvents.events.data.filter(
			(event) => event.id !== payload.id
		)
	},
}

const actions = {
	async fetchEvents({ commit }, data) {
		const [error, response] = await EventApi.index(data)
		if (!error) {
			console.log('createEvent::fetchEvents', response)
			commit('SET_EVENT', response)
		}
		return [error, response]
	},
	async showEvent({ commit }, id) {
		const [error, response] = await EventApi.show(id)
		return [error, response]
	},
	async createEvent({ commit }, data) {
		const [error, response] = await EventApi.create(data)
		if (!error) {
			console.log('SET_NEW_EVENT', response)
			commit('SET_NEW_EVENT', response)
		}
		return [error, response]
	},
	async updateEvent({ commit }, payload) {
		const [error, response] = await EventApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_EVENT', response.event)
		}
		return [error, response]
	},
	async deleteEvent({ commit }, payload) {
		const [error, response] = await EventApi.delete(payload.id)
		if (!error) {
			commit('SET_DELETE_EVENT', payload)
		}
		return [error, response]
	},
}

export default {
	state,
	getters,
	mutations,
	actions,
}
