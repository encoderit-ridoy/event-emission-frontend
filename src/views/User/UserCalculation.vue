<template>
	<v-card class="user-calculation" color="#f4f0ea" flat>
		<v-card-title>
			<base-button v-if="!userId" add @click="dialogNewCalculation = true">
				<v-icon>mdi-plus</v-icon>
				<span class="tw-text-sm tw-font-normal">{{
					$t('create-new-event')
				}}</span>
			</base-button>
			<v-spacer />
			<v-icon v-if="userId" @click="$emit('close')">mdi-close</v-icon>
		</v-card-title>
		<v-card-text>
			<div class="tw-mt-3">
				<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
				<base-data-table
					v-if="!initialLoader && !isEmptyData"
					header-color="#ffc000"
					odd-cell-color="#ffe8cc"
					even-cell-color="#fff4e7"
					:page="page"
					:items="allEvents"
					:headers="headers"
					:total-visible="totalVisible"
					@paginate="onRefresh"
				>
					<template v-slot:[`item.people_in_charge`]="{ item }">
						<!-- {{ convertToLocaleString(+item.people_in_charge) }} -->
						{{ item.people_in_charge }}
					</template>
					<template v-slot:[`item.actions`]="{ item }">
						<v-btn
							v-if="confirm"
							color="primary"
							text
							@click="confirmData(item)"
							>confirm</v-btn
						>
						<div v-if="!userId">
							<v-btn color="primary" text @click="editData(item)">
								{{ $t('edit') }}</v-btn
							>
							<v-btn color="red" text @click="deleteData(item)">{{
								$t('delete')
							}}</v-btn>
						</div>
					</template>
				</base-data-table>
			</div>
		</v-card-text>
		<!-- create parameters -->
		<v-dialog
			v-model="dialogNewCalculation"
			width="1500"
			persistent
			scrollable
		>
			<user-calculation-new @close="dialogNewCalculation = false" />
		</v-dialog>
		<!-- edit parameters -->
		<v-dialog v-model="dialogEditParam" width="1500" persistent scrollable>
			<user-calculation-new @close="closeEditDialog" :item="editItem" edit />
		</v-dialog>
		<!-- confirm data-->
		<v-dialog v-model="dialogConfirmData" width="1200" persistent scrollable>
			<user-calculation-new
				read-only
				:item="editItem"
				@close="closeEditDialog"
			/>
		</v-dialog>
		<!-- delete parameters -->
		<v-dialog v-model="dialogDeleteParam" width="700" persistent scrollable>
			<base-delete-card
				@cancel="closeDeleteDialog"
				@deleteConfirm="confirmDeleteItem"
			/>
		</v-dialog>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { convertToLocaleString } from '@/helpers'

export default {
	name: 'UserCalculation',
	props: {
		userId: {
			type: [Number, String],
			default: '',
		},
		confirm: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			page: 1,
			totalVisible: 10,
			isEmptyData: true,
			initialLoader: true,
			dialogNewCalculation: false,
			dialogDeleteParam: false,
			dialogEditParam: false,
			dialogConfirmData: false,
			editItem: {},
			deleteItem: {},
			currentUserId: '',
		}
	},
	computed: {
		...mapGetters(['currentUser', 'allEvents']),

		headers() {
			return [
				{
					text: this.$t('event-name'),
					value: 'name',
				},
				{
					text: this.$t('event-holder'),
					value: 'event_holder',
				},
				{ text: this.$t('event-starting-date'), value: 'starting_date' },
				{ text: this.$t('event-end-date'), value: 'end_date' },
				{ text: this.$t('people-in-charge'), value: 'people_in_charge' },
				{ value: 'actions' },
			]
		},
	},
	methods: {
		...mapActions(['fetchEvents', 'showEvent', 'deleteEvent']),
		convertToLocaleString,

		async confirmData(item) {
			const [err, res] = await this.showEvent(item.id)

			this.editItem = { ...res }
			this.dialogConfirmData = true
		},
		closeEditDialog() {
			this.editItem = {}
			this.dialogEditParam = false
			this.dialogConfirmData = false
		},
		async editData(item) {
			const [err, res] = await this.showEvent(item.id)

			console.log('showEvent::res', res)
			this.editItem = { ...res }
			this.dialogEditParam = true
		},
		deleteData(item) {
			this.deleteItem = { ...item }
			this.dialogDeleteParam = true
		},
		confirmDeleteItem() {
			this.deleteEvent(this.deleteItem)
			this.deleteItem = {}
			this.dialogDeleteParam = false
		},
		closeDeleteDialog() {
			this.deleteItem = {}
			this.dialogDeleteParam = false
		},
		async onRefresh(page) {
			const [err, res] = await this.fetchEvents({
				page,
				per_page: this.totalVisible,
				user_id: this.userId || this.currentUser.id,
			})
		},
	},
	watch: {
		allEvents: {
			deep: true,
			immediate: true,
			handler(v) {
				console.log('allEvents::handler::v', v)
				if (v?.data?.length > 0) {
					this.isEmptyData = false
				} else {
					this.isEmptyData = true
				}
			},
		},
		userId: {
			immediate: true,
			async handler(v) {
				if (v) {
					this.currentUserId = this.userId
					const [err, res] = await this.fetchEvents({
						user_id: this.userId,
					})
					if (res.events.data.length > 0) {
						this.isEmptyData = false
					}
				} else {
					this.currentUserId = this.currentUser.id

					const [err, res] = await this.fetchEvents({
						user_id: this.currentUser.id,
					})
					if (res.events.data.length > 0) {
						this.isEmptyData = false
					}
				}
				this.initialLoader = false
			},
		},
	},
}
</script>
