<template>
	<v-select
		v-model="onlineMeeting"
		solo
		flat
		dense
		hide-details
		return-object
		:label="$t('online-meeting')"
		item-text="item"
		:items="onlineMeetings"
	></v-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseOnlineMeetingParams',

	data() {
		return {
			onlineMeeting: {},
			onlineMeetings: [],
		}
	},
	computed: {
		...mapGetters(['allOnlineMeetingParams']),
	},
	async mounted() {
		const [err, res] = await this.fetchOnlineMeetingParams()
		console.log(this.allOnlineMeetingParams.data)
		if (!err) {
			this.onlineMeetings = [...this.allOnlineMeetingParams.data]
		}
	},

	methods: {
		...mapActions(['fetchOnlineMeetingParams']),
	},
	watch: {
		onlineMeeting: {
			handler(v) {
				this.$emit('changeOnlineMeeting', v)
			},
		},
	},
}
</script>
