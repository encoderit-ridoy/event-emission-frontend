import { OnlineMeetingApi } from '@/api'

const state = {
	allOnlineMeetingParams: {
		data: [],
	},
}

const getters = {
	allOnlineMeetingParams: (state) => state.allOnlineMeetingParams,
}

const mutations = {
	SET_ONLINE_MEETING_PARAMS(state, payload) {
		state.allOnlineMeetingParams.data = payload
	},
	SET_NEW_ONLINE_MEETING_PARAMS(state, payload) {
		state.allOnlineMeetingParams.data.unshift(payload)
	},
	SET_UPDATE_ONLINE_MEETING_PARAMS(state, payload) {
		const index = state.allOnlineMeetingParams.data.findIndex(
			(onlineMeeting) => onlineMeeting.id === payload.id
		)
		if (index !== -1) {
			state.allOnlineMeetingParams.data.splice(index, 1, payload)
		}
	},
	SET_DELETE_ONLINE_MEETING_PARAMS(state, payload) {
		state.allOnlineMeetingParams.data =
			state.allOnlineMeetingParams.data.filter(
				(onlineMeeting) => onlineMeeting.id !== payload.id
			)
	},
}

const actions = {
	async fetchOnlineMeetingParams({ commit }, params = {}) {
		const [error, response] = await OnlineMeetingApi.index(params)
		if (!error) {
			commit('SET_ONLINE_MEETING_PARAMS', response.online_meeting)
		}
		return [error, response]
	},
	async createOnlineMeetingParams({ commit }, payload) {
		const [error, response] = await OnlineMeetingApi.create(payload)
		if (!error) {
			commit('SET_NEW_ONLINE_MEETING_PARAMS', response.online_meeting)
		}
		return [error, response]
	},
	async updateOnlineMeetingParams({ commit }, payload) {
		const [error, response] = await OnlineMeetingApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_ONLINE_MEETING_PARAMS', response.online_meeting)
		}
		return [error, response]
	},
	async deleteOnlineMeetingParams({ commit }, payload) {
		const [error, response] = await OnlineMeetingApi.delete(payload.id)
		if (!error) {
			commit('SET_DELETE_ONLINE_MEETING_PARAMS', payload)
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
