import { api } from '@/axios'

const TransportationApi = {
	async index(params) {
		const [error, response] = await api.get('/transportation/index', {
			params,
		})
		return [error, response]
	},
	async create(data) {
		const [error, response] = await api.post('/transportation/store', data)
		return [error, response]
	},
	async update(data) {
		const [error, response] = await api.patch('/transportation/update', data)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(`/transportation/delete/${id}`)
		return [error, response]
	},
}
export { TransportationApi }
