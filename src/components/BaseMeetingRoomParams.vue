<template>
	<v-select
		v-model="meetingRoom"
		solo
		flat
		dense
		hide-details
		return-object
		item-text="meeting_room"
		:items="meetingRooms"
		:label="$t('meeting-room')"
	></v-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseMeetingRoomParams',

	data() {
		return {
			meetingRoom: {},
			meetingRooms: [],
		}
	},
	computed: {
		...mapGetters(['allMeetingRoomParams']),
	},
	async mounted() {
		const [err, res] = await this.fetchMeetingRoomParams()
		console.log(this.allMeetingRoomParams.data)
		if (!err) {
			this.meetingRooms = [...this.allMeetingRoomParams.data]
		}
	},

	methods: {
		...mapActions(['fetchMeetingRoomParams']),
	},
	watch: {
		meetingRoom: {
			handler(v) {
				this.$emit('changeMeetingRoom', v)
			},
		},
	},
}
</script>
