<template>
	<div class="user-my-account">
		<v-tabs background-color="#ffc400" color="#000" v-model="tab" hide-slider>
			<v-tab>{{ $t('account') }}</v-tab>
			<v-tab>{{ $t('user') }}</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tab" class="tw-mt-4">
			<v-tab-item>
				<!-- VIEW DATA -->
				<div class="tw-bg-[#f4f0ea] tw-h-screen" v-if="!isEditing">
					<div class="tw-space-y-3">
						<base-form-card class="admin-login-form tw-w-[600px] tw-p-3">
							<base-input
								v-slot="{ attrs }"
								:label="$t('company-name')"
								hide-required-status
							>
								<v-text-field
									v-model="currentUser.company.name"
									v-on="attrs"
									flat
									solo
									dense
									readonly
									hide-details
									background-color="#E9E8E8"
								></v-text-field>
							</base-input>
							<base-input
								:label="$t('name')"
								v-slot="{ attrs }"
								hide-required-status
							>
								<v-text-field
									v-model="currentUser.name"
									v-on="attrs"
									flat
									solo
									dense
									readonly
									hide-details
									background-color="#E9E8E8"
								></v-text-field>
							</base-input>

							<base-input
								:label="$t('password')"
								v-slot="{ attrs }"
								hide-required-status
							>
								<v-text-field
									v-model="textPassword"
									v-on="attrs"
									flat
									solo
									dense
									readonly
									hide-details
									type="password"
									background-color="#E9E8E8"
								></v-text-field>
							</base-input>

							<template #actions>
								<base-button
									registration
									class="tw-w-[150px] !tw-ml-2"
									@click="isEditing = true"
								>
									{{ $t('edit') }}
								</base-button>
							</template>
						</base-form-card>
					</div>
				</div>
				<!-- EDIT DATA -->
				<div class="tw-bg-[#f4f0ea] tw-h-screen" v-if="isEditing">
					<div class="tw-space-y-3">
						<v-form ref="formRef">
							<base-form-card
								class="admin-login-form tw-w-[600px] tw-p-3"
							>
								<v-alert type="error" dismissible v-model="isError">{{
									errorMessage
								}}</v-alert>
								<v-alert
									v-model="isSuccess"
									dismissible
									type="success"
									>{{ successMessage }}</v-alert
								>
								<base-input
									:label="$t('please-enter-your-current-password')"
									v-slot="{ attrs }"
									hide-required-status
								>
									<v-text-field
										v-model="previous_password"
										v-on="attrs"
										flat
										solo
										dense
										hide-details="auto"
										background-color="#E9E8E8"
										:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
										:type="show1 ? 'text' : 'password'"
										:error="v$.previous_password.$error"
										:error-messages="
											v$.previous_password.$errors.map(
												(v) => v.$message
											)
										"
										@click:append="show1 = !show1"
									></v-text-field>
								</base-input>
								<base-input
									:label="$t('please-enter-a-new-password')"
									v-slot="{ attrs }"
									hide-required-status
								>
									<v-text-field
										v-model="password"
										v-on="attrs"
										flat
										solo
										dense
										hide-details="auto"
										background-color="#E9E8E8"
										:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
										:type="show2 ? 'text' : 'password'"
										:error="v$.password.$error"
										:error-messages="
											v$.password.$errors.map((v) => v.$message)
										"
										@click:append="show2 = !show2"
									></v-text-field>
								</base-input>
								<base-input
									:label="$t('re-enter-new-password')"
									v-slot="{ attrs }"
									hide-required-status
								>
									<v-text-field
										v-model="password_confirmation"
										v-on="attrs"
										flat
										solo
										dense
										background-color="#E9E8E8"
										:append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
										:type="show3 ? 'text' : 'password'"
										:error="v$.password_confirmation.$error"
										:error-messages="
											v$.password_confirmation.$errors.map(
												(v) => v.$message
											)
										"
										@click:append="show3 = !show3"
									></v-text-field>
								</base-input>

								<template #actions>
									<v-btn
										text
										registration
										color="error"
										class="tw-w-[150px] !tw-ml-2"
										@click="isEditing = false"
									>
										{{ $t('cancel') }}
									</v-btn>
									<base-button
										registration
										class="tw-w-[150px] !tw-ml-2"
										@click="resetUserPassword"
									>
										{{ $t('send') }}
									</base-button>
								</template>
							</base-form-card>
						</v-form>
					</div>
				</div>
			</v-tab-item>
			<v-tab-item>
				<user-management-company-users single-company />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, sameAs, minLength } from '@vuelidate/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'UserMyAccount',
	setup() {
		return { v$: useVuelidate() }
	},

	data() {
		return {
			tab: 0,
			textPassword: 'password',
			previous_password: '',
			password: '',
			password_confirmation: '',
			errorMessage: '',
			successMessage: '',
			isSuccess: false,
			// Boolean
			isEditing: false,
			isError: false,
			show1: false,
			show2: false,
			show3: false,
			resetBtnLoading: false,
		}
	},
	validations() {
		return {
			previous_password: { required, minLength: minLength(8) },
			password: { required, minLength: minLength(8) },
			password_confirmation: {
				required,
				sameAs: sameAs(this.password),
			},
		}
	},

	computed: {
		...mapGetters(['currentUser', 'allUsers']),

		headers() {
			return [
				{
					text: this.$t('number'),
					value: 'number',
				},

				{ text: this.$t('name'), value: 'name' },

				{ text: this.$t('email'), value: 'email' },
				{ text: this.$t('actions'), value: 'actions' },
			]
		},
	},
	methods: {
		...mapActions(['resetPassword', 'deleteUser', 'fetchAllUsers']),

		async resetUserPassword() {
			this.resetBtnLoading = true
			this.v$.$touch()
			console.log('v$', this.v$)
			if (!this.v$.$error) {
				const data = {
					email: this.currentUser.email,
					previous_password: this.previous_password,
					password: this.password,
					password_confirmation: this.password_confirmation,
				}
				const [err, res] = await this.resetPassword(data)
				if (err) {
					console.log('reset password error')
					this.isError = true
					this.errorMessage = err.response.data.message
				} else {
					this.isSuccess = true
					this.successMessage = res.message
				}
			}
			this.resetBtnLoading = false
		},
	},
}
</script>

<style lang="scss">
.user-my-account {
	.v-tab--active {
		background: #ffe699;
	}
}
</style>
