import { AuthApi } from '@/api'
import { ROLE } from '@/consts'

const state = {
	token: null,
	currentUser: null,
}

const getters = {
	token: (state) => state.token,
	currentUser: (state) => {
		if (!state.currentUser) return null
		return {
			...state.currentUser,
			role: ((state.currentUser.roles || [])[0] || {}).slug,
			isAdmin: state.currentUser.roles.some((role) => {
				return role.slug === ROLE.ADMIN
			}),
			isUser: state.currentUser.roles.some((role) => {
				return role.slug === ROLE.USER
			}),
		}
	},
	isLoggedIn: (state) => !!(state.currentUser && state.token),
}

const mutations = {
	SET_TOKEN(state, token) {
		state.token = token
	},
	SET_CURRENT_USER(state, user) {
		state.currentUser = user
	},
	RE_SET_TOKEN(state) {
		state.token = null
	},
	RE_SET_CURRENT_USER(state) {
		state.currentUser = null
	},
}

const actions = {
	async login({ commit }, payload) {
		const [error, response] = await AuthApi.login(payload)

		if (!error) {
			commit('SET_TOKEN', response.token)
		}
		return [error, response]
	},
	async resetPassword({ commit }, payload) {
		const [error, response] = await AuthApi.resetPassword(payload)

		console.log('reset-password:: res', response)
		console.log('reset-password:: err', error)
		return [error, response]
	},
	async registration({ commit }, payload) {
		console.log('Store registration start')
		const [error, response] = await AuthApi.registration(payload)

		if (!error) {
			commit('SET_TOKEN', response.token)
		}
		return [error, response]
	},
	async logout({ commit }) {
		const [error, response] = await AuthApi.logout()

		// if (!error) {
		commit('RE_SET_TOKEN')
		commit('RE_SET_CURRENT_USER')
		// }
		return [error, response]
	},
	async authUser({ commit }) {
		const [error, response] = await AuthApi.authUser()

		if (!error) {
			commit('SET_CURRENT_USER', response.user)
		}
		return [error, response]
	},
	async passwordForgot(_, payload) {
		const [error, response] = await AuthApi.forgotPassword(payload)

		return [error, response]
	},
	async tokenCheck({ commit }, token) {
		const [error, response] = await AuthApi.tokenCheck(token)
		return [error, response]
	},
	async emailVerify({ commit }, token) {
		const [error, response] = await AuthApi.emailVerify(token)
		if (!error) {
			commit('SET_TOKEN', response.token)
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
