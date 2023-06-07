<template>
	<v-btn
		v-bind="$attrs"
		depressed
		class="base-button !tw-rounded-none"
		:outlined="add"
		:class="{
			' !tw-bg-[#ffbe5c] !tw-border-[2px] !tw-border-[#ae813d]':
				login || logout || registration,
			' !tw-border-[#0081C9]': add,
		}"
		@click="$emit('click', $event)"
	>
		<div
			class="tw-font-semibold tw-text-[12px] tw-text-black tw-capitalize tw-flex tw-items-center tw-justify-center tw-gap-2"
		>
			<slot />
		</div>
	</v-btn>
</template>
<script>
export default {
	name: 'BaseButton',
	props: {
		login: {
			type: Boolean,
			default: false,
		},
		logout: {
			type: Boolean,
			default: false,
		},
		registration: {
			type: Boolean,
			default: false,
		},
		add: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
<style lang="scss">
.base-button {
	border: 1px solid black;
}
</style>
