import { MeetingRoomApi } from '@/api'

const state = {
	allMeetingRoomParams: {
		data: [],
	},
}

const getters = {
	allMeetingRoomParams: (state) => state.allMeetingRoomParams,
}

const mutations = {
	SET_MEETING_ROOM_PARAMS(state, payload) {
		state.allMeetingRoomParams.data = payload
	},
	SET_NEW_MEETING_ROOM_PARAMS(state, payload) {
		state.allMeetingRoomParams.data.unshift(payload)
	},
	SET_UPDATE_MEETING_ROOM_PARAMS(state, payload) {
		const index = state.allMeetingRoomParams.data.findIndex(
			(meeting) => meeting.id === payload.id
		)
		if (index !== -1) {
			state.allMeetingRoomParams.data.splice(index, 1, payload)
		}
	},
	SET_DELETE_MEETING_ROOM_PARAMS(state, payload) {
		state.allMeetingRoomParams.data = state.allMeetingRoomParams.data.filter(
			(meeting) => meeting.id !== payload.id
		)
	},
}

const actions = {
	async fetchMeetingRoomParams({ commit }, params = {}) {
		const [error, response] = await MeetingRoomApi.index(params)
		if (!error) {
			commit('SET_MEETING_ROOM_PARAMS', response.meetingRooms)
		}
		return [error, response]
	},
	async createMeetingRoomParams({ commit }, payload) {
		const [error, response] = await MeetingRoomApi.create(payload)
		if (!error) {
			commit('SET_NEW_MEETING_ROOM_PARAMS', response.meetingRoom)
		}
		return [error, response]
	},
	async updateMeetingRoomParams({ commit }, payload) {
		const [error, response] = await MeetingRoomApi.update(payload)
		if (!error) {
			commit('SET_UPDATE_MEETING_ROOM_PARAMS', response.meetingRoom)
		}
		return [error, response]
	},
	async deleteMeetingRoomParams({ commit }, payload) {
		const [error, response] = await MeetingRoomApi.delete(payload.id)
		if (!error) {
			commit('SET_DELETE_MEETING_ROOM_PARAMS', payload)
			console.log('SET_DELETE_MEETING_ROOM_PARAMS', response)
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
