<template>
	<div class="tw-border-b-2 tw-flex tw-items-center tw-justify-between">
		<label class="tw-flex-1">{{ label }}</label>
		<slot
			:on="$listeners"
			:attrs="{
				...$attrs,
			}"
		/>
	</div>
</template>

<script>
export default {
	name: 'BaseCalculationInput',
	props: {
		label: {
			type: String,
			default: '',
		},
	},

	data() {
		return {}
	},

	mounted() {},

	methods: {},
}
</script>
