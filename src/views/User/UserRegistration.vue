<template>
	<div
		class="tw-bg-[#f4f0ea] tw-flex tw-justify-center tw-items-center tw-h-screen"
	>
		<base-form-card
			class="admin-login-form tw-w-[600px] tw-py-1 tw-px-5 md:tw-px-7 lg:tw-px-9"
		>
			<template #heading>
				<span
					class="tw-font-bold tw-text-black tw-text-base lg:tw-text-xl tw-capitalize tw-leading-none"
				>
					{{ $t('application') }}
				</span>
			</template>
			<v-alert v-model="alert" dense type="success" dismissible>
				{{ message }}
			</v-alert>
			<v-alert v-model="policyAlert" dense type="error" dismissible>
				{{ $t('agree-policy') }}
			</v-alert>
			<v-alert v-model="errorAlert" dense type="error" dismissible>
				{{ message }}
			</v-alert>
			<!-- <v-select
				v-model="$i18n.locale"
				:items="langs"
				solo
				flat
				dense
				hide-details
				append-icon="mdi-chevron-down"
				background-color="#dbdbdb"
			/> -->
			<base-input v-slot="{ attrs }" mandatory :label="$t('company-name')">
				<v-text-field
					v-model="companyName"
					v-on="attrs"
					flat
					solo
					dense
					hide-details="auto"
					background-color="#E9E8E8"
					:error="v$.companyName.$error"
					:error-messages="v$.companyName.$errors.map((v) => v.$message)"
				></v-text-field>
			</base-input>
			<base-input :label="$t('name')" v-slot="{ attrs }" mandatory>
				<v-text-field
					v-model="name"
					v-on="attrs"
					flat
					solo
					dense
					hide-details="auto"
					background-color="#E9E8E8"
					:error="v$.name.$error"
					:error-messages="v$.name.$errors.map((v) => v.$message)"
				></v-text-field>
			</base-input>
			<base-input :label="$t('phone-number')" v-slot="{ attrs }">
				<v-text-field
					v-model="phoneNumber"
					v-on="attrs"
					flat
					solo
					dense
					type="number"
					hide-details="auto"
					background-color="#E9E8E8"
				></v-text-field>
			</base-input>
			<base-input v-slot="{ attrs }" mandatory :label="$t('email')">
				<v-text-field
					v-model="email"
					v-on="attrs"
					flat
					solo
					dense
					type="email"
					hide-details="auto"
					background-color="#E9E8E8"
					:hint="$t('email-not-allowed')"
					:error="v$.email.$error"
					:error-messages="v$.email.$errors.map((v) => v.$message)"
				></v-text-field>
			</base-input>
			<base-input :label="$t('password')" v-slot="{ attrs }" mandatory>
				<v-text-field
					v-model="password"
					v-on="attrs"
					flat
					solo
					dense
					hide-details="auto"
					background-color="#E9E8E8"
					:type="show ? 'text' : 'password'"
					:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
					:error="v$.password.$error"
					:error-messages="v$.password.$errors.map((v) => v.$message)"
					@click:append="show = !show"
				></v-text-field>
			</base-input>
			<base-input :label="$t('event-date')" v-slot="{ attrs }">
				<v-text-field
					v-model="eventDate"
					v-on="attrs"
					flat
					solo
					dense
					readonly
					background-color="#E9E8E8"
					hide-details
				>
					<template #append>
						<v-menu offset-x>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon v-bind="attrs" v-on="on"
										>mdi-calendar</v-icon
									>
								</v-btn>
							</template>
							<v-date-picker
								v-model="eventDate"
								:min="today"
								no-title
								scrollable
							></v-date-picker>
						</v-menu>
					</template>
				</v-text-field>
			</base-input>
			<base-input
				v-slot="{ attrs }"
				:label="$t('number-of-event-attendance')"
			>
				<v-text-field
					v-model="numberOfEventAttendance"
					v-on="attrs"
					flat
					solo
					dense
					hide-details="auto"
					background-color="#E9E8E8"
					type="number"
				></v-text-field>
			</base-input>

			<v-checkbox
				v-model="isChecked"
				class="remember-me !tw-m-0"
				color="#ffbe5c"
				off-icon="mdi-checkbox-blank-outline"
				on-icon="mdi-checkbox-marked"
				:ripple="false"
			>
				<template #label>
					<router-link :to="{ name: 'UserPrivacyPolicy' }"
						>{{ $t('privacy-policy') }}
						<span class="tw-text-red-600">*</span>
					</router-link>
				</template>
			</v-checkbox>

			<template #actions>
				<div
					class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2"
				>
					<base-button
						registration
						block
						:loading="isLoading"
						class="tw-w-[150px]"
						@click="registerUser"
					>
						{{ $t('apply') }}
					</base-button>
				</div>
			</template>
		</base-form-card>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { mapActions } from 'vuex'
import { omitEmpties } from 'vuelpers'
import { currentDate } from '@/helpers'

export default {
	name: 'UserRegistration',
	setup() {
		return { v$: useVuelidate() }
	},

	data() {
		return {
			langs: ['ja', 'en'],
			today: '',
			companyName: '',
			name: '',
			phoneNumber: '',
			email: '',
			password: '',
			eventDate: '',
			numberOfEventAttendance: '',
			message: '',
			isChecked: true,
			isLoading: false,
			alert: false,
			show: false,
			policyAlert: false,
			errorAlert: false,
		}
	},
	validations() {
		return {
			companyName: { required },
			name: { required },
			email: { required, email },
			password: { required },
		}
	},

	mounted() {
		this.isToken()
		this.today = currentDate()
	},

	methods: {
		...mapActions(['registration', 'emailVerify', 'authUser']),
		async isToken() {
			console.log('isToken')
			const token = this.$route.query.token
			console.log('isToken', token)
			if (token) {
				const [error, response] = await this.emailVerify(token)

				if (!error) {
					const [err, res] = await this.authUser()
					if (!err) {
						this.$router.push('/user/dashboard')
					}
				}
			}
		},

		async registerUser() {
			if (!this.isChecked) {
				this.policyAlert = true
				return
			}
			this.v$.$touch()

			if (!this.v$.$error) {
				this.isLoading = true
				const data = omitEmpties({
					company_name: this.companyName,
					name: this.name,
					phone: this.phoneNumber,
					email: this.email,
					password: this.password,
					event_date: this.eventDate,
					no_of_event_attendance: this.numberOfEventAttendance,
					role_id: 2,
					redirect_url: window.location.href,
				})

				const [error, response] = await this.registration(data)
				this.isLoading = false
				if (!error) {
					this.message = response.message
					this.alert = true
				} else {
					this.message = error.response.data.errors?.email[0]
					this.errorAlert = true
				}
			}
		},
	},
}
</script>
