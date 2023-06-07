import Vue from 'vue'
import Vuetify from 'vuetify'
import ja from 'vuetify/lib/locale/ja'

Vue.use(Vuetify)

const vuetify = new Vuetify({
	icons: {
		iconfont: 'mdi',
	},
	lang: {
		locales: { ja },
		current: 'ja',
	},
})

export { vuetify }
export default vuetify
