<template>
	<v-card>
		<v-card-title>{{ $t('are-you-sure') }}</v-card-title>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="info" text @click="$emit('cancel')">
				{{ $t('cancel') }}
			</v-btn>
			<v-btn color="error" @click="$emit('deleteConfirm')">
				{{ $t('delete') }}</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: 'BaseDeleteCard',

	data() {
		return {}
	},

	mounted() {},

	methods: {},
}
</script>
