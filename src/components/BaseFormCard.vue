<template>
	<v-card flat class="base-form-card !tw-rounded-none">
		<v-card-title>
			<slot name="heading" />
		</v-card-title>

		<v-card-text class="tw-p-0">
			<slot></slot>
		</v-card-text>
		<v-card-actions class="tw-p-0">
			<slot name="actions"></slot>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: 'BaseFormCard',
	props: {
		title: {
			type: String,
			default: '',
		},
	},
}
</script>
