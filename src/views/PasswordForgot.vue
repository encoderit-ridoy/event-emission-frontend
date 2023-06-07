<template>
	<div class="tw-bg-[#f4f0ea] tw-h-screen">
		<base-form-card v-if="!passwordForm" class="tw-w-96 tw-mx-auto tw-mt-10">
			<v-alert v-model="successAlert" color="success" dark dismissible>{{
				message
			}}</v-alert>
			<v-alert v-model="alert" color="error" dark dismissible>{{
				message
			}}</v-alert>
			<v-text-field
				v-model="email"
				dense
				type="email"
				color="#0081C9"
				:label="$t('email')"
				:error="v$.email.$error"
				:error-messages="v$.email.$errors.map((v) => v.$message)"
			></v-text-field>
			<template #actions>
				<div
					class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2"
				>
					<base-button
						login
						class="tw-w-[150px]"
						@click="submit"
						:loading="isLoading"
					>
						{{ $t('submission') }}
					</base-button>
				</div>
			</template>
		</base-form-card>
		<base-form-card v-if="passwordForm" class="tw-w-96 tw-mx-auto tw-mt-10">
			<v-alert type="error" dismissible v-model="isError">{{
				errorMessage
			}}</v-alert>

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
					:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
					:type="show1 ? 'text' : 'password'"
					:error="v$.password.$error"
					:error-messages="v$.password.$errors.map((v) => v.$message)"
					@click:append="show1 = !show1"
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
					hide-details="auto"
					background-color="#E9E8E8"
					:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
					:type="show2 ? 'text' : 'password'"
					:error="v$.password_confirmation.$error"
					:error-messages="
						v$.password_confirmation.$errors.map((v) => v.$message)
					"
					@click:append="show2 = !show2"
				></v-text-field>
			</base-input>
			<template #actions>
				<div
					class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2"
				>
					<base-button
						login
						class="tw-w-[150px]"
						@click="confirmPassword"
						:loading="isConfirmPasswordLoading"
					>
						confirm
					</base-button>
				</div>
			</template>
		</base-form-card>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs, minLength } from '@vuelidate/validators'
import { mapActions } from 'vuex'

export default {
	name: 'PasswordForgot',
	setup() {
		return { v$: useVuelidate() }
	},

	data() {
		return {
			email: '',
			message: '',
			password: '',
			password_confirmation: '',
			errorMessage: '',
			show1: false,
			show2: false,
			alert: false,
			isLoading: false,
			successAlert: false,
			passwordForm: false,
			isConfirmPasswordLoading: false,
			isError: false,
			tokenResponse: {},
		}
	},
	validations() {
		return {
			email: { required, email },
			password: { required, minLength: minLength(8) },
			password_confirmation: {
				required,
				sameAs: sameAs(this.password),
			},
		}
	},
	mounted() {
		this.isToken()
	},
	methods: {
		...mapActions(['tokenCheck', 'resetPassword', 'passwordForgot']),
		async submit() {
			this.v$.email.$touch('email')
			if (!this.v$.$error) {
				this.isLoading = true
				const data = {
					email: this.email,
					redirect_url: window.location.href,
				}
				const [error, response] = await this.passwordForgot(data)
				this.isLoading = false
				if (!error) {
					console.log(response)
					this.message = response.message
					this.successAlert = true
				} else {
					this.message = error.response.data.message
					this.alert = true
				}
			}
		},
		async isToken() {
			const token = this.$route.query.token
			if (token) {
				const [error, response] = await this.tokenCheck(token)
				if (!error) {
					this.passwordForm = true
					this.tokenResponse = response.token
				}
			}
		},
		async confirmPassword() {
			this.isConfirmPasswordLoading = true
			this.email = this.tokenResponse.email

			this.v$.$touch()
			if (!this.v$.$error) {
				const data = {
					email: this.tokenResponse.email,
					token: this.tokenResponse.token,
					password: this.password,
					password_confirmation: this.password_confirmation,
				}
				const [err, res] = await this.resetPassword(data)
				if (err) {
					console.log('reset password error')
					this.isError = true
					this.errorMessage = err.response.data.message
				} else {
					this.$router.push('/')
				}
			} else {
				console.log('error')
			}
			this.isConfirmPasswordLoading = false
		},
	},
}
</script>
