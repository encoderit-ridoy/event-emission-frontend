<template>
	<div
		class="user-login tw-bg-[#f4f0ea] tw-flex tw-items-center tw-justify-center"
	>
		<div class="tw-max-w-[1920px] tw-flex tw-items-center">
			<div>
				<v-carousel
					cycle
					class="carousel"
					height="100vh"
					interval="5000"
					hide-delimiter-background
					:show-arrows="false"
				>
					<v-carousel-item>
						<img
							src="@/assets/images/Slideshow1.png"
							alt=""
							class="tw-object-fill"
						/>
					</v-carousel-item>
					<v-carousel-item>
						<img
							src="@/assets/images/Slideshow2.png"
							alt=""
							class="tw-object-fill"
						/>
					</v-carousel-item>
					<v-carousel-item>
						<img
							src="@/assets/images/Slideshow3.png"
							alt=""
							class="tw-object-fill"
						/>
					</v-carousel-item>
					<v-carousel-item>
						<img
							src="@/assets/images/Slideshow4.png"
							alt=""
							class="tw-object-fill"
						/>
					</v-carousel-item>
				</v-carousel>
			</div>
			<div class="tw-mx-10">
				<base-form-card
					class="user-login-form tw-w-80"
					:class="{ 'custom-shadow': $vuetify.breakpoint.mdAndUp }"
				>
					<template #heading>
						<span
							class="tw-mx-auto tw-font-medium tw-text-black tw-text-xs md:tw-text-lg lg:tw-text-xl tw-capitalize tw-leading-none"
						>
							{{ $t('event-book') }}
						</span>
					</template>

					<v-alert v-model="alert" dense type="error" dismissible>
						{{ message }}
					</v-alert>

					<v-text-field
						v-model="email"
						type="email"
						color="#0081C9"
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
					<div class="md:tw-flex tw-items-center">
						<v-spacer />
						<router-link
							class="tw-font-semibold tw-text-black tw-text-xs tw-ml-8"
							to="/password/forgot"
						>
							{{ $t('forgot-password') }}
						</router-link>
					</div>
					<div class="md:tw-flex tw-items-center">
						<v-checkbox
							v-model="isRemembered"
							class="remember-me"
							on-icon="mdi-checkbox-marked"
							off-icon="mdi-checkbox-blank-outline"
							color="#ffbe5c"
							:ripple="false"
							:label="$t('next-time-login-automatically')"
						></v-checkbox>
					</div>

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
							<base-button registration class="tw-w-[150px]">
								<router-link
									class="!tw-text-black"
									:to="{
										name: 'UserRegistration',
									}"
								>
									{{ $t('registration') }}
								</router-link>
							</base-button>
						</div>
					</template>
				</base-form-card>
				<img
					width="150px"
					src="@/assets/images/company-logo.png"
					class="tw-mx-auto"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { mapActions } from 'vuex'

export default {
	name: 'UserLogin',
	setup() {
		return { v$: useVuelidate() }
	},
	data: () => ({
		langs: ['ja', 'en'],
		show: false,
		isRemembered: false,
		loginLoading: false,
		email: '',
		password: '',
		message: '',
		alert: false,
	}),
	validations() {
		return {
			email: { required, email },
			password: { required },
		}
	},
	mounted() {
		this.email = this.getCookie('event-user-email')
		this.password = this.getCookie('event-user-password')
		if (this.email && this.password) {
			this.isRemembered = true
			console.log('isRemembered', this.isRemembered)
		}
	},
	methods: {
		...mapActions(['login', 'authUser']),
		setCookie() {
			document.cookie = `event-user-email=${this.email};path=/`
			document.cookie = `event-user-password=${this.password};path=/`
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
					login_with: 'user',
				}
				const [error, response] = await this.login(data)
				this.loginLoading = false
				if (!error) {
					const [err, res] = await this.authUser()
					if (!err) {
						this.$router.push('/user/dashboard')
					}
				} else {
					this.message = error.response.data.message
					this.alert = true
				}
			} else {
				this.loginLoading = false
			}
		},
	},
}
</script>
<style lang="scss">
.user-login {
	height: 100svh !important;
	.remember-me {
		label {
			color: black !important;
			font-size: 12px !important;
		}
	}

	.custom-shadow {
		box-shadow: 25px 25px 0px -7px rgba(0, 0, 0, 0.3) !important;
	}
	.carousel {
		.v-btn .v-btn__content .v-icon {
			color: black;
		}
	}
}
</style>
