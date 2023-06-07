import { api } from '@/axios'

const MeetingRoomApi = {
	async index(params) {
		const [error, response] = await api.get('/meeting-room/index', { params })
		return [error, response]
	},
	async create(data) {
		const [error, response] = await api.post('/meeting-room/store', data)
		return [error, response]
	},
	async update(data) {
		const [error, response] = await api.patch('/meeting-room/update', data)
		return [error, response]
	},
	async delete(id) {
		const [error, response] = await api.delete(`/meeting-room/delete/${id}`)
		return [error, response]
	},
}
export { MeetingRoomApi }
