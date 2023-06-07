<template>
	<div class="user-calculation admin-user-management">
		<div>
			<base-button add @click="addUserDialog = true">
				<v-icon>mdi-plus</v-icon>
				<span class="tw-text-sm tw-font-normal">{{
					$t('create-user')
				}}</span>
			</base-button>
			<div class="tw-mt-3">
				<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
				<base-data-table
					v-if="!initialLoader"
					:page="page"
					:items="allUsers"
					:headers="headers"
					:total-visible="totalVisible"
					@paginate="onRefresh"
				>
					<template v-slot:[`item.number`]="{ index }">{{
						index + 1
					}}</template>
					<template v-slot:[`item.companyName`]="{ item }">
						{{ _.get(item, 'company.name', '-') }}
					</template>
					<template v-slot:[`item.status`]="{ item }">
						<div class="tw-flex">
							<v-btn
								dark
								small
								rounded
								depressed
								:loading="item.id == loadingId"
								:color="item.status === 'inactive' ? 'red' : 'green'"
								@click="changeStatus(item)"
								>{{ item.status }}</v-btn
							>
						</div>
					</template>
					<template v-slot:[`item.actions`]="{ item }">
						<div class="tw-flex">
							<v-btn color="orange" text small @click="manageUser(item)">
								{{ $t('management') }}</v-btn
							>
							<v-btn color="primary" text small @click="editData(item)">
								{{ $t('edit') }}</v-btn
							>
							<v-btn color="red" text small @click="deleteData(item)">{{
								$t('delete')
							}}</v-btn>
						</div>
					</template>
					<template v-slot:[`item.calculationResults`]="{ item }">
						<v-btn color="purple" text small @click="checkData(item)">{{
							$t('check')
						}}</v-btn>
					</template>
				</base-data-table>
			</div>
		</div>
		<!-- #ff0000 WORKING  -->
		<v-dialog v-model="dialogManageUser" width="1080" persistent scrollable>
			<user-management-company-users
				single-company
				close-btn
				:item="item"
				@close="refreshUser"
			/>
			<!-- :companyId="company_id" -->
		</v-dialog>
		<!-- add new user -->
		<v-dialog v-model="addUserDialog" width="700" persistent scrollable>
			<base-user-form
				:company-details="companyDetails"
				@cancel="addUserDialog = false"
			/>
		</v-dialog>
		<!-- edit user -->
		<v-dialog v-model="editUserDialog" width="700" persistent scrollable>
			<base-user-form
				admin
				edit
				:item="editItem"
				@cancel="editUserDialog = false"
			/>
		</v-dialog>
		<!-- delete user -->
		<v-dialog v-model="deleteUserDialog" width="700" persistent scrollable>
			<base-delete-card
				@cancel="closeDeleteDialog"
				@deleteConfirm="confirmDeleteItem"
			/>
		</v-dialog>
		<!-- check user -->
		<v-dialog v-model="userEventDialog" width="1080" persistent scrollable>
			<user-calculation
				confirm
				:user-id="user_id"
				@close="userEventDialog = false"
			/>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserCalculation from '../User/UserCalculation.vue'

export default {
	name: 'AdminUserManagement',
	components: { UserCalculation },

	data() {
		return {
			initialLoader: true,

			page: 1,
			totalVisible: 10,
			dialogManageUser: false,
			addUserDialog: false,
			loadingId: null,
			user_id: null,
			company_id: null,
			item: {},
			singleCompanyUsersDate: {},
			editItem: {},
			deleteItem: {},
			editUserDialog: false,
			deleteUserDialog: false,
			userEventDialog: false,
		}
	},
	computed: {
		...mapGetters(['allUsers', 'currentUser']),
		companyDetails() {
			return {
				...this.currentUser.company,
			}
		},
		headers() {
			return [
				{
					text: this.$t('number'),
					value: 'number',
				},
				{
					text: this.$t('company-name'),
					value: 'companyName',
				},
				{ text: this.$t('name'), value: 'name' },
				{ text: this.$t('phone-number'), value: 'phone' },
				{ text: this.$t('email'), value: 'email' },
				{ text: this.$t('event-period'), value: 'event_date' },
				{
					text: this.$t('number-of-event-participants'),
					value: 'no_of_event_attendance',
				},
				{
					text: this.$t('usage-status'),
					value: 'status',
				},
				{
					value: 'actions',
				},
				{
					text: this.$t('calculation-results'),
					value: 'calculationResults',
				},
			]
		},
	},
	methods: {
		...mapActions(['deleteUser', 'fetchAllUsers', 'updateUserStatus']),

		checkData(item) {
			this.user_id = item.id
			this.userEventDialog = true
			console.log('checkData', this.user_id)
		},
		async refreshUser() {
			await this.fetchAllUsers({
				per_page: this.totalVisible,
			})
			this.item = {}
			this.dialogManageUser = false
		},
		async changeStatus(item) {
			this.loadingId = item.id
			const data = {
				id: item.id,
				status: item.status === 'active' ? 'inactive' : 'active',
			}
			const [err, res] = await this.updateUserStatus(data)
			this.loadingId = null
		},
		onRefresh(page) {
			this.fetchAllUsers({
				page,
				per_page: this.totalVisible,
			})
		},
		manageUser(item) {
			console.log('AdminUserManagement::methods::manageUser::item::', item)
			this.item = { ...item }
			// this.company_id = item.company_id
			this.dialogManageUser = true
		},
		deleteData(item) {
			this.deleteItem = { ...item }
			this.deleteUserDialog = true
		},
		confirmDeleteItem() {
			this.deleteUser(this.deleteItem)
			this.deleteItem = {}
			this.deleteUserDialog = false
		},

		closeDeleteDialog() {
			this.deleteItem = {}
			this.deleteUserDialog = false
		},

		editData(item) {
			this.editItem = { ...item }
			this.editUserDialog = true
		},
	},
	async mounted() {
		// console.log(
		// 	'AdminUserManagement::mounted::currentUser::',
		// 	this.currentUser
		// )
		await this.fetchAllUsers({
			per_page: this.totalVisible,
		})
		this.initialLoader = false
	},
}
</script>
<style lang="scss">
.admin-user-management {
	.v-btn__content {
		font-size: 8px !important;
	}
	tbody tr td {
		color: #000 !important;
		// border: none !important;
		border: 3px solid white !important;
		font-size: 13px !important;
	}
}
</style>
