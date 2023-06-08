import '@/assets/css/tailwind.css'

import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import get from 'lodash/get'
import round from 'lodash/round'
import truncate from 'lodash/truncate'
import omit from 'lodash/omit'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import Quill from 'quill'

import { vuetify } from '@/plugins/vuetify'
import { createI18n, hotUpdateLocale } from '@/plugins/vue-i18n'
import Vuetify from 'vuetify/lib'

window.Quill = Quill

Vue.prototype._ = {
	get,
	round,
	truncate,
	omit,
}

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueApexCharts)

Vue.component('ApexChart', VueApexCharts)

const createApp = async () => {
	const app = new Vue({
		store,
		router,
		vuetify,
		i18n: await createI18n(),
		render: (h) => h(App),
	})

	app.$mount('#app')
}

createApp()
hotUpdateLocale()
