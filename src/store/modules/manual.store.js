import { ManualApi } from '@/api'

const state = {
	allManuals: {},
}

const getters = {
	allManuals: (state) => state.allManuals,
}

const mutations = {
	SET_MANUALS(state, payload) {
		state.allManuals = payload
	},
	SET_NEW_MANUAL(state, payload) {
		state.allManuals.data.unshift(payload)
	},
	SET_UPDATE_MANUAL(state, payload) {
		const index = state.allManuals.data.findIndex(
			(data) => data.id === payload.id
		)
		if (index !== -1) {
			state.allManuals.data.splice(index, 1, payload)
		}
	},
}

const actions = {
	async fetchManualData({ commit }, params = {}) {
		const [error, response] = await ManualApi.index(params)
		if (!error) {
			commit('SET_MANUALS', response.contents)
		}
		return [error, response]
	},
	async createManual({ commit }, payload) {
		const [error, response] = await ManualApi.create(payload)
		if (!error) {
			commit('SET_NEW_MANUAL', response.contents)
		}
		return [error, response]
	},
	async updateManual({ commit }, payload) {
		const [error, response] = await ManualApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_MANUAL', response.content)
			// console.log('SET_UPDATE_MANUAL', response.content)
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
