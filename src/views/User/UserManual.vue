<template>
	<div class="user-manual">
		<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
		<VueEditor
			v-model="content"
			v-if="!initialLoader"
			:disabled="true"
			:editorOptions="editorOptions"
		/>
	</div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'UserManual',
	components: { VueEditor },

	data() {
		return {
			initialLoader: true,
			content: '',
			editorOptions: {
				modules: {
					toolbar: false,
				},
			},
		}
	},
	computed: {
		...mapGetters(['allManuals']),
	},
	async mounted() {
		await this.fetchManualData()
		if (this.allManuals.data.length > 0) {
			this.content = this.allManuals.data[0].content
		}
		this.initialLoader = false
	},

	methods: {
		...mapActions(['fetchManualData']),
	},
}
</script>
<style lang="scss">
.user-manual {
	.ql-container.ql-snow.ql-disabled {
		border: none;
	}
}
</style>
