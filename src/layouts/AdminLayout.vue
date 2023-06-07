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
					append-icon=""
				/> -->
			</div>
			<v-list nav dense>
				<v-list-item
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
				{
					name: 'AdminParametersMeetingRoom',
					text: this.$t('meeting-room-parameters'),
				},
				{
					name: 'AdminParametersTransportation',
					text: this.$t('transportation-parameters'),
				},
				{
					name: 'AdminParametersOnlineMeeting',
					text: this.$t('online-meeting-parameters'),
				},
				{
					name: 'AdminParametersOthers',
					text: this.$t('others-parameters'),
				},
				{ name: 'AdminUserManagement', text: this.$t('user-management') },
				{ name: 'AdminManualSetup', text: this.$t('manual-setup') },
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
			this.$router.push('/admin/login')
			// }
		},
	},
}
</script>
