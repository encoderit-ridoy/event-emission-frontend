import { UserApi } from '@/api'

const state = {
	allUsers: {},
	singleCompanyUsers: {},
}

const getters = {
	allUsers: (state) => state.allUsers,
	singleCompanyUsers: (state) => state.singleCompanyUsers,
}

const mutations = {
	SET_ALL_USERS(state, payload) {
		state.allUsers = payload
	},
	SET_SINGLE_COMPANY_USERS(state, payload) {
		state.singleCompanyUsers = payload
	},

	SET_NEW_USER(state, payload) {
		state.allUsers.data.unshift(payload)
	},
	SET_SINGLE_COMPANY_NEW_USER(state, payload) {
		state.singleCompanyUsers.data.unshift(payload)
	},
	SET_UPDATE_USER(state, payload) {
		const index = state.allUsers.data.findIndex(
			(user) => user.id === payload.id
		)
		if (index !== -1) {
			state.allUsers.data.splice(index, 1, payload)
		}
	},
	SET_SINGLE_COMPANY_UPDATE_USER(state, payload) {
		const index = state.singleCompanyUsers.data.findIndex(
			(user) => user.id === payload.id
		)
		if (index !== -1) {
			state.singleCompanyUsers.data.splice(index, 1, payload)
		}
	},
	SET_UPDATE_USER_STATUS(state, payload) {
		const index = state.allUsers.data.findIndex(
			(user) => user.id === payload.id
		)
		if (index !== -1) {
			const old = state.allUsers.data[index]
			state.allUsers.data.splice(index, 1, {
				...old,
				status: payload.status,
			})
		}
	},
	SET_DELETE_USER(state, payload) {
		state.allUsers.data = state.allUsers.data.filter(
			(user) => user.id !== payload.id
		)
	},
	SET_SINGLE_COMPANY_DELETE_USER(state, payload) {
		state.singleCompanyUsers.data = state.singleCompanyUsers.data.filter(
			(user) => user.id !== payload.id
		)
	},
}

const actions = {
	async fetchAllUsers({ commit }, params = {}) {
		const [error, response] = await UserApi.index(params)
		if (!error) {
			if (params.single_company) {
				commit('SET_SINGLE_COMPANY_USERS', response.users)
			} else {
				commit('SET_ALL_USERS', response.users)
			}
		}
		return [error, response]
	},

	async createUser({ commit }, params = {}) {
		const [error, response] = await UserApi.create(params)
		if (!error) {
			if (params.single_company) {
				commit('SET_SINGLE_COMPANY_NEW_USER', response.user)
			} else {
				commit('SET_NEW_USER', response.user)
			}
		}
		return [error, response]
	},
	async updateUser({ commit }, payload) {
		console.log('UPDATE_USER', payload)
		const [error, response] = await UserApi.update(payload)
		if (!error) {
			if (!payload.admin) {
				commit('SET_SINGLE_COMPANY_UPDATE_USER', response.user)
			} else {
				commit('SET_UPDATE_USER', response.user)
			}
		}
		return [error, response]
	},
	async updateUserStatus({ commit }, payload) {
		const [error, response] = await UserApi.status(payload)
		if (!error) {
			commit('SET_UPDATE_USER_STATUS', response.user)
		}
		return [error, response]
	},
	async deleteUser({ commit }, payload) {
		const [error, response] = await UserApi.delete(payload.id)
		if (!error && payload.single_company) {
			commit('SET_SINGLE_COMPANY_DELETE_USER', payload)
		} else {
			commit('SET_DELETE_USER', payload)
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
