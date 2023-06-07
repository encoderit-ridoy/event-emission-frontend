<template>
	<div>
		<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
		<div
			v-if="!initialLoader && !emptyData"
			class="tw-grid tw-grid-cols-12 tw-gap-5"
		>
			<div class="tw-col-span-12">
				<base-data-table
					hide-pagination
					header-color="#ffc400"
					odd-cell-color="#ffe9ce"
					even-cell-color="#fff5e8"
					header-text-color="#ffffff"
					height="250"
					:headers="headers"
					:items="items"
				>
					<template v-slot:[`item.meetingRoom_emissions`]="{ item }">
						{{
							convertToLocaleString(
								_.round(item.meetingRoom_emissions, roundValue)
							)
						}}
					</template>
					<template v-slot:[`item.transport_emissions`]="{ item }">
						{{
							convertToLocaleString(
								_.round(item.transport_emissions, roundValue)
							)
						}}</template
					>
					<template v-slot:[`item.onlineMeeting_emissions`]="{ item }">
						{{
							convertToLocaleString(
								_.round(item.onlineMeeting_emissions, roundValue)
							)
						}}</template
					>
					<template v-slot:[`item.otherActivities_emissions`]="{ item }">
						{{
							convertToLocaleString(
								_.round(item.otherActivities_emissions, roundValue)
							)
						}}</template
					>
					<template v-slot:[`item.total`]="{ item }">
						{{
							convertToLocaleString(_.round(item.total, roundValue))
						}}</template
					>
				</base-data-table>
			</div>
			<div class="tw-col-span-12">
				<h2
					class="tw-bg-[#ffc400] tw-text-white tw-text-center tw-font-medium tw-text-[34px]"
				>
					{{ $t('co2-emissions-due-to-other-energy-usages') }}
				</h2>
			</div>

			<div class="tw-col-span-3">
				<v-tabs vertical v-model="tab" color="#ffc400">
					<v-tab
						v-model="tabEventId"
						v-for="data in items.data"
						:key="data.event_id"
						@click="tabEventId = data.event_id"
					>
						{{ data.event_name }}
					</v-tab>
				</v-tabs>
			</div>
			<div class="tw-col-span-6">
				<v-tabs-items v-model="tab" class="">
					<v-tab-item
						v-for="data in items.data"
						class="tw-grid tw-grid-cols-2 tw-gap-5 tw-bg-[#f4f0ea]"
						:key="data.event_id"
					>
						<base-calculation-input :label="$t('event-name')">
							{{ _.truncate(data.event_name, { length: 15 }) }}
						</base-calculation-input>
						<base-calculation-input
							:label="$t('co2-emission-of-meeting-room-usage')"
						>
							{{
								convertToLocaleString(
									_.round(data.meetingRoom_emissions, roundValue)
								)
							}}
						</base-calculation-input>
						<base-calculation-input :label="$t('event-holder')">
							{{
								_.truncate(eventDetails.event?.event_holder, {
									length: 15,
								})
							}}
						</base-calculation-input>
						<base-calculation-input
							:label="$t('co2-emission-of-attendance-transportation')"
							>{{
								convertToLocaleString(
									_.round(data.transport_emissions, roundValue)
								)
							}}</base-calculation-input
						>
						<base-calculation-input :label="$t('event-start-date')">{{
							eventDetails.event?.starting_date
						}}</base-calculation-input>
						<base-calculation-input
							:label="$t('co2-emission-of-online-meeting')"
							>{{
								convertToLocaleString(
									_.round(data.onlineMeeting_emissions, roundValue)
								)
							}}</base-calculation-input
						>
						<base-calculation-input :label="$t('event-end-date')">{{
							eventDetails.event?.end_date
						}}</base-calculation-input>
						<base-calculation-input
							:label="$t('co2-emission-of-other-activities')"
							>{{
								convertToLocaleString(
									_.round(data.otherActivities_emissions, roundValue)
								)
							}}</base-calculation-input
						>
						<base-calculation-input :label="$t('people-in-charge')">
							{{ _.get(eventDetails, 'event.people_in_charge', '-') }}
						</base-calculation-input>
						<base-calculation-input :label="$t('co2-emission')">{{
							convertToLocaleString(_.round(data.total, roundValue))
						}}</base-calculation-input>
					</v-tab-item>
				</v-tabs-items>
			</div>
			<div class="tw-col-span-3">
				<h2 class="tw-font-medium tw-text-[18px]">
					{{ $t('co2-emission-of-meeting-room-usage') }}:
				</h2>
				<div class="tw-w-fit tw-ml-auto">
					<span class="tw-font-bold tw-text-[62px] tw-mr-2">{{
						convertToLocaleString(
							_.get(
								eventDetails,
								'event_wise_total_emissions.0.total',
								'-'
							) / 1000
						)
					}}</span
					><span class="tw-font-normal tw-text-[18px]">t-CO2</span>
				</div>
			</div>
			<div class="tw-col-start-4 tw-col-end-10">
				<div class="tw-border-2 tw-border-black tw-shadow-lg tw-bg-white">
					<apex-chart
						type="bar"
						height="350"
						:options="barChartOptions"
						:series="series"
					></apex-chart>
				</div>
			</div>
			<div class="tw-col-start-4 tw-col-end-12">
				<base-data-table
					hide-pagination
					:headers="assumptionHeaders"
					:items="assumptionData"
					header-text-color="#000"
				>
					<template v-slot:[`item.name`]="{ item }">
						{{ item.name }}</template
					>
					<template v-slot:[`item.assumption`]="{ item }">
						<ul>
							<li
								v-for="(assumption, index) in item.assumption"
								:key="index"
							>
								• {{ assumption }}
							</li>
						</ul>
					</template>
				</base-data-table>
			</div>
			<v-layout class="tw-col-start-10 tw-col-end-12">
				<v-spacer />
				<v-btn color="#919191" class="!tw-ml-auto" @click="confirmPrint">{{
					$t('print')
				}}</v-btn>
			</v-layout>
		</div>
		<!-- PRINT -->
		<VueHtml2pdf
			v-if="!initialLoader"
			:show-layout="false"
			:float-layout="true"
			:enable-download="true"
			:preview-modal="false"
			:paginate-elements-by-height="1400"
			filename="report"
			:pdf-quality="2"
			:manual-pagination="false"
			pdf-format="a4"
			pdf-orientation="portrait"
			pdf-content-width="800px"
			ref="html2Pdf"
		>
			<section slot="pdf-content">
				<v-card>
					<v-card-text>
						<div
							id="pdf"
							class="tw-grid tw-grid-cols-12 tw-gap-5 tw-pb-4"
						>
							<div class="tw-col-span-12 tw-bg-[#f4f0ea]">
								<div
									class="tw-bg-[#ffc400] tw-text-white tw-font-medium tw-text-[34px] tw-h-20 tw-p-3 tw-flex tw-items-center tw-justify-center"
								>
									{{ $t('co2-emissions-due-to-other-energy-usages') }}
								</div>
							</div>
							<div class="tw-col-span-9 tw-p-4">
								<v-tabs-items v-model="tab" class="">
									<v-tab-item
										v-for="data in items.data"
										class="tw-grid tw-grid-cols-2 tw-gap-5"
										:key="data.event_id"
									>
										<base-calculation-input :label="$t('event-name')">
											<!-- {{
												truncateString(data.event_name)
											}} -->
											{{
												_.truncate(data.event_name, {
													length: 15,
												})
											}}
										</base-calculation-input>
										<base-calculation-input
											:label="
												$t('co2-emission-of-meeting-room-usage')
											"
										>
											{{
												convertToLocaleString(
													_.round(
														data.meetingRoom_emissions,
														roundValue
													)
												)
											}}
										</base-calculation-input>
										<base-calculation-input
											:label="$t('event-holder')"
										>
											{{
												_.truncate(
													eventDetails.event?.event_holder,
													{
														length: 15,
													}
												)
											}}
										</base-calculation-input>
										<base-calculation-input
											:label="
												$t(
													'co2-emission-of-attendance-transportation'
												)
											"
										>
											{{
												convertToLocaleString(
													_.round(
														data.transport_emissions,
														roundValue
													)
												)
											}}
										</base-calculation-input>
										<base-calculation-input
											:label="$t('event-start-date')"
											>{{
												eventDetails.event?.starting_date
											}}</base-calculation-input
										>
										<base-calculation-input
											:label="$t('co2-emission-of-online-meeting')"
											>{{
												convertToLocaleString(
													_.round(
														data.onlineMeeting_emissions,
														roundValue
													)
												)
											}}</base-calculation-input
										>
										<base-calculation-input
											:label="$t('event-end-date')"
											>{{
												eventDetails.event?.end_date
											}}</base-calculation-input
										>
										<base-calculation-input
											:label="$t('co2-emission-of-other-activities')"
											>{{
												convertToLocaleString(
													_.round(
														data.otherActivities_emissions,
														roundValue
													)
												)
											}}</base-calculation-input
										>
										<base-calculation-input
											:label="$t('people-in-charge')"
										>
											<!-- {{
												convertToLocaleString(
													Number(
														_.get(
															eventDetails,
															'event.people_in_charge',
															0
														)
													)
												)
											}} -->
											{{
												_.get(
													eventDetails,
													'event.people_in_charge',
													'-'
												)
											}}
										</base-calculation-input>
										<base-calculation-input
											:label="$t('co2-emission')"
											>{{
												convertToLocaleString(
													_.round(data.total, roundValue)
												)
											}}</base-calculation-input
										>
									</v-tab-item>
								</v-tabs-items>
							</div>
							<div class="tw-col-span-3">
								<h2 class="tw-font-medium tw-text-[18px]">
									{{ $t('co2-emission-of-meeting-room-usage') }}:
								</h2>
								<div class="tw-w-fit">
									<span class="tw-font-bold tw-text-[62px] tw-mt-2"
										>{{
											convertToLocaleString(
												_.get(
													eventDetails,
													'event_wise_total_emissions.0.total',
													0
												) / 1000
											)
										}}

										<span class="tw-font-normal tw-text-[18px]"
											>t-CO2</span
										>
									</span>
								</div>
							</div>
							<div class="tw-col-start-1 tw-col-end-12">
								<div
									class="tw-border-2 tw-border-black tw-shadow-lg tw-bg-white"
								>
									<apex-chart
										type="bar"
										height="350"
										:options="barChartOptions"
										:series="series"
									></apex-chart>
								</div>
							</div>
							<div class="page-break"></div>
							<div class="tw-col-start-1 tw-col-end-12">
								<base-data-table
									hide-pagination
									header-text-color="#000"
									:headers="assumptionHeaders"
									:items="assumptionData"
								>
									<template v-slot:[`item.name`]="{ item }">
										{{ item.name }}</template
									>
									<template v-slot:[`item.assumption`]="{ item }">
										<ul>
											<li
												class="tw-pb-2"
												v-for="(
													assumption, index
												) in item.assumption"
												:key="index"
											>
												• {{ assumption }}
											</li>
										</ul>
									</template>
								</base-data-table>
							</div>
						</div>
					</v-card-text>
				</v-card>
			</section>
		</VueHtml2pdf>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
	createPagination,
	barChartOptionsHelper,
	convertToLocaleString,
} from '@/helpers'
// eslint-disable-next-line import/no-extraneous-dependencies
import VueHtml2pdf from 'vue-html2pdf'

