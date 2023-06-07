import { api } from '@/axios'

const AuthApi = {
	login(data) {
		return api.post('/login', data)
	},

	logout() {
		return api.get('/logout')
	},
	resetPassword(data) {
		return api.post('/password/reset', data)
	},
	forgotPassword(data) {
		return api.post('/password/forgot', data)
	},
	tokenCheck(token) {
		return api.post('/password/token/varify', { token })
	},
	emailVerify(token) {
		return api.get('/email-varify', { params: { token } })
	},
	registration(data) {
		return api.post('/register', data)
	},
	authUser() {
		return api.get('/auth-user')
	},
}

export { AuthApi }
