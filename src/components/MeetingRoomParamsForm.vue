<template>
	<v-card>
		<v-card-title class="text-h5 grey lighten-2">
			{{ $t('create-parameters') }}
		</v-card-title>

		<v-card-text>
			<v-form ref="formRef">
				<div class="tw-py-3 tw-space-y-3">
					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('meeting-room')"
					>
						<v-text-field
							v-model="form.meeting_room"
							v-on="attrs"
							flat
							solo
							dense
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.meeting_room.$error"
							:error-messages="
								v$.form.meeting_room.$errors.map((v) => v.$message)
							"
						></v-text-field>
					</base-input>
					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('basic-unit-of-electricity-at-the-venue')"
					>
						<v-text-field
							v-model="form.electicity_parameter"
							v-on="attrs"
							flat
							solo
							dense
							type="number"
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.electicity_parameter.$error"
							:error-messages="
								v$.form.electicity_parameter.$errors.map(
									(v) => v.$message
								)
							"
						></v-text-field>
					</base-input>

					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('units')"
					>
						<v-text-field
							v-model="form.unit"
							v-on="attrs"
							flat
							solo
							dense
							hide-details="auto"
							background-color="#E9E8E8"
							:items="units"
							:error="v$.form.unit.$error"
							:error-messages="
								v$.form.unit.$errors.map((v) => v.$message)
							"
						></v-text-field>
					</base-input>
				</div>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="warning" text @click="$emit('cancel')">
				{{ $t('cancel') }}
			</v-btn>
			<v-btn color="success" @click="createNewParam">
				{{ $t('create') }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapActions } from 'vuex'

export default {
	name: 'MeetingRoomParamsForm',
	setup() {
		return { v$: useVuelidate() }
	},
	props: {
		item: {
			type: Object,
			default: null,
		},
		edit: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			form: {
				meeting_room: '',
				electicity_parameter: '',
				other_energy_parameter: '',
				unit: '',
			},
		}
	},

	validations() {
		return {
			form: {
				meeting_room: { required },
				electicity_parameter: { required },
				unit: { required },
			},
		}
	},
	methods: {
		...mapActions([
			'createMeetingRoomParams',
			'fetchMeetingRoomParams',
			'updateMeetingRoomParams',
		]),
		async createNewParam() {
			this.v$.$touch()
			if (!this.v$.$error) {
				const data = {
					meeting_room: this.form.meeting_room,
					electicity_parameter: this.form.electicity_parameter,
					unit: this.form.unit,
				}
				if (this.edit) {
					const [error, response] = await this.updateMeetingRoomParams({
						id: this.item.id,
						...data,
					})
					if (!error) {
						this.$emit('cancel')
					}
				} else {
					const [error, response] = await this.createMeetingRoomParams(
						data
					)
					if (!error) {
						this.$emit('cancel')
						this.fetchMeetingRoomParams()
					}
				}
			}
		},
	},
	watch: {
		item: {
			immediate: true,
			handler(v) {
				if (this.item) {
					this.form = this.item
				}
			},
		},
	},
}
</script>
