import { TransportationApi } from '@/api'

const state = {
	allTransportationParams: {
		data: [],
	},
}

const getters = {
	allTransportationParams: (state) => state.allTransportationParams,
}

const mutations = {
	SET_TRANSPORTATION_PARAMS(state, payload) {
		state.allTransportationParams.data = payload
	},
	SET_NEW_TRANSPORTATION_PARAMS(state, payload) {
		state.allTransportationParams.data.unshift(payload)
	},
	SET_UPDATE_TRANSPORTATION_PARAMS(state, payload) {
		const index = state.allTransportationParams.data.findIndex(
			(transportation) => transportation.id === payload.id
		)
		if (index !== -1) {
			state.allTransportationParams.data.splice(index, 1, payload)
		}
	},
	SET_DELETE_TRANSPORTATION_PARAMS(state, payload) {
		state.allTransportationParams.data =
			state.allTransportationParams.data.filter(
				(transportation) => transportation.id !== payload.id
			)
	},
}

const actions = {
	async fetchTransportationParams({ commit }, params = {}) {
		const [error, response] = await TransportationApi.index(params)
		if (!error) {
			commit('SET_TRANSPORTATION_PARAMS', response.transportation)
		}
		return [error, response]
	},
	async createTransportationParams({ commit }, payload) {
		const [error, response] = await TransportationApi.create(payload)
		if (!error) {
			commit('SET_NEW_TRANSPORTATION_PARAMS', response.transportaton)
		}
		return [error, response]
	},
	async updateTransportationParams({ commit }, payload) {
		const [error, response] = await TransportationApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_TRANSPORTATION_PARAMS', response.transportaton)
		}
		return [error, response]
	},
	async deleteTransportationParams({ commit }, payload) {
		const [error, response] = await TransportationApi.delete(payload.id)
		if (!error) {
			commit('SET_DELETE_TRANSPORTATION_PARAMS', payload)
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
