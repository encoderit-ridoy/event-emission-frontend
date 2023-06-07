<template>
	<v-select
		v-model="other"
		solo
		flat
		dense
		hide-details
		return-object
		:label="$t('other-activities')"
		item-text="meeting_room"
		:items="others"
	></v-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseOtherParams',

	data() {
		return {
			other: {},
			others: [],
		}
	},
	computed: {
		...mapGetters(['allOthersParams']),
	},
	async mounted() {
		const [err, res] = await this.fetchOthersParams()
		console.log(this.allOthersParams.data)
		if (!err) {
			this.others = [...this.allOthersParams.data]
		}
	},

	methods: {
		...mapActions(['fetchOthersParams']),
	},
	watch: {
		other: {
			handler(v) {
				this.$emit('changeOthers', v)
			},
		},
	},
}
</script>
