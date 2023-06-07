import round from 'lodash/round'

export const env = (key = '', fallback = '', prefix = 'VITE_') => {
	let keyWithoutPrefix = key

	if (!key.startsWith(prefix)) {
		keyWithoutPrefix = key
		key = prefix + key
	} else {
		keyWithoutPrefix = key.replace(prefix, '')
	}

	return import.meta.env[key] || import.meta.env[keyWithoutPrefix] || fallback
}

export const createPagination = (v = {}) => {
	return {
		data: v?.data || [],
		total: v?.total ?? 0,
		page: v?.page ?? 1,
		perPage: v?.perPage ?? 6,
		currentPage: v?.currentPage ?? 1,
		isLoading: v?.isLoading ?? true,
		isLoaded: v?.isLoaded ?? false,
		isRefetching: v?.isRefetching ?? false,
	}
}
export const currentDate = (v) => {
	const date = new Date()
	const currentDay = String(date.getDate()).padStart(2, '0')
	const currentMonth = String(date.getMonth() + 1).padStart(2, '0')
	const currentYear = date.getFullYear()
	return `${currentYear}-${currentMonth}-${currentDay}`
}
export const convertToLocaleString = (v) => {
	return v.toLocaleString()
}
export const barChartOptionsHelper = (
	v = {
		isDistributed: false,
	}
) => {
	return {
		chart: {
			type: 'bar',
			height: 350,
			stacked: true,
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: true,
			},
		},

		colors: v?.isDistributed
			? ['#ffe89e', '#ffc400', '#c39500', '#856600']
			: ['#ffe89e', '#c39500', '#856600', '#ffc400'],

		dataLabels: {
			enabled: false,
			formatter: (val) => {
				return round(val, 1)
			},
		},

		legend: {
			show: true,
			position: 'top',
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					legend: {
						position: 'bottom',
						offsetX: -10,
						offsetY: 0,
					},
				},
			},
		],
		plotOptions: {
			bar: {
				distributed: v?.isDistributed,
				horizontal: false,
				borderRadius: 0,
				dataLabels: {
					formatter: (val) => {
						return round(val, 1)
					},
					total: {
						enabled: true,
						style: {
							fontSize: '13px',
							fontWeight: 900,
						},
					},
				},
			},
		},
		xaxis: {
			categories: v?.categories,
			labels: {
				show: true,
				rotate: 0,
			},
		},
		yaxis: {
			labels: {
				show: true,
				rotate: 0,

				formatter: (val) => {
					return round(val, 1)
				},
			},
		},

		fill: {
			opacity: 1,
		},
	}
}