export default {
	name: 'UserReport',
	components: {
		VueHtml2pdf,
	},
	data() {
		return {
			tab: 0,
			roundValue: 1,
			tabEventId: null,
			pdfDialog: false,
			emptyData: false,
			initialLoader: true,
			items: createPagination(),
			eventDetails: {},
			assumptionData: { data: [] },
			assumptionItems: [
				{
					name: '1',
					calories: 392,
				},
				{
					name: '2',
					calories: 408,
				},

				{
					name: '3',
					calories: 518,
				},
			],
		}
	},

	computed: {
		...mapGetters(['dashboard']),
		barChartOptions() {
			return barChartOptionsHelper({
				isDistributed: true,
				categories: [
					this.$t('meeting-room'),
					this.$t('transportation-ways'),
					this.$t('online-meeting'),
					this.$t('others'),
				],
			})
		},
		series() {
			return [
				{
					data: [
						this._.round(
							Number(
								this?.eventDetails?.event_wise_total_emissions?.[0]
									?.meetingRoom_emissions
							),
							this.roundValue
						),

						this._.round(
							Number(
								this?.eventDetails?.event_wise_total_emissions?.[0]
									?.transport_emissions
							),
							this.roundValue
						),

						this._.round(
							Number(
								this?.eventDetails?.event_wise_total_emissions?.[0]
									?.onlineMeeting_emissions
							),
							this.roundValue
						),
						this._.round(
							Number(
								this?.eventDetails?.event_wise_total_emissions?.[0]
									?.otherActivities_emissions
							),
							this.roundValue
						),
					],
				},
			]
		},

		headers() {
			return [
				{
					text: this.$t('name-of-event'),
					value: 'event_name',
				},
				{
					text: this.$t('co2-emission-of-meeting-room-usage'),
					value: 'meetingRoom_emissions',
				},
				{
					text: this.$t('co2-emission-of-attendance-transportation'),
					value: 'transport_emissions',
				},
				{
					text: this.$t('co2-emission-of-online-meeting'),
					value: 'onlineMeeting_emissions',
				},
				{
					text: this.$t('co2-emission-of-other-activities'),
					value: 'otherActivities_emissions',
				},
				{ text: this.$t('co2-emission'), value: 'total' },
			]
		},
		assumptionHeaders() {
			return [
				{
					text: this.$t('emission'),
					value: 'name',
				},
				{
					text: this.$t('calculation-assumption'),
					value: 'assumption',
				},
			]
		},
	},
	methods: {
		...mapActions(['fetchDashboardData', 'showEvent']),
		barChartOptionsHelper,
		convertToLocaleString,
		confirmPrint() {
			this.$refs.html2Pdf.generatePdf()
		},
	},
	async mounted() {
		const [err, res] = await this.fetchDashboardData()
		// console.log('UserReport::mounted::fetchDashboardData::err::', err)
		// console.log('UserReport::mounted::fetchDashboardData::res::', res)

		this.initialLoader = false
		if (res.event_wise_emissions.length === 0) {
			this.emptyData = true
		}
		this.items.data = this?.dashboard?.event_wise_emissions
		this.tabEventId = this?.items?.data?.[0]?.event_id
	},
	watch: {
		tabEventId: {
			immediate: true,
			async handler(v) {
				if (v) {
					const [err, res] = await this.showEvent(v)

					this.eventDetails = { ...res }
					this.assumptionData.data = [
						{
							name: this.$t('co2-emission-of-meeting-room-usage'),

							assumption: this.eventDetails.event?.meeting_rooms
								?.map((item) => item.pivot.mr_assumption)
								.filter(Boolean),
						},
						{
							name: this.$t('co2-emission-of-attendance-transportation'),

							assumption: this.eventDetails.event?.transportations
								?.map((item) => item.pivot.tp_assumption)
								.filter(Boolean),
						},
						{
							name: this.$t('co2-emission-of-online-meeting'),

							assumption: this.eventDetails.event?.online_meetings
								?.map((item) => item.pivot.om_assumption)
								.filter(Boolean),
						},
						{
							name: this.$t('co2-emission-of-other-activities'),

							assumption: this.eventDetails.event?.other_activities
								?.map((item) => item.pivot.oa_assumption)
								.filter(Boolean),
						},
					]
				}
			},
		},
	},
}
</script>
<style lang="scss">
.page-break {
	page-break-before: always;
}
</style>
