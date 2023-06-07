<template>
	<v-card flat tile class="user-calculation-new !tw-bg-[#f4f0ea]">
		<!-- <base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" /> -->
		<v-card-title>
			<v-spacer />
			<v-icon @click="closeDialog">mdi-close</v-icon>
		</v-card-title>
		<v-card-text class="tw-px-6">
			<v-form ref="formRef">
				<div class="tw-grid tw-grid-cols-12 tw-gap-10">
					<!-- event values -->
					<div class="tw-col-span-4 tw-space-y-2">
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('event-name')"
						>
							<v-text-field
								v-model="name"
								v-on="attrs"
								flat
								solo
								color="red"
								class="!tw-w-16"
								hide-details="auto"
								:readonly="readOnly"
								:error="v$.name.$error"
								:error-messages="v$.name.$errors.map((v) => v.$message)"
							/>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('event-holder')"
						>
							<v-text-field
								v-model="event_holder"
								v-on="attrs"
								flat
								solo
								class="!tw-w-16"
								hide-details="auto"
								:readonly="readOnly"
								:error="v$.event_holder.$error"
								:error-messages="
									v$.event_holder.$errors.map((v) => v.$message)
								"
							/>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('event-starting-date')"
						>
							<v-text-field
								v-model="starting_date"
								v-on="attrs"
								flat
								solo
								readonly
								class="!tw-w-16"
								hide-details="auto"
								:error="v$.starting_date.$error"
								:error-messages="
									v$.starting_date.$errors.map((v) => v.$message)
								"
							>
								<template #append>
									<v-menu v-if="!readOnly" offset-x>
										<template v-slot:activator="{ on, attrs }">
											<v-btn icon v-bind="attrs" v-on="on">
												<v-icon v-bind="attrs" v-on="on"
													>mdi-calendar</v-icon
												>
											</v-btn>
										</template>
										<v-date-picker
											v-model="starting_date"
											:min="today"
											:max="end_date"
											no-title
											scrollable
										></v-date-picker>
									</v-menu>
								</template>
							</v-text-field>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:readonly="readOnly"
							:label="$t('event-end-date')"
						>
							<v-text-field
								v-model="end_date"
								v-on="attrs"
								flat
								solo
								readonly
								class="!tw-w-16"
								hide-details="auto"
								:error="v$.end_date.$error"
								:error-messages="
									v$.end_date.$errors.map((v) => v.$message)
								"
							>
								<template #append>
									<v-menu v-if="!readOnly" offset-x>
										<template v-slot:activator="{ on, attrs }">
											<v-btn icon v-bind="attrs" v-on="on">
												<v-icon v-bind="attrs" v-on="on"
													>mdi-calendar</v-icon
												>
											</v-btn>
										</template>
										<v-date-picker
											v-model="end_date"
											:min="starting_date"
											no-title
											scrollable
										></v-date-picker>
									</v-menu>
								</template>
							</v-text-field>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('people-in-charge')"
						>
							<v-text-field
								v-model="people_in_charge"
								v-on="attrs"
								flat
								solo
								class="!tw-w-16"
								hide-details="auto"
								:readonly="readOnly"
								:error="v$.people_in_charge.$error"
								:error-messages="
									v$.people_in_charge.$errors.map((v) => v.$message)
								"
							/>
						</base-calculation-input>
					</div>
					<!-- event chart -->
					<div class="tw-col-start-7 tw-col-end-12">
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
					<!-- event details -->
					<div class="tw-col-span-4 tw-space-y-4">
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('co2-emission-of-meeting-room-usage')"
						>
							<span v-on="attrs" class="tw-mr-4">{{
								convertToLocaleString(totalMeetingRoomUsage)
							}}</span>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('co2-emission-of-attendance-transportation')"
						>
							<span v-on="attrs" class="tw-mr-4">{{
								convertToLocaleString(totalTransportation)
							}}</span>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('co2-emission-of-online-meeting')"
						>
							<span v-on="attrs" class="tw-mr-4">{{
								convertToLocaleString(totalOnlineMeeting)
							}}</span>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('co2-emission-of-other-activities')"
						>
							<span v-on="attrs" class="tw-mr-4">{{
								convertToLocaleString(totalOther)
							}}</span>
						</base-calculation-input>
						<base-calculation-input
							v-slot="{ attrs }"
							:label="$t('co2-emission')"
						>
							<span v-on="attrs" class="tw-mr-4">{{
								convertToLocaleString(total)
							}}</span>
						</base-calculation-input>
					</div>
					<!-- event data tables -->
					<div class="tw-col-span-12 tw-space-y-5">
						<!-- table 1 -->
						<base-data-table
							hide-pagination
							header-text-color="#000"
							header-color="#ffe699"
							class="meeting-room-table"
							:searchable="!readOnly"
							:headers="meetingRoomHeaders"
							:items="meetingRooms"
						>
							<template v-slot:[`search:meetingRoomName`]>
								<base-meeting-room-params
									@changeMeetingRoom="changeRoom"
								/>
							</template>
							<template v-slot:[`search:meetingHour`]>
								<v-text-field
									v-model="meetingHour"
									flat
									solo
									dense
									hide-details
									min="1"
									type="number"
									:label="$t('meeting-hours')"
								/>
							</template>
							<template v-slot:[`search:meetingResult`]>
								<v-text-field
									v-model="meetingRoomResult"
									solo
									flat
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:units`]>
								<v-text-field
									v-model="meetingRoomUnit"
									solo
									flat
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:assumption`]>
								<v-textarea
									v-model="meetingRoomAssumption"
									solo
									flat
									dense
									hide-details
									rows="1"
									:label="$t('assumption')"
								></v-textarea>
							</template>
							<template v-slot:[`item.meetingHour`]="{ item }">
								{{ convertToLocaleString(Number(item.meetingHour)) }}
							</template>
							<template v-slot:[`item.units`]="{ item }">
								{{ item.meetingRoomUnit }}
							</template>
							<template v-slot:[`item.meetingResult`]="{ item }">
								{{ convertToLocaleString(item.meetingRoomResult) }}
							</template>
							<template v-slot:[`item.assumption`]="{ item }">
								{{ item.meetingRoomAssumption }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-btn
									dark
									color="error"
									@click="deleteEvent(item, 'meeting-room')"
								>
									<v-icon> mdi-delete </v-icon>
								</v-btn>
							</template>
							<template v-slot:[`search:actions`]>
								<v-btn color="green" dark @click="addNewMeetingRoom">
									{{ $t('add') }}</v-btn
								>
							</template>
						</base-data-table>
						<!-- table 2 -->
						<base-data-table
							hide-pagination
							header-color="#ffc000"
							class="transportation-table"
							header-text-color="#000"
							:searchable="!readOnly"
							:items="transportations"
							:headers="transportationHeaders"
						>
							<template v-slot:[`search:transportationName`]>
								<base-transportation-params
									@changeTransportation="changeTransportationWay"
								/>
							</template>
							<template v-slot:[`search:transportationPeople`]>
								<v-text-field
									v-model="transportationPeople"
									solo
									flat
									dense
									hide-details
									type="number"
								></v-text-field>
							</template>
							<template v-slot:[`search:transportationFee`]>
								<v-text-field
									v-model="transportationFee"
									solo
									flat
									dense
									hide-details
									min="1"
									type="number"
								></v-text-field>
							</template>
							<template v-slot:[`search:transportationWayResult`]>
								<v-text-field
									v-model="transportationResult"
									solo
									flat
									dense
									readonly
									hide-details
								></v-text-field>
							</template>
							<template v-slot:[`search:units`]>
								<v-text-field
									v-model="transportationUnit"
									solo
									flat
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:assumption`]>
								<v-textarea
									v-model="transportationAssumption"
									solo
									flat
									dense
									hide-details
									rows="1"
									type="number"
									:label="$t('assumption')"
								></v-textarea>
							</template>

							<template v-slot:[`item.transportationPeople`]="{ item }">
								{{
									convertToLocaleString(
										Number(item.transportationPeople)
									)
								}}
							</template>
							<template v-slot:[`item.transportationFee`]="{ item }">
								{{
									convertToLocaleString(Number(item.transportationFee))
								}}
							</template>
							<template v-slot:[`item.units`]="{ item }">
								{{ item.transportationUnit }}
							</template>
							<template
								v-slot:[`item.transportationWayResult`]="{ item }"
							>
								{{ convertToLocaleString(item.transportationResult) }}
							</template>
							<template v-slot:[`item.assumption`]="{ item }">
								{{ item.transportationAssumption }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-btn
									color="error"
									dark
									@click="deleteEvent(item, 'transportation')"
								>
									<v-icon> mdi-delete </v-icon>
								</v-btn>
							</template>
							<template v-slot:[`search:actions`]>
								<v-btn color="green" dark @click="addTransportation">
									{{ $t('add') }}</v-btn
								>
							</template>
						</base-data-table>
						<!-- table 3 -->
						<base-data-table
							hide-pagination
							class="online-meeting-table"
							header-color="#bf9000"
							header-text-color="#000"
							:searchable="!readOnly"
							:items="onlineMeetings"
							:headers="onlineMeetingHeaders"
						>
							<template v-slot:[`search:onlineMeetingName`]>
								<base-online-meeting-params
									@changeOnlineMeeting="changeOnlineMeetingParams"
								/>
							</template>

							<template v-slot:[`search:onlineMeetingPeople`]>
								<v-text-field
									v-model="onlineMeetingPeople"
									flat
									solo
									dense
									hide-details
									type="number"
								></v-text-field>
							</template>
							<template v-slot:[`search:onlineMeetingHour`]>
								<v-text-field
									v-model="onlineMeetingHour"
									flat
									solo
									dense
									hide-details
									type="number"
								></v-text-field>
							</template>
							<template v-slot:[`search:onlineMeetingRoomResult`]>
								<v-text-field
									v-model="onlineMeetingResult"
									flat
									solo
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:units`]>
								<v-text-field
									v-model="onlineMeetingUnit"
									solo
									flat
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:assumption`]>
								<v-textarea
									v-model="onlineMeetingAssumption"
									flat
									solo
									hide-details
									dense
									rows="1"
									type="number"
									:label="$t('assumption')"
								></v-textarea>
							</template>
							<template v-slot:[`item.onlineMeetingPeople`]="{ item }">
								{{
									convertToLocaleString(
										Number(item.onlineMeetingPeople)
									)
								}}
							</template>
							<template v-slot:[`item.onlineMeetingHour`]="{ item }">
								{{
									convertToLocaleString(Number(item.onlineMeetingHour))
								}}
							</template>
							<template v-slot:[`item.units`]="{ item }">
								{{ item.onlineMeetingUnit }}
							</template>
							<template
								v-slot:[`item.onlineMeetingRoomResult`]="{ item }"
							>
								{{ convertToLocaleString(item.onlineMeetingResult) }}
							</template>
							<template v-slot:[`item.assumption`]="{ item }">
								{{ item.onlineMeetingAssumption }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-btn
									color="error"
									dark
									@click="deleteEvent(item, 'online-meeting')"
								>
									<v-icon> mdi-delete </v-icon>
								</v-btn>
							</template>
							<template v-slot:[`search:actions`]>
								<v-btn color="green" dark @click="addOnlineMeeting">
									{{ $t('add') }}</v-btn
								>
							</template>
						</base-data-table>
						<!-- table 4 -->
						<base-data-table
							hide-pagination
							class="others-table"
							header-color="#85660a"
							header-text-color="#fff"
							:items="others"
							:searchable="!readOnly"
							:headers="otherActivityHeaders"
						>
							<template v-slot:[`search:otherName`]>
								<base-other-params @changeOthers="changeOtherParams" />
							</template>
							<template v-slot:[`search:otherPeople`]>
								<div class="tw-flex tw-flex-col tw-gap-2">
									<v-text-field
										v-model="otherPeople"
										flat
										solo
										dense
										hide-details
										min="1"
										type="number"
										label="Number of people"
									></v-text-field>
									<v-text-field
										v-if="otherName == '宿泊'"
										v-model="otherHour"
										flat
										solo
										dense
										hide-details
										min="1"
										type="number"
										label="Number of hour"
									></v-text-field>
								</div>
							</template>
							<template v-slot:[`search:otherActivityResult`]>
								<v-text-field
									v-model="otherResult"
									flat
									solo
									dense
									readonly
									hide-details
								></v-text-field>
							</template>
							<template v-slot:[`search:units`]>
								<v-text-field
									v-model="otherUnit"
									solo
									flat
									dense
									readonly
									hide-details
								/>
							</template>
							<template v-slot:[`search:assumption`]>
								<v-textarea
									v-model="otherAssumption"
									flat
									solo
									dense
									hide-details
									rows="1"
									:label="$t('assumption')"
								></v-textarea>
							</template>
							<template v-slot:[`search:actions`]>
								<v-btn color="green" dark @click="addOtherActivity">
									{{ $t('add') }}</v-btn
								>
							</template>
							<template v-slot:[`item.units`]="{ item }">
								{{ item.otherUnit }}
							</template>
							<template v-slot:[`item.otherPeople`]="{ item }">
								{{ convertToLocaleString(Number(item.otherPeople)) }}
							</template>
							<template v-slot:[`item.otherActivityResult`]="{ item }">
								{{ convertToLocaleString(item.otherResult) }}
								<!-- <pre>                {{ item }}</pre> -->
							</template>
							<template v-slot:[`item.assumption`]="{ item }">
								{{ item.otherAssumption }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-btn
									dark
									color="error"
									@click="deleteEvent(item, 'other-activity')"
								>
									<v-icon> mdi-delete </v-icon>
								</v-btn>
							</template>
						</base-data-table>
					</div>
				</div>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<div v-if="!readOnly">
				<v-btn
					dark
					color="info"
					x-large
					class="tw-ml-2"
					@click="submit"
					:loading="submitLoading"
				>
					<!-- {{ edit ? 'update' : $t('submit') }} -->
					{{ $t('submit') }}
				</v-btn>
			</div>
		</v-card-actions>
	</v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapActions, mapGetters } from 'vuex'
import { omitEmpties } from 'vuelpers'
import {
	currentDate,
	convertToLocaleString,
	barChartOptionsHelper,
} from '@/helpers'

export default {
	name: 'UserCalculationNew',
	setup() {
		return { v$: useVuelidate() }
	},
	props: {
		readOnly: {
			type: Boolean,
			default: false,
		},
		edit: {
			type: Boolean,
			default: false,
		},

		item: {
			type: Object,
			default: () => {},
		},
	},

	data() {
		return {
			// initialLoader: true,
			roundValue: 1,
			today: '',
			submitLoading: false,
			eventId: null,
			name: '',
			event_holder: '',
			starting_date: '',
			end_date: '',
			people_in_charge: '',
			assumption: '',
			meetingRooms: { data: [] },
			meetingRoomId: null,
			meetingRoomName: '',
			meetingHour: 1,
			meetingRoomElectricityUsage: '',
			meetingRoomUnit: '',
			meetingRoomAssumption: '',
			meetingRoomResult: null,
			mr_assumption: '',
			transportations: { data: [] },
			transportationId: null,
			transportationName: '',
			transportationAssumption: '',
			transportationParams: null,
			transportationPeople: 1,
			transportationFee: 1,
			transportationUnit: '',
			transportationResult: null,
			tp_assumption: '',
			onlineMeetings: { data: [] },
			onlineMeetingId: null,
			onlineMeetingName: '',
			onlineMeetingAssumption: '',
			onlineMeetingUnit: '',
			onlineMeetingParams: null,
			onlineMeetingPeople: 1,
			onlineMeetingHour: 1,
			onlineMeetingResult: null,
			om_assumption: '',
			others: { data: [] },
			otherId: null,
			otherName: '',
			otherAssumption: '',
			otherUnit: '',
			otherParams: null,
			otherPeople: 1,
			otherHour: 1,
			oa_assumption: '',
			otherResult: null,
		}
	},

	validations() {
		return {
			name: { required },
			event_holder: { required },
			starting_date: { required },
			end_date: { required },
			people_in_charge: { required },
		}
	},
	computed: {
		...mapGetters(['currentUser']),

		barChartOptions() {
			return barChartOptionsHelper({
				isDistributed: true,
				categories: [
					this.$t('use-of-venue'),
					this.$t('participant-movement'),
					this.$t('online-meeting'),
					this.$t('others'),
				],
			})
		},
		totalMeetingRoomUsage() {
			return this.meetingRooms.data.reduce((total, item) => {
				return this._.round(
					total + +(item.meetingRoomResult || 0),
					this.roundValue
				)
			}, 0)
		},
		totalTransportation() {
			return this.transportations.data.reduce((total, item) => {
				return this._.round(
					total + +(item.transportationResult || 0),
					this.roundValue
				)
			}, 0)
		},
		totalOnlineMeeting() {
			return this.onlineMeetings.data.reduce((total, item) => {
				return this._.round(
					total + +(item.onlineMeetingResult || 0),
					this.roundValue
				)
			}, 0)
		},
		totalOther() {
			return this.others.data.reduce((total, item) => {
				return this._.round(
					total + +(item.otherResult || 0),
					this.roundValue
				)
			}, 0)
		},
		series() {
			return [
				{
					name: '',
					data: [
						this.totalMeetingRoomUsage,
						this.totalTransportation,
						this.totalOnlineMeeting,
						this.totalOther,
					],
				},
			]
		},
		total() {
			const totalCo2 =
				this.totalMeetingRoomUsage +
				this.totalTransportation +
				this.totalOnlineMeeting +
				this.totalOther

			return this._.round(totalCo2, this.roundValue)
		},
		meetingRoomHeaders() {
			return [
				{
					text: this.$t('meeting-room'),
					value: '',
					width: 12,
				},
				{
					text: this.$t('meeting'),
					value: 'meetingRoomName',
				},
				{
					text: this.$t('open-time'),
					value: 'meetingHour',
				},
				{
					text: this.$t('units'),
					value: 'units',
				},
				{
					text: this.$t('co2-emissions-due-to-meeting-room'),
					value: 'meetingResult',
				},
				{ text: this.$t('assumption'), value: 'assumption' },
				!this.readOnly && { value: 'actions' },
			].filter(Boolean)
		},
		transportationHeaders() {
			return [
				{
					text: this.$t('attendance-transportation'),
					value: '',
				},
				{
					text: this.$t('transportation-ways'),
					value: 'transportationName',
				},
				{
					text: this.$t('number-of-people'),
					value: 'transportationPeople',
				},
				{
					text: this.$t('add-transportation-fee'),
					value: 'transportationFee',
				},
				{
					text: this.$t('units'),
					value: 'units',
				},
				{
					text: this.$t('co2-emissions-due-to-attendance-transportation'),
					value: 'transportationWayResult',
				},
				{ text: this.$t('assumption'), value: 'assumption' },
				!this.readOnly && { value: 'actions' },
			].filter(Boolean)
		},
		onlineMeetingHeaders() {
			return [
				{
					text: this.$t('online-meeting'),
					value: '',
				},
				{
					text: this.$t('item'),
					value: 'onlineMeetingName',
				},
				{
					text: this.$t('number-of-people'),
					value: 'onlineMeetingPeople',
				},
				{ text: this.$t('time'), value: 'onlineMeetingHour' },
				{
					text: this.$t('units'),
					value: 'units',
				},
				{
					text: this.$t('co2-emissions-due-to-on-line-meeting'),
					value: 'onlineMeetingRoomResult',
				},
				{ text: this.$t('assumption'), value: 'assumption' },
				!this.readOnly && { value: 'actions' },
			].filter(Boolean)
		},
		otherActivityHeaders() {
			return [
				{
					text: this.$t('other-activities'),
					value: '',
				},
				{
					text: this.$t('item'),
					value: 'otherName',
				},
				{
					text: this.$t('activity'),
					value: 'otherPeople',
				},
				{
					text: this.$t('units'),
					value: 'units',
				},
				{
					text: this.$t('co2-emissions-due-to-other-meeting'),
					value: 'otherActivityResult',
				},
				{ text: this.$t('assumption'), value: 'assumption' },
				!this.readOnly && { value: 'actions' },
			].filter(Boolean)
		},
	},
	mounted() {
		this.today = this.currentDate()
	},
	methods: {
		...mapActions(['createEvent', 'updateEvent']),
		barChartOptionsHelper,
		convertToLocaleString,
		currentDate,
		deleteEvent(item, event = '') {
			switch (event) {
				case 'meeting-room':
					console.log('switch::meeting-room')
					this.meetingRooms.data = this.meetingRooms.data.filter(
						(v) => v.meetingRoomId !== item.meetingRoomId
					)
					break
				case 'transportation':
					this.transportations.data = this.transportations.data.filter(
						(v) => v.transportationId !== item.transportationId
					)
					break
				case 'online-meeting':
					this.onlineMeetings.data = this.onlineMeetings.data.filter(
						(v) => v.onlineMeetingId !== item.onlineMeetingId
					)
					break
				case 'other-activity':
					this.others.data = this.others.data.filter(
						(v) => v.otherId !== item.otherId
					)
					break
				default:
					console.log(`unknown event:: ${event}`)
			}
		},
		async submit() {
			this.submitLoading = true
			this.v$.$touch()
			if (this.v$.$error) {
				this.submitLoading = false
				return
			}
			const data = omitEmpties({
				user_id: this.currentUser.id,
				name: this.name,
				event_holder: this.event_holder,
				starting_date: this.starting_date,
				end_date: this.end_date,
				people_in_charge: this.people_in_charge,

				meeting_rooms: this.meetingRooms.data.map((room) => {
					return {
						id: room.meetingRoomId,
						times: room.meetingHour,
						mr_assumption: room?.meetingRoomAssumption,
					}
				}),
				trasportations: this.transportations.data.map((room) => {
					return {
						id: room.transportationId,
						people: Number(room.transportationPeople) || 1,
						fee: room.transportationFee,
						tp_assumption: room?.transportationAssumption,
					}
				}),
				online_meetings: this.onlineMeetings.data.map((room) => {
					return {
						id: room.onlineMeetingId,
						pc: room.onlineMeetingPeople,
						times: room.onlineMeetingHour,
						om_assumption: room?.onlineMeetingAssumption,
					}
				}),
				other_activities: this.others.data.map((room) => {
					return {
						id: room.otherId,
						night: room?.otherHour,
						people: room.otherPeople,
						oa_assumption: room?.otherAssumption,
					}
				}),
			})
			if (this.edit) {
				const [err, res] = await this.updateEvent({
					event_id: this.eventId,
					...data,
				})
				this.submitLoading = false
				if (!err) {
					this.closeDialog()
				}
			} else {
				const [err, res] = await this.createEvent(data)
				this.submitLoading = false
				if (!err) {
					this.closeDialog()
				}
			}
		},
		closeDialog() {
			this.$refs.formRef.reset()
			this.v$.$errors = []
			this.meetingRooms.data = []
			this.transportations.data = []
			this.onlineMeetings.data = []
			this.others.data = []
			this.$emit('close')
		},
		changeRoom(room) {
			console.log('changeRoom ', room)
			this.meetingRoomId = room?.id
			this.meetingRoomName = room?.meeting_room
			this.meetingRoomUnit = room?.unit
			this.meetingRoomElectricityUsage = room?.electicity_parameter
			this.meetingRoomResult =
				this.meetingHour * this.meetingRoomElectricityUsage
		},
		changeTransportationWay(room) {
			console.log('changeTransportation::', room)
			this.transportationId = room?.id
			this.transportationName = room?.transporation_way
			this.transportationUnit = room?.unit

			this.transportationParams = room?.parameter
			this.transportationResult =
				this.transportationParams *
				this.transportationPeople *
				this.transportationFee
		},
		changeOnlineMeetingParams(room) {
			console.log('changeOnlineMeetingParams::', room)
			this.onlineMeetingId = room?.id
			this.onlineMeetingName = room?.item
			this.onlineMeetingParams = room?.parameter
			this.onlineMeetingUnit = room?.unit

			this.onlineMeetingResult =
				this.onlineMeetingParams *
				this.onlineMeetingPeople *
				this.onlineMeetingHour
		},
		changeOtherParams(room) {
			console.log('changeOtherParams::', room)
			this.otherId = room?.id
			this.otherName = room?.meeting_room
			this.otherParams = room?.parameter
			this.otherUnit = room?.unit

			this.otherResult = this.otherParams * this.otherPeople * this.otherHour
		},
		addNewMeetingRoom() {
			if (this.meetingRoomId) {
				this.meetingRooms.data.unshift({
					meetingRoomId: this.meetingRoomId,
					meetingRoomName: this.meetingRoomName,
					meetingHour: this.meetingHour,
					meetingRoomUnit: this.meetingRoomUnit,
					meetingRoomAssumption: this.meetingRoomAssumption,
					meetingRoomResult: this.meetingRoomResult,
				})
				this.meetingRoomId = null
				this.meetingRoomName = ''
				this.meetingHour = 1
				this.meetingRoomElectricityUsage = ''
				this.meetingRoomUnit = ''
				this.meetingRoomAssumption = ''
				this.meetingRoomResult = null
			}
		},
		addTransportation() {
			if (this.transportationId) {
				this.transportations.data.unshift({
					transportationId: this.transportationId,
					transportationName: this.transportationName,
					transportationPeople: this.transportationPeople,
					transportationFee: this.transportationFee,
					transportationUnit: this.transportationUnit,
					transportationAssumption: this.transportationAssumption,
					transportationResult: this.transportationResult,
				})
				this.transportationId = null
				this.transportationName = ''
				this.transportationPeople = 1
				this.transportationFee = 0
				this.transportationUnit = ''
				this.transportationAssumption = ''
				this.transportationParams = null
				this.transportationResult = null
			}
		},
		addOnlineMeeting() {
			if (this.onlineMeetingId) {
				this.onlineMeetings.data.unshift({
					onlineMeetingId: this.onlineMeetingId,
					onlineMeetingName: this.onlineMeetingName,
					onlineMeetingPeople: this.onlineMeetingPeople,
					onlineMeetingHour: this.onlineMeetingHour,
					onlineMeetingUnit: this.onlineMeetingUnit,
					onlineMeetingAssumption: this.onlineMeetingAssumption,
					onlineMeetingResult: this.onlineMeetingResult,
				})
				this.onlineMeetingId = null
				this.onlineMeetingName = ''
				this.onlineMeetingPeople = 1
				this.onlineMeetingHour = 1
				this.onlineMeetingUnit = ''
				this.onlineMeetingAssumption = ''
				this.onlineMeetingParams = null
				this.onlineMeetingResult = null
			}
		},
		addOtherActivity() {
			if (this.otherId) {
				this.others.data.unshift({
					otherId: this.otherId,
					otherName: this.otherName,
					otherPeople: this.otherPeople,
					otherHour: this.otherHour,
					otherUnit: this.otherUnit,
					otherAssumption: this.otherAssumption,
					otherResult: this.otherResult,
				})
				this.otherId = null
				this.otherName = ''
				this.otherAssumption = ''
				this.otherUnit = ''
				this.otherPeople = 1
				this.otherHour = 1
				this.otherParams = null
				this.otherResult = null
			}
		},
	},
	watch: {
		item: {
			deep: true,
			immediate: true,
			handler(v) {
				if (v?.event) {
					this.eventId = v.event.id
					this.assumption = v.event.assumption
					this.name = v.event.name
					this.event_holder = v.event.event_holder
					this.starting_date = v.event.starting_date
					this.end_date = v.event.end_date
					this.people_in_charge = v.event.people_in_charge

					this.meetingRooms.data = v.event.meeting_rooms.map((room) => {
						const mrResult = v.meetingRoom_results.filter(
							(item) =>
								item.id === room.id &&
								JSON.stringify(item.pivot) ===
									JSON.stringify(room.pivot)
						)
						return {
							meetingRoomId: room.id,
							meetingRoomName: room.meeting_room,
							meetingHour: room.pivot.meeting_time,
							meetingRoomAssumption: room.pivot.mr_assumption,
							meetingRoomResult: this._.round(
								mrResult[0].result,
								this.roundValue
							),
							meetingRoomUnit: room.unit,
						}
					})
					this.transportations.data = v.event.transportations.map(
						(room) => {
							const tpResult = v.transportation_results.filter(
								(item) =>
									item.id === room.id &&
									JSON.stringify(item.pivot) ===
										JSON.stringify(room.pivot)
							)
							return {
								transportationId: room.id,
								transportationName: room.transporation_way,
								transportationPeople: room.pivot.no_of_people || 1,
								transportationFee: room.pivot.transportation_fee,
								transportationAssumption: room.pivot.tp_assumption,
								transportationResult: this._.round(
									tpResult[0]?.result,
									this.roundValue
								),

								transportationUnit: room.unit,
							}
						}
					)
					this.onlineMeetings.data = v.event.online_meetings.map(
						(room) => {
							const omResult = v.onlinemeeting_results.filter(
								(item) =>
									item.id === room.id &&
									JSON.stringify(item.pivot) ===
										JSON.stringify(room.pivot)
							)
							console.log('omResult', omResult)
							return {
								onlineMeetingId: room.id,
								onlineMeetingName: room.item,
								onlineMeetingPeople: room.pivot.no_of_pc,
								onlineMeetingHour: room.pivot.times,
								onlineMeetingResult: this._.round(
									omResult[0]?.result,
									this.roundValue
								),
								onlineMeetingAssumption: room.pivot.om_assumption,
								onlineMeetingUnit: room.unit,
							}
						}
					)
					this.others.data = v.event.other_activities.map((room) => {
						console.log('#other_activities::room::', room)
						const oaResult = v.otherActivities_results.filter(
							(item) =>
								item.id === room.id &&
								JSON.stringify(item.pivot) ===
									JSON.stringify(room.pivot)
						)
						return {
							otherId: room.id,
							otherName: room.meeting_room,
							otherPeople: room.pivot.no_of_people || 1,
							otherHour: room.pivot.no_of_nights,
							otherResult: this._.round(
								oaResult[0]?.result,
								this.roundValue
							),
							otherAssumption: room.pivot.oa_assumption,
							otherUnit: room.unit,
							otherPivot: room.pivot,
						}
					})
					// this.initialLoader = false
				}
			},
		},
		meetingRoomId: {
			handler(v) {
				if (this.meetingRoomId) {
					this.meetingRoomResult = this._.round(
						this.meetingHour * this.meetingRoomElectricityUsage,
						this.roundValue
					)
				}
			},
		},
		meetingHour: {
			handler(v) {
				if (this.meetingRoomId) {
					this.meetingRoomResult = this._.round(
						this.meetingHour * this.meetingRoomElectricityUsage,
						this.roundValue
					)
				}
			},
		},

		transportationId: {
			handler(v) {
				if (this.transportationId) {
					this.transportationResult = this._.round(
						this.transportationParams *
							this.transportationPeople *
							this.transportationFee,
						this.roundValue
					)
				}
			},
		},
		transportationPeople: {
			handler(v) {
				if (this.transportationId) {
					this.transportationResult = this._.round(
						this.transportationParams *
							this.transportationPeople *
							this.transportationFee,
						this.roundValue
					)
				}
			},
		},
		transportationFee: {
			handler(v) {
				if (this.transportationId) {
					this.transportationResult = this._.round(
						this.transportationParams *
							this.transportationPeople *
							this.transportationFee,
						this.roundValue
					)
				}
			},
		},

		onlineMeetingId: {
			handler(v) {
				if (this.onlineMeetingId) {
					this.onlineMeetingResult = this._.round(
						this.onlineMeetingParams *
							this.onlineMeetingPeople *
							this.onlineMeetingHour,
						this.roundValue
					)
				}
			},
		},
		onlineMeetingPeople: {
			handler(v) {
				if (this.onlineMeetingId) {
					this.onlineMeetingResult = this._.round(
						this.onlineMeetingParams *
							this.onlineMeetingPeople *
							this.onlineMeetingHour,
						this.roundValue
					)
				}
			},
		},
		onlineMeetingHour: {
			handler(v) {
				if (this.onlineMeetingId) {
					this.onlineMeetingResult = this._.round(
						this.onlineMeetingParams *
							this.onlineMeetingPeople *
							this.onlineMeetingHour,
						this.roundValue
					)
				}
			},
		},

		otherId: {
			handler(v) {
				if (this.otherId) {
					this.otherResult = this._.round(
						this.otherParams * this.otherPeople * this.otherHour,
						this.roundValue
					)
				}
			},
		},
		otherPeople: {
			handler(v) {
				if (this.otherId) {
					this.otherResult = this._.round(
						this.otherParams * this.otherPeople * this.otherHour,
						this.roundValue
					)
				}
			},
		},
		otherHour: {
			handler(v) {
				if (this.otherId) {
					this.otherResult = this._.round(
						this.otherParams * this.otherPeople * this.otherHour,
						this.roundValue
					)
				}
			},
		},
	},
}
</script>

<style lang="scss">
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
	font-size: 13px !important;
}
.meeting-room-table,
.others-table {
	tr td:nth-child(1) {
		width: 10%;
	}
	tr td:nth-child(2) {
		width: 20%;
	}
	tr td:nth-child(3) {
		width: 20%;
	}
	tr td:nth-child(4) {
		width: 10%;
	}
	tr td:nth-child(5) {
		width: 10%;
	}
	tr td:nth-child(6) {
		width: 10%;
	}
}
.transportation-table,
.online-meeting-table {
	tr td:nth-child(1) {
		width: 10%;
	}
	tr td:nth-child(2) {
		width: 20%;
	}
	tr td:nth-child(3) {
		width: 10%;
	}
	tr td:nth-child(4) {
		width: 10%;
	}
	tr td:nth-child(5) {
		width: 10%;
	}
	tr td:nth-child(6) {
		width: 10%;
	}
	tr td:nth-child(7) {
		width: 10%;
	}
}
</style>
