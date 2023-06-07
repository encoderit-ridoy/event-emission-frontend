<template>
	<div>
		<base-loader v-if="initialLoader" class="tw-m-auto tw-w-fit" />
		<div v-if="!initialLoader">
			<VueEditor
				v-model="content"
				:disabled="isContent"
				:customModules="customModulesForEditor"
				:editorOptions="editorSettings"
			>
			</VueEditor>
			<v-btn
				v-if="!isContent"
				color="red"
				class="tw-mt-3 tw-ml-3"
				text
				:loading="cancelLoading"
				@click="cancel"
				>{{ $t('cancel') }}
			</v-btn>
			<v-btn
				color="green"
				class="tw-mt-3"
				dark
				:loading="editLoading"
				@click="submit"
				>{{ isContent ? $t('edit') : $t('confirmation') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapActions, mapGetters } from 'vuex'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'

export default {
	name: 'AdminManualSetup',
	components: { VueEditor },

	data() {
		return {
			content: '',
			contentId: null,
			initialLoader: true,
			isContent: false,
			editLoading: false,
			cancelLoading: false,
			customModulesForEditor: [
				{ alias: 'imageDrop', module: ImageDrop },
				{ alias: 'imageResize', module: ImageResize },
			],
			editorSettings: {
				modules: {
					imageDrop: true,
					imageResize: {},
				},
			},
		}
	},
	computed: {
		...mapGetters(['allManuals']),
	},
	async mounted() {
		await this.fetchManualData()
		this.initialLoader = false

		if (this.allManuals.data.length > 0) {
			this.isContent = true
			this.content = this.allManuals.data[0].content
			this.contentId = this.allManuals.data[0].id
		}
	},

	methods: {
		...mapActions(['fetchManualData', 'createManual', 'updateManual']),
		async submit() {
			this.editLoading = true

			if (this.isContent) {
				this.isContent = false
				this.editLoading = false

				return
			}
			if (!this.isContent) {
				const [error, response] = await this.updateManual({
					id: this.contentId,
					content: this.content,
				})
				this.editLoading = false
				if (!error) {
					this.isContent = true
				}
			} else {
				const [error, response] = await this.createManual({
					content: this.content,
				})
				this.editLoading = false
				if (!error) {
					this.isContent = true
				}
			}
		},
		async cancel() {
			this.cancelLoading = true
			await this.fetchManualData()
			if (this.allManuals.data.length > 0) {
				this.isContent = true
				this.content = this.allManuals.data[0].content
				this.contentId = this.allManuals.data[0].id
			}
			this.cancelLoading = false
		},
	},
}
</script>
