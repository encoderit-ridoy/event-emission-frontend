<template>
	<v-card>
		<v-card-title class="text-h5 grey lighten-2">
			{{ $t('create-user') }}
		</v-card-title>

		<v-card-text>
			<v-form ref="formRef">
				<div class="tw-py-3 tw-space-y-3">
					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('name')"
					>
						<v-text-field
							v-model="form.name"
							v-on="attrs"
							flat
							solo
							dense
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.name.$error"
							:error-messages="
								v$.form.name.$errors.map((v) => v.$message)
							"
						></v-text-field>
					</base-input>
					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('email')"
					>
						<v-text-field
							v-model="form.email"
							v-on="attrs"
							flat
							solo
							dense
							type="email"
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.email.$error"
							:error-messages="
								v$.form.email.$errors.map((v) => v.$message)
							"
						></v-text-field>
					</base-input>
					<base-input
						v-if="!edit"
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('password')"
					>
						<v-text-field
							v-model="form.password"
							v-on="attrs"
							flat
							solo
							dense
							hide-details="auto"
							:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
							:type="show1 ? 'text' : 'password'"
							background-color="#E9E8E8"
							:error="v$.form.password.$error"
							:error-messages="
								v$.form.password.$errors.map((v) => v.$message)
							"
							@click:append="show1 = !show1"
						/>
					</base-input>
				</div>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="warning" text @click="$emit('cancel')">
				{{ $t('cancel') }}
			</v-btn>
			<v-btn
				dark
				color="success"
				:loading="isLoading"
				@click="createNewUser"
			>
				{{ $t('create') }}</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseUserForm',

	setup() {
		return { v$: useVuelidate() }
	},
	props: {
		companyDetails: {
			type: Object,
			default: () => {},
		},
		item: {
			type: Object,
			default: () => {},
		},
		createdByAdmin: {
			type: Boolean,
			default: false,
		},
		edit: {
			type: Boolean,
			default: false,
		},
		singleCompany: {
			type: Boolean,
			default: false,
		},
		admin: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			show1: false,
			isLoading: false,
			form: {
				name: '',
				email: '',
				password: '',
			},
			currentUserCompanyDetails: {},
		}
	},

	validations() {
		return {
			form: {
				name: { required },
				email: { required, email },
				password: !this.edit && { required, minLength: minLength(8) },
			},
		}
	},
	computed: {
		...mapGetters(['currentUser']),
	},
	methods: {
		...mapActions(['createUser', 'updateUser', 'fetchAllUsers']),

		async createNewUser() {
			this.isLoading = true
			this.v$.$touch()

			if (!this.v$.$error) {
				// const data = {
				// 	name: this.form.name,
				// 	email: this.form.email,
				// 	password: this.form.password,
				// 	company_name:
				// 		this.item?.company?.name || this.currentUser?.company?.name,
				// 	company_id:
				// 		this.item?.company?.id || this.currentUser?.company_id,
				// 	role_id: 2,
				// }
				const data = {
					role_id: 2,
					name: this.form.name,
					email: this.form.email,
					password: this.form.password,
					company_id: this?.currentUserCompanyDetails?.id,
					company_name: this?.currentUserCompanyDetails?.name,
					single_company: this?.item?.single_company || this.singleCompany,
				}
				if (this.edit) {
					const [error, response] = await this.updateUser({
						admin: this.admin,
						user_id: this.item.id,
						...data,
					})
					this.isLoading = false
					if (!error) {
						this.$emit('cancel')
					}
				} else {
					const [error, response] = await this.createUser(data)
					this.isLoading = false

					if (!error) {
						this.$emit('cancel')
					}
				}
			} else {
				this.isLoading = false
			}
		},
	},
	watch: {
		item: {
			immediate: true,
			handler(v) {
				if (v) {
					console.log('BaseUserForm::watch::item', v)
					this.currentUserCompanyDetails = v.company
					console.log(
						'BaseUserForm::watch::currentUserCompanyDetails',
						this.currentUserCompanyDetails
					)
					// if (this.createdByAdmin) return
					if (this.item) {
						this.form = this.item
					}
				}
			},
		},
		companyDetails: {
			immediate: true,
			handler(v) {
				if (v) {
					console.log('BaseUserForm::watch::companyDetails', v)
					this.currentUserCompanyDetails = v
					if (this.createdByAdmin) return
					if (this.item) {
						this.form = this.item
					}
				}
			},
		},
	},
}
</script>
