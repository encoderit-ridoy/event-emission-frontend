import { api } from '@/axios'

const DashboardApi = {
	index(params) {
		return api.get('/dashboard/total-emissions', params)
	},
	indexSpecific(params) {
		return api.get('/dashboard/events-data', params)
	},
}

export { DashboardApi }
