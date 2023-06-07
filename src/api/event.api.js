import { api } from '@/axios'

const EventApi = {
	index(params) {
		return api.get('/event/index', { params })
	},
	show(id) {
		return api.get(`/event/show/${id}`)
	},
	create(data) {
		return api.post('/event/store', data)
	},
	async update(data) {
		const [error, response] = await api.patch('/event/update', data)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(`/event/delete/${id}`)
		return [error, response]
	},
}

export { EventApi }
