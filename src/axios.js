import axios from 'axios'
import { SERVER_BASE_URL } from './consts'
import store from './store'

const Axios = axios.create({
	baseURL: `${SERVER_BASE_URL}/api`,
})
Axios.interceptors.request.use((config) => {
	const { token } = store.getters
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

const api = {
	//! GET
	async get(url, config) {
		try {
			const response = await Axios.get(url, config)
			return [false, response?.data, response]
		} catch (error) {
			return [error]
		}
	},

	//! POST
	async post(url, data, config) {
		try {
			const response = await Axios.post(url, data, config)
			return [false, response?.data, response]
		} catch (error) {
			return [error]
		}
	},
	//! PATCH
	async patch(url, data, config) {
		try {
			const response = await Axios.patch(url, data, config)
			return [false, response?.data, response]
		} catch (error) {
			return [error]
		}
	},

	//! DELETE
	async delete(url, config) {
		try {
			const response = await Axios.delete(url, config)
			return [false, response?.data, response]
		} catch (error) {
			return [error]
		}
	},
}
export { api, Axios }
