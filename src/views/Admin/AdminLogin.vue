<template>
	<div
		class="admin-login-form tw-bg-[#f4f0ea] tw-flex tw-flex-col tw-items-center tw-h-screen"
	>
		<img width="200px" src="@/assets/images/company-logo.png" />

		<base-form-card
			class="tw-w-[350px]"
			:class="{ 'custom-shadow': $vuetify.breakpoint.mdAndUp }"
		>
			<template #heading>
				<span
					class="tw-mx-auto tw-font-medium tw-text-black tw-text-xs md:tw-text-sm lg:tw-text-base tw-capitalize tw-leading-none"
				>
					{{ $t('admin-web-site') }}
				</span>
			</template>
			<v-alert v-model="alert" dense type="error" dismissible>
				{{ message }}
			</v-alert>
			<v-text-field
				v-model="email"
				color="#0081C9"
				type="email"
				:label="$t('email')"
				:error="v$.email.$error"
				:error-messages="v$.email.$errors.map((v) => v.$message)"
			></v-text-field>
			<v-text-field
				v-model="password"
				color="#0081C9"
				:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
				:type="show ? 'text' : 'password'"
				:label="$t('password')"
				:error="v$.password.$error"
				:error-messages="v$.password.$errors.map((v) => v.$message)"
				@click:append="show = !show"
			></v-text-field>
			<v-checkbox
				v-model="isRemembered"
				class="remember-me"
				color="#ffbe5c"
				off-icon="mdi-checkbox-blank-outline"
				on-icon="mdi-checkbox-marked"
				:ripple="false"
				:label="$t('next-time-login-automatically')"
			></v-checkbox>

			<template #actions>
				<div
					class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2"
				>
					<base-button
						login
						class="tw-w-[150px]"
						:loading="loginLoading"
						@click="loginUser"
						>{{ $t('log-in') }}</base-button
					>
				</div>
			</template>
		</base-form-card>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { mapActions } from 'vuex'

export default {
	name: 'AdminLogin',
	setup() {
		return { v$: useVuelidate() }
	},
	data() {
		return {
			show: false,
			alert: false,
			loginLoading: false,
			isRemembered: false,
			email: '',
			password: '',
			message: '',
		}
	},
	validations() {
		return {
			email: { required, email },
			password: { required },
		}
	},
	mounted() {
		this.email = this.getCookie('event-admin-email')
		this.password = this.getCookie('event-admin-password')
		if (this.email && this.password) {
			this.isRemembered = true
		}
	},
	methods: {
		...mapActions(['login', 'authUser']),
		setCookie() {
			document.cookie = `event-admin-email=${this.email};path=/`
			document.cookie = `event-admin-password=${this.password};path=/`
		},
		getCookie(name) {
			const cookies = document.cookie
				.split(';')
				.reduce((acc, cookieString) => {
					const [key, value] = cookieString.split('=').map((s) => s.trim())
					if (key && value) {
						acc[key] = decodeURIComponent(value)
					}
					return acc
				}, {})
			return name ? cookies[name] || '' : cookies
		},
		async loginUser() {
			this.loginLoading = true
			if (this.isRemembered) {
				this.setCookie()
			}

			this.v$.$touch()

			if (!this.v$.$error) {
				const data = {
					email: this.email,
					password: this.password,
					login_with: 'admin',
				}
				const [error, response] = await this.login(data)
				this.loginLoading = false

				if (!error) {
					const [err, res] = await this.authUser()
					if (!err) {
						this.$router.push('/admin/home')
					}
				} else {
					this.message = error.response.data.message
					this.alert = true
				}
			}
		},
	},
}
</script>

<style lang="scss">
.admin-login-form {
	.custom-shadow {
		box-shadow: 25px 25px 0px -7px rgba(0, 0, 0, 0.3) !important;
	}
}
</style>
