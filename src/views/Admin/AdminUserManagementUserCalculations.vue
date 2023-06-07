<template>
	<div class="user-calculation">
		<div class="tw-mt-3">
			<base-data-table
				:headers="headers"
				:items="items"
				header-color="#ffc000"
				odd-cell-color="#ffe8cc"
				even-cell-color="#fff4e7"
			>
				<template v-slot:[`item.actions`]>
					<v-btn color="primary" text> {{ $t('confirmation') }}</v-btn>
				</template>
			</base-data-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AdminUserManagementUserCalculations',

	data() {
		return {
			items: [
				{
					name: 'Lollipop',
					calories: 392,
					fat: 0.2,
					carbs: 98,
					protein: 0,
					iron: 2,
				},
				{
					name: 'Honeycomb',
					calories: 408,
					fat: 3.2,
					carbs: 87,
					protein: 6.5,
					iron: 45,
				},

				{
					name: 'KitKat',
					calories: 518,
					fat: 26.0,
					carbs: 65,
					protein: 7,
					iron: 6,
				},
			],
		}
	},
	computed: {
		headers() {
			return [
				{
					text: this.$t('event-name'),
					value: 'name',
				},
				{
					text: this.$t('event-holder'),
					value: 'calories',
				},
				{ text: this.$t('event-starting-date'), value: 'fat' },
				{ text: this.$t('event-end-date'), value: 'carbs' },
				{ text: this.$t('people-in-charge'), value: 'protein' },
				{ text: this.$t('actions'), value: 'actions' },
			]
		},
	},
}
</script>
