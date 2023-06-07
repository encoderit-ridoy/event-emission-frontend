import { OthersApi } from '@/api'

const state = {
	allOthersParams: {
		data: [],
	},
}

const getters = {
	allOthersParams: (state) => state.allOthersParams,
}

const mutations = {
	SET_OTHERS_PARAMS(state, payload) {
		state.allOthersParams.data = payload
	},
	SET_NEW_OTHERS_PARAMS(state, payload) {
		state.allOthersParams.data.unshift(payload)
	},
	SET_UPDATE_OTHERS_PARAMS(state, payload) {
		const index = state.allOthersParams.data.findIndex(
			(other) => other.id === payload.id
		)
		if (index !== -1) {
			state.allOthersParams.data.splice(index, 1, payload)
		}
	},
	SET_DELETE_OTHERS_PARAMS(state, payload) {
		state.allOthersParams.data = state.allOthersParams.data.filter(
			(other) => other.id !== payload.id
		)
	},
}

const actions = {
	async fetchOthersParams({ commit }, params = {}) {
		const [error, response] = await OthersApi.index(params)
		if (!error) {
			commit('SET_OTHERS_PARAMS', response.otherActivities)
		}
		return [error, response]
	},
	async createOthersParams({ commit }, payload) {
		const [error, response] = await OthersApi.create(payload)
		if (!error) {
			commit('SET_NEW_OTHERS_PARAMS', response.otherActivities)
		}
		return [error, response]
	},
	async updateOthersParams({ commit }, payload) {
		const [error, response] = await OthersApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_OTHERS_PARAMS', response.otherActivities)
		}
		return [error, response]
	},
	async deleteOthersParams({ commit }, payload) {
		const [error, response] = await OthersApi.delete(payload.id)
		if (!error) {
			commit('SET_DELETE_OTHERS_PARAMS', payload)
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
