module.exports = {
	apps: [
		{
			name: 'vue-app',
			script: 'server.js', // Replace with the entry point script of your Vue.js app
			cwd: './dist',
			instances: 'max',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'production',
				PORT: 8080, // Replace with the desired port number
			},
		},
	],
}
