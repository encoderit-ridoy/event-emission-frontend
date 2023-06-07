<template>
	<v-select
		v-model="transportation"
		solo
		flat
		dense
		hide-details
		return-object
		:label="$t('transport_emissions')"
		item-text="transporation_way"
		:items="transportations"
	></v-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseMeetingRoomParams',

	data() {
		return {
			transportation: {},
			transportations: [],
		}
	},
	computed: {
		...mapGetters(['allTransportationParams']),
	},
	async mounted() {
		const [err, res] = await this.fetchTransportationParams()
		console.log(this.allTransportationParams.data)
		if (!err) {
			this.transportations = [...this.allTransportationParams.data]
		}
	},

	methods: {
		...mapActions(['fetchTransportationParams']),
	},
	watch: {
		transportation: {
			handler(v) {
				this.$emit('changeTransportation', v)
			},
		},
	},
}
</script>
