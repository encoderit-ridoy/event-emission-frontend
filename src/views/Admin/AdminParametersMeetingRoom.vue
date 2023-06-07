<template>
	<div class="user-calculation">
		<div>
			<base-button add @click="dialogCreateNewParam = true">
				<v-icon>mdi-plus</v-icon>
				<span class="tw-text-sm tw-font-normal">{{
					$t('create-parameters')
				}}</span>
			</base-button>
			<div class="tw-mt-3">
				<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
				<base-data-table
					v-if="!initialLoader"
					hide-pagination
					:headers="headers"
					:items="allMeetingRoomParams"
					:page="page"
				>
					<template v-slot:[`item.number`]="{ index }">{{
						index + 1
					}}</template>
					<template v-slot:[`item.actions`]="{ item }">
						<v-btn color="primary" text @click="editData(item)">
							{{ $t('edit') }}</v-btn
						>
						<v-btn color="red" text @click="deleteData(item)">{{
							$t('delete')
						}}</v-btn>
					</template>
				</base-data-table>
			</div>
		</div>
		<!-- create new parameters -->
		<v-dialog
			v-model="dialogCreateNewParam"
			width="700"
			persistent
			scrollable
		>
			<meeting-room-params-form @cancel="dialogCreateNewParam = false" />
		</v-dialog>
		<!-- edit parameters -->
		<v-dialog v-model="dialogEditParam" width="700" persistent scrollable>
			<meeting-room-params-form
				@cancel="closeEditDialog"
				:item="editItem"
				edit
			/>
		</v-dialog>
		<!-- delete parameters -->
		<v-dialog v-model="dialogDeleteParam" width="700" persistent scrollable>
			<base-delete-card
				@cancel="closeDeleteDialog"
				@deleteConfirm="confirmDeleteItem"
			/>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'AdminParametersMeetingRoom',

	data() {
		return {
			initialLoader: true,
			dialogCreateNewParam: false,
			dialogEditParam: false,
			dialogDeleteParam: false,
			page: 1,
			totalVisible: 10,
			editItem: {},
			deleteItem: {},
		}
	},
	computed: {
		...mapGetters(['allMeetingRoomParams']),
		headers() {
			return [
				{
					text: this.$t('number'),
					value: 'number',
				},
				{
					text: this.$t('meeting'),
					value: 'meeting_room',
				},
				{
					text: this.$t('basic-unit-of-electricity-at-the-venue'),
					value: 'electicity_parameter',
				},

				{ text: this.$t('units'), value: 'unit' },
				{ value: 'actions' },
			]
		},
	},
	methods: {
		...mapActions(['fetchMeetingRoomParams', 'deleteMeetingRoomParams']),

		editData(item) {
			this.editItem = { ...item }
			this.dialogEditParam = true
		},
		deleteData(item) {
			this.deleteItem = { ...item }
			this.dialogDeleteParam = true
		},
		confirmDeleteItem() {
			this.deleteMeetingRoomParams(this.deleteItem)
			this.deleteItem = {}
			this.dialogDeleteParam = false
		},
		closeDeleteDialog() {
			this.deleteItem = {}
			this.dialogDeleteParam = false
		},
		closeEditDialog() {
			this.editItem = {}
			this.dialogEditParam = false
		},
	},
	async mounted() {
		await this.fetchMeetingRoomParams()
		this.initialLoader = false
	},
}
</script>
