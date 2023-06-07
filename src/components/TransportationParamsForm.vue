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
						:label="$t('transportation-ways')"
					>
						<v-text-field
							v-model="form.transporation_way"
							v-on="attrs"
							flat
							solo
							dense
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.transporation_way.$error"
							:error-messages="
								v$.form.transporation_way.$errors.map((v) => v.$message)
							"
						></v-text-field>
					</base-input>
					<base-input
						v-slot="{ attrs }"
						hide-required-status
						:label="$t('transport-parameters')"
					>
						<v-text-field
							v-model="form.parameter"
							v-on="attrs"
							flat
							solo
							dense
							type="number"
							hide-details="auto"
							background-color="#E9E8E8"
							:error="v$.form.parameter.$error"
							:error-messages="
								v$.form.parameter.$errors.map((v) => v.$message)
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
				{{ $t('create') }}</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapActions } from 'vuex'

export default {
	name: 'TransportationParamsForm',
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
				transporation_way: '',
				parameter: '',
				unit: '',
			},
		}
	},

	validations() {
		return {
			form: {
				transporation_way: { required },
				parameter: { required },
				unit: { required },
			},
		}
	},

	methods: {
		...mapActions([
			'createTransportationParams',
			'fetchTransportationParams',
			'updateTransportationParams',
		]),
		async createNewParam() {
			this.v$.$touch()
			if (!this.v$.$error) {
				const data = {
					transporation_way: this.form.transporation_way,
					parameter: this.form.parameter,
					unit: this.form.unit,
				}
				if (this.edit) {
					const [error, response] = await this.updateTransportationParams({
						id: this.item.id,
						...data,
					})
					if (!error) {
						this.$emit('cancel')
					}
				} else {
					const [error, response] = await this.createTransportationParams(
						data
					)
					if (!error) {
						this.$emit('cancel')
						this.fetchTransportationParams({
							page: 1,
							per_page: 10,
						})
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
