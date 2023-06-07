module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:vue/essential',
		'plugin:vuetify/base',
		'airbnb-base',
		'prettier',
		'@vue/eslint-config-prettier',
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['vue', 'prettier'],
	rules: {
		'no-param-reassign': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'prettier/prettier': [
			'error',
			{
				semi: false,
				singleQuote: true,
				trailingComma: 'es5',
				endOfLine: 'auto',
				useTabs: true,
				tabWidth: 3,
			},
		],
		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',
		'import/no-import-module-exports': 'off',
		'import/prefer-default-export': 'off',
		'no-shadow': 'off',
		'no-unused-vars': 'off',
		'no-console': 'off',
		'no-useless-return': 'off',
		'no-irregular-whitespace': 'off',
		'prefer-destructuring': 'off',
		'new-cap': 'off',
		'prefer-template': 'off',
		'import/order': 'off',
		'no-extraneous-dependencies': 'off',
	},
}