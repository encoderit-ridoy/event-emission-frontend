<template>
	<div class="tw-mb-1">
		<div class="tw-w-full tw-flex tw-items-center tw-justify-between">
			<label class="tw-text-black tw-text-sm tw-font-medium">{{
				label
			}}</label>
			<span
				v-if="!hideRequiredStatus"
				class="tw-px-1 tw-text-black tw-text-sm tw-font-normal"
				:class="{
					'tw-bg-orange-500': mandatory,
					'tw-bg-blue-500': !mandatory,
				}"
			>
				{{ mandatory ? `${$t('mandatory')}` : `${$t('optional')}` }}
			</span>
		</div>
		<div class="tw-mt-1">
			<slot
				:on="$listeners"
				:attrs="{
					dense,
					hideDetails: 'auto',

					...$attrs,
				}"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BaseInput',
	props: {
		label: {
			type: String,
		},
		mandatory: {
			type: Boolean,
			default: false,
		},
		dense: {
			type: Boolean,
			default: false,
		},
		hideRequiredStatus: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
