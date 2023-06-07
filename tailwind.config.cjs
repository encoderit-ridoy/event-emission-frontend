/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	prefix: 'tw-',

	theme: {
		extend: {
			colors: {
				custom_yellow: '#ffbe5c',
				custom_dark_yellow: '#ae813d',
				custom_blue: '#0081C9',
			},
		},
	},
	plugins: [],
}
