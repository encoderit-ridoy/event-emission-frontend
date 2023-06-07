/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return defineConfig({
		base: env.VITE_BASE_URL,
		plugins: [
			vue(),
			Components({
				dts: true,
				directives: false,
				resolvers: [VuetifyResolver()],
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'~': fileURLToPath(new URL('./node_modules', import.meta.url)),
			},
		},
	})
}
