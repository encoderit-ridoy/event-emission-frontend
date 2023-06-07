<template>
	<div>
		<v-navigation-drawer app permanent>
			<div class="w-16 locale-changer">
				<img
					src="../assets/images/product-log.png"
					class="tw-bg-[#f4f0ea]"
				/>
				<!-- <v-select
					v-model="$i18n.locale"
					:items="langs"
					solo
					flat
					dense
					hide-details
					prepend-icon="mdi-translate-variant"
					append-icon="mdi-chevron-down"
				/> -->
			</div>
			<v-list nav dense>
				<v-list-item
					exact
					v-for="(route, index) in routes"
					:key="index"
					:to="{ name: route.name }"
				>
					{{ route.text }}
				</v-list-item>
			</v-list>
			<base-button block logout :loading="logoutLoading" @click="logOutUser">
				{{ $t('log-out') }}
			</base-button>
		</v-navigation-drawer>

		<v-main class="tw-bg-[#f4f0ea] tw-min-h-screen">
			<div class="tw-m-4 tw-mt-12">
				<router-view />
			</div>
		</v-main>
	</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'UserLayout',
	data: () => ({
		langs: ['ja', 'en'],
		logoutLoading: false,
	}),
	computed: {
		routes() {
			return [
				{ name: 'UserDashboard', text: this.$t('dashboard') },
				{ name: 'UserCalculation', text: this.$t('emissions-calculation') },
				{ name: 'UserCalculationResult', text: this.$t('report') },
				{ name: 'UserManual', text: this.$t('manual') },
				{ name: 'UserMyAccount', text: this.$t('my-account') },
				// { name: 'UserLogin', text: this.$t('log-out') },
			]
		},
	},

	mounted() {},

	methods: {
		...mapActions(['logout']),
		async logOutUser() {
			this.logoutLoading = true
			const [error, response] = await this.logout()
			this.logoutLoading = false

			// if (!error) {
			this.$router.push('/')
			// }
		},
	},
}
</script>
