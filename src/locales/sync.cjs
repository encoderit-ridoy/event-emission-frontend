const fs = require('fs')
const path = require('path')
const { set, get, isArray, isPlainObject } = require('lodash')

const enJson = require('./en.json')
const targetJson1 = require('./ja.json')

const output = {}

const travel = (value, key) => {
	// Recursive call for nested arrays
	if (isArray(value)) {
		value.forEach((v, index) => {
			travel(v, key ? `${key}.${index}` : index)
		})
		return
	}
	// Recursive call for nested objects
	if (isPlainObject(value)) {
		Object.entries(value).forEach(([p, v]) => {
			travel(v, key ? `${key}.${p}` : p)
		})
		return
	}

	const targetValue = get(targetJson1, key)
	set(output, key, targetValue || value)
}

travel(enJson)

try {
	fs.mkdirSync(path.resolve(__dirname, './backups'))
} catch (_error) {
	//
}
fs.writeFileSync(
	path.resolve(__dirname, './backups/ja.json'),
	JSON.stringify(targetJson1, null, 3)
)

fs.writeFileSync(
	path.resolve(__dirname, './ja.json'),
	JSON.stringify(output, null, 3)
)
