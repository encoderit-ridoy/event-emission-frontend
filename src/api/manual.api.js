import { api } from '@/axios'

const ManualApi = {
	index(params) {
		return api.get('/content/index', params)
	},
	create(data) {
		return api.post('/content/store', data)
	},
	update(data) {
		return api.patch('/content/update', data)
	},
}

export { ManualApi }
