import Vue from 'vue'
import VueI18n from 'vue-i18n'

let i18n
let messages = {}

Vue.use(VueI18n)

// Load all locales and remember context
const loadMessages = async () => {
	const modules = import.meta.glob('../locales/*.json')
	messages = (
		await Promise.all(
			Object.keys(modules).map(async (path) => ({
				locale: path
					.split('/')
					.pop()
					.match(/[a-z0-9-_]+/i)[0],
				messages: (await modules[path]()).default,
			}))
		)
	).reduce(
		(accumulator, item) => ({
			...accumulator,
			[item.locale]: item.messages,
		}),
		{}
	)
	return messages
}

export const createI18n = async () => {
	i18n = new VueI18n({
		locale: 'ja',
		messages: await loadMessages(),
	})
	return i18n
}

// Load hot updater
export const hotUpdateLocale = () => {
	if (import.meta.hot) {
		import.meta.hot.accept(async () => {
			const newMessages = await loadMessages()
			Object.keys(newMessages)
				.filter((locale) => messages[locale] !== newMessages[locale])
				.forEach((locale) => {
					messages[locale] = newMessages[locale]
					i18n.setLocaleMessage(locale, messages[locale])
				})
		})
	}
}
