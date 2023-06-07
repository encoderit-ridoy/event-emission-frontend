import { api } from '@/axios'

const OthersApi = {
	async index(params) {
		const [error, response] = await api.get('/other-activities/index', {
			params,
		})
		return [error, response]
	},
	async create(data) {
		const [error, response] = await api.post('/other-activities/store', data)
		return [error, response]
	},
	async update(data) {
		const [error, response] = await api.patch(
			'/other-activities/update',
			data
		)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(
			`/other-activities/delete/${id}`
		)
		return [error, response]
	},
}
export { OthersApi }
