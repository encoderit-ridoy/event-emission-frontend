import { DashboardApi } from '@/api'

const state = {
	dashboard: {
		total_event: 0,
		average_emissions: 0,
	},
	specificBarChartData: {},
	specificPieChartData: {},
}

const getters = {
	dashboard: (state) => state.dashboard,
	specificBarChartData: (state) => state.specificBarChartData,
	specificPieChartData: (state) => state.specificPieChartData,
}

const mutations = {
	SET_DASHBOARD(state, payload) {
		state.dashboard = payload
	},
	SET_SPECIFIC_BAR_CHART_DATA(state, payload) {
		state.specificBarChartData = payload
	},
	SET_SPECIFIC_PIE_CHART_DATA(state, payload) {
		state.specificPieChartData = payload
	},
}

const actions = {
	async fetchDashboardData({ commit }, params = {}) {
		const [error, response] = await DashboardApi.index(params)
		if (!error) {
			commit('SET_DASHBOARD', response)
		}
		return [error, response]
	},
	async fetchSpecificData({ commit }, params = {}) {
		const [error, response] = await DashboardApi.indexSpecific({
			params: {
				ids: params.ids,
			},
		})
		if (!error) {
			if (params.type === 'bar') {
				commit('SET_SPECIFIC_BAR_CHART_DATA', response)
			} else if (params.type === 'pie') {
				commit('SET_SPECIFIC_PIE_CHART_DATA', response)
			}
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
