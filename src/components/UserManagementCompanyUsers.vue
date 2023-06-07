<template>
	<v-card color="#f4f0ea" flat>
		<v-card-title>
			<base-button add @click="addUserDialog = true">
				<v-icon>mdi-plus</v-icon>
				<span class="tw-text-sm tw-font-normal">{{ $t('add-user') }}</span>
			</base-button>
			<v-spacer />
			<v-icon v-if="closeBtn" @click="$emit('close')">mdi-close</v-icon>
		</v-card-title>
		<v-card-text>
			<div>
				<div class="tw-mt-3">
					<base-data-table
						:page="page"
						:headers="headers"
						:items="singleCompanyUsers"
						:total-visible="totalVisible"
						@paginate="onRefresh"
					>
						<template v-slot:[`item.number`]="{ index }">
							{{ index + 1 }}
						</template>
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
		</v-card-text>
		<!-- add new user -->
		<v-dialog v-model="addUserDialog" width="700" persistent scrollable>
			<base-user-form
				single-company
				:company-details="companyDetails"
				@cancel="addUserDialog = false"
			/>
			<!-- created-by-admin
				:item="item" -->
		</v-dialog>
		<!-- edit user -->
		<v-dialog v-model="editUserDialog" width="700" persistent scrollable>
			<base-user-form
				single-company
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
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'UserManagementCompanyUsers',
	props: {
		item: {
			type: Object,
			default: () => {},
		},
		singleCompanyUsersDate: {
			type: Object,
			default: () => {},
		},
		companyId: {
			type: [Number, String],
			default: '',
		},
		closeBtn: {
			type: Boolean,
			default: false,
		},
		singleCompany: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			page: 1,
			totalVisible: 10,
			editItem: {},
			deleteItem: {},
			companyDetails: {},
			addUserDialog: false,
			editUserDialog: false,
			deleteUserDialog: false,
		}
	},
	computed: {
		...mapGetters(['currentUser', 'allUsers', 'singleCompanyUsers']),

		headers() {
			return [
				{
					text: this.$t('number'),
					value: 'number',
				},

				{ text: this.$t('name'), value: 'name' },

				{ text: this.$t('email'), value: 'email' },
				{ value: 'actions' },
			]
		},
	},
	methods: {
		...mapActions(['deleteUser', 'fetchAllUsers']),

		deleteData(item) {
			this.deleteItem = { ...item, single_company: this.singleCompany }
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
		onRefresh(page) {
			this.fetchAllUsers({
				page,
				per_page: this.totalVisible,
				single_company: this.singleCompany,
				company_id:
					this?.item?.company?.id || this?.currentUser?.company.id,
			})
		},
		editData(item) {
			this.editItem = { ...item, single_company: this.singleCompany }
			this.editUserDialog = true
		},
	},

	watch: {
		item: {
			immediate: true,
			deep: true,
			async handler(v) {
				if (v) {
					await this.fetchAllUsers({
						single_company: this.singleCompany,
						company_id: v.company_id,
					})
					this.companyDetails = v.company
				} else {
					await this.fetchAllUsers({
						single_company: this.singleCompany,
						company_id: this.currentUser.company.id,
					})
					this.companyDetails = this.currentUser.company
				}
			},
		},
	},
}
</script>
