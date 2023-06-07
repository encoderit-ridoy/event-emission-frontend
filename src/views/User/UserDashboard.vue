<template>
	<div class="user-dashboard tw-h-full tw-grid tw-grid-cols-12 tw-gap-4">
		<table class="tw-col-span-12 tw-bg-white">
			<tr>
				<th>{{ $t('number-of-events') }}</th>
				<th>{{ $t('average-co2-emission-of-events') }}</th>
			</tr>
			<tr>
				<td width="50%">
					{{
						convertToLocaleString(
							_.round(dashboard.total_event, roundValue)
						)
					}}
				</td>

				<td width="50%">
					{{
						convertToLocaleString(
							_.round(dashboard.average_emissions, roundValue)
						)
					}}
				</td>
			</tr>
		</table>

		<table class="tw-col-span-12 tw-bg-white">
			<tr>
				<th>{{ $t('percentage-of-meeting-room-emissions') }}</th>
				<th>
					{{ $t('percentage-of-emissions-of-attending-transportation') }}
				</th>
				<th>{{ $t('percentage-of-emissions-from-online-meetings') }}</th>
				<th>{{ $t('percentage-of-emissions-from-other-activities') }}</th>
			</tr>
			<tr>
				<td width="25%">
					<!-- {{ numberFormatting(dashboard.meetingRoom_percentage) ?? 0 }}% -->
					{{ _.round(dashboard.meetingRoom_percentage, roundValue) || 0 }}%
				</td>
				<td width="25%">
					<!-- {{ numberFormatting(dashboard.transportation_percentage) ?? 0 }}% -->
					{{
						_.round(dashboard.transportation_percentage, roundValue) || 0
					}}%
				</td>
				<td width="25%">
					<!-- {{ numberFormatting(dashboard.onlineMeeting_percentage) ?? 0 }}% -->
					{{
						_.round(dashboard.onlineMeeting_percentage, roundValue) || 0
					}}%
				</td>
				<td width="25%">
					<!-- {{
						numberFormatting(dashboard.otherActivities_percentage) ?? 0
					}}% -->
					{{
						_.round(dashboard.otherActivities_percentage, roundValue) ||
						0
					}}%
				</td>
			</tr>
		</table>
		<v-list nav dense class="tw-col-span-3 tw-overflow-auto" height="315px">
			<v-list-item
				v-for="(item, index) in dashboard.event_wise_emissions"
				:key="index"
			>
				<v-checkbox
					v-model="specificBarChartDataId"
					:value="item.event_id"
					@change="changeSpecificDataId('bar')"
				/>

				<!-- {{ truncateString(item.event_name) }} -->
				{{ _.truncate(item.event_name, { length: 15 }) }}
			</v-list-item>
		</v-list>
		<div class="tw-col-span-9 bar-chart">
			<apex-chart
				type="bar"
				height="300"
				:options="barChartOptions"
				:series="barChartSeries"
			></apex-chart>
		</div>
		<v-list nav dense class="tw-col-span-3 tw-overflow-auto" height="315px">
			<v-list-item
				v-for="(item, index) in dashboard.event_wise_emissions"
				:key="index"
			>
				<v-checkbox
					v-model="specificPieChartDataId"
					:value="item.event_id"
					@change="changeSpecificDataId('pie')"
				/>

				<!-- {{ truncateString(item.event_name) }} -->
				{{ _.truncate(item.event_name, { length: 15 }) }}
			</v-list-item>
		</v-list>
		<div
			class="tw-col-span-9 pie-chart tw-flex tw-flex-wrap tw-justify-around"
		>
			<div
				v-for="(chart, index) in eventWiseEmissionsPieChats"
				:key="index"
				class="tw-content-center"
			>
				<apex-chart
					type="pie"
					width="300"
					:series="chart.series"
					:options="chart.options"
				/>
				<p class="tw-text-center">
					<!-- {{ truncateString(chart.name) }} -->
					{{ _.truncate(chart.name, { length: 15 }) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { barChartOptionsHelper, convertToLocaleString } from '@/helpers'

export default {
	name: 'UserDashboard',

	data() {
		return {
			roundValue: 1,
			specificBarChartDataId: [],
			specificPieChartDataId: [],
		}
	},
	async mounted() {
		await this.fetchDashboardData()
		await this.fetchSpecificData({ type: 'bar' })
		this.specificBarChartDataId =
			this.specificBarChartData?.event_wise_emissions.map(
				(event) => event.event_id
			)
		console.log('specificBarChartData', this.specificBarChartData)
		await this.fetchSpecificData({ type: 'pie' })
		this.specificPieChartDataId =
			this.specificPieChartData?.event_wise_emissions.map(
				(event) => event.event_id
			)
	},
	computed: {
		...mapGetters([
			'dashboard',
			'specificBarChartData',
			'specificPieChartData',
		]),

		eventWiseEmissionsPieChats() {
			return (this.specificPieChartData?.event_wise_emissions || []).map(
				(event) => {
					return {
						name: event.event_name,
						series: [
							+event.meetingRoom_emissions,
							+event.transport_emissions,
							+event.onlineMeeting_emissions,
							+event.otherActivities_emissions,
						],
						options: {
							chart: {
								width: 260,
								type: 'pie',
							},
							tooltip: {
								enabled: true,
								y: {
									formatter: (val) => {
										return this._.round(val, 1)
									},
								},
								marker: {
									show: true, // show the marker on the tooltip
								},
							},
							colors: ['#ffe89e', '#ffc400', '#c39500', '#856600'],

							legend: {
								show: true,
								position: 'top',
							},
							labels: [
								this.$t('meeting-room'),
								this.$t('attendance-transportation'),
								this.$t('online-meeting'),
								this.$t('others'),
							],
						},
					}
				}
			)
		},

		chartCategory() {
			return this.specificBarChartData?.event_wise_emissions?.map((item) =>
				this._.truncate(item.event_name)
			)
		},
		barChartSeries() {
			return [
				'meetingRoom_emissions',
				'onlineMeeting_emissions',
				'otherActivities_emissions',
				'transport_emissions',
			].map((key, index) => {
				return {
					name: this.$t(key),
					data: this.specificBarChartData?.event_wise_emissions?.map(
						(event) => {
							return this._.round(+event[key], this.roundValue)
						}
					),
				}
			})
		},
		barChartOptions() {
			return barChartOptionsHelper({
				categories: this.chartCategory,
			})
		},
	},
	methods: {
		...mapActions(['fetchDashboardData', 'fetchSpecificData']),
		barChartOptionsHelper,
		convertToLocaleString,
		// numberFormatting,

		async changeSpecificDataId(type) {
			if (type === 'bar') {
				if (this.specificBarChartDataId.length <= 5) {
					await this.fetchSpecificData({
						type,
						ids: this.specificBarChartDataId,
					})
					this.specificBarChartDataId =
						this.specificBarChartData?.event_wise_emissions.map(
							(event) => event.event_id
						)
				} else {
					this.specificBarChartDataId.shift()
					await this.fetchSpecificData(this.specificBarChartDataId)
					this.specificBarChartDataId =
						this.specificBarChartData?.event_wise_emissions.map(
							(event) => event.event_id
						)
				}
			} else if (type === 'pie') {
				if (this.specificPieChartDataId.length <= 4) {
					console.log(this.specificPieChartDataId)
					console.log(this.specificPieChartDataId.length)
					await this.fetchSpecificData({
						type,
						ids: this.specificPieChartDataId,
					})
					this.specificPieChartDataId =
						this.specificPieChartData?.event_wise_emissions.map(
							(event) => event.event_id
						)
				} else {
					this.specificPieChartDataId.shift()
					console.log(this.specificPieChartDataId)
					console.log(this.specificPieChartDataId.length)
					await this.fetchSpecificData({
						type,
						ids: this.specificPieChartDataId,
					})
					this.specificPieChartDataId =
						this.specificPieChartData?.event_wise_emissions.map(
							(event) => event.event_id
						)
				}
			}
		},
	},
}
</script>

<style lang="scss">
.user-dashboard {
	table,
	.bar-chart,
	.pie-chart,
	.v-list {
		-webkit-box-shadow: 4px 7px 20px -8px rgba(0, 0, 0, 0.9);
		-moz-box-shadow: 4px 7px 20px -8px rgba(0, 0, 0, 0.9);
		box-shadow: 4px 7px 20px -8px rgba(0, 0, 0, 0.9) !important;
	}
	.v-list {
		border: 1px solid;
	}
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		text-align: center;
	}
	th {
		font-size: 18px;
		font-weight: 400;
		color: #636363;
		padding: 5px;
	}
	td {
		font-size: 42px;
		font-weight: 800;
		color: #000;
		padding: 5px;
	}
}
</style>
