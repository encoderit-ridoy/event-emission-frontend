import { api } from '@/axios'

const OnlineMeetingApi = {
	async index(params) {
		const [error, response] = await api.get('/online-meeting/index', {
			params,
		})
		return [error, response]
	},
	async create(data) {
		const [error, response] = await api.post('/online-meeting/store', data)
		return [error, response]
	},
	async update(data) {
		const [error, response] = await api.patch('/online-meeting/update', data)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(`/online-meeting/delete/${id}`)
		return [error, response]
	},
}
export { OnlineMeetingApi }
