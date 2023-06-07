import { api } from '@/axios'

const UserApi = {
	async index(params) {
		const [error, response] = await api.get('/users/index', { params })
		return [error, response]
	},
	async create(data) {
		const [error, response] = await api.post('/users/store', data)
		return [error, response]
	},
	async status(data) {
		const [error, response] = await api.post('/users/change-status', data)
		return [error, response]
	},
	async update(data) {
		const [error, response] = await api.patch('/users/update', data)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(`/users/delete/${id}`)
		return [error, response]
	},
}
export { UserApi }
