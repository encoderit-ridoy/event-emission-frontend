import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth.store'
import meetingRoom from './modules/meetingRoom.store'
import transportation from './modules/transportation.store'
import onlineMeeting from './modules/onlineMeeting.store'
import others from './modules/others.store'
import user from './modules/user.store'
import manual from './modules/manual.store'
import event from './modules/event.store'
import dashboard from './modules/dashboard.store'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		auth,
		meetingRoom,
		transportation,
		onlineMeeting,
		others,
		user,
		manual,
		event,
		dashboard,
	},
	plugins: [
		createLogger(), // console log all mutations
		createPersistedState({
			key: 'event-emission',
			paths: ['auth'],
		}), // save to the localStorage
	],
})
