<template>
	<div
		class="base-data-table"
		:style="{
			[`--header-color`]: `${headerColor}`,
			[`--header-text-color`]: `${headerTextColor}`,
			[`--odd-cell-color`]: `${oddCellColor}`,
			[`--even-cell-color`]: `${evenCellColor}`,
		}"
	>
		<v-data-table
			v-bind="$attrs"
			v-on="$listeners"
			class="elevation-0"
			hide-default-header
			hide-default-footer
			disable-sort
			:headers="headers"
			:items="items.data"
			:items-per-page="totalVisible"
		>
			<template #header="{ isMobile, props: { headers } }">
				<!-- HEAD #00235B -->
				<thead v-if="!isMobile" class="v-data-table-header">
					<tr>
						<th
							v-for="header in headers"
							:key="header.value"
							:aria-label="header.text"
							scope="col"
							role="columnheader"
							class="tw-capitalize"
						>
							{{ header.text }}
						</th>
					</tr>
					<!-- SEARCH AREA #E21818-->
					<tr v-if="searchable" class="base-data-table-search">
						<td
							v-for="header in headers"
							:key="header.text"
							class="pa-3 tw-text-center"
						>
							<slot :name="`search:${header.value}`" />
						</td>
					</tr>
				</thead>
			</template>
			<!-- BODY #FFDD83-->
			<template #body="{ items, headers, isMobile }">
				<tbody>
					<template v-for="(item, itemIndex) in items">
						<tr v-if="itemIndex > -1" :key="itemIndex">
							<template v-for="(header, headerIndex) in headers">
								<td
									v-if="header.value !== 'data-table-expand'"
									:key="headerIndex"
								>
									<div
										v-bind="header.attrs"
										:class="[
											header.class,
											`text-${header.align || 'left'}`,
										]"
										:key="header.value"
										:data-header="header.value"
									>
										<!-- INDIVIDUAL DATA CELL #98DFD6-->
										<slot
											:item="item"
											:index="itemIndex"
											:isMobile="isMobile"
											:name="`item.${header.value}`"
										>
											{{ item[header.value] }}
										</slot>
									</div>
								</td></template
							>
						</tr>
					</template>
				</tbody>
			</template>
		</v-data-table>
		<div v-if="!hidePagination">
			<v-pagination v-model="page" class="my-4" :length="max"></v-pagination>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BaseDataTable',
	data() {
		return { page: 1 }
	},

	props: {
		headers: {
			type: Array,
			default: () => [],
		},
		items: {
			type: Object,
			default: () => {},
		},
		headerColor: {
			type: String,
			default: '#a5a5a5',
		},
		headerTextColor: {
			type: String,
			default: '#fff',
		},
		oddCellColor: {
			type: String,
			default: '#e0e0e0',
		},
		evenCellColor: {
			type: String,
			default: '#f0f0f0',
		},
		searchable: {
			type: Boolean,
			default: false,
		},
		hidePagination: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		totalVisible: {
			type: [Number, String],
			default: -1,
		},
	},

	computed: {
		max() {
			const max = Math.ceil(this.items.total / this.totalVisible)
			return !Number.isNaN(max) ? max : 0
		},
	},
	watch: {
		page: {
			handler(v) {
				this.page = v
				this.$emit('paginate', v)
			},
		},
	},
}
</script>

<style lang="scss">
.v-data-table-header {
	background: var(--header-color);
	tr {
		th {
			color: var(--header-text-color) !important;
		}
	}
}
thead {
	tr {
		th {
			border: 3px solid white !important;
			font-size: 18px !important;
		}
	}
}
tbody {
	tr {
		&:nth-child(odd) {
			background-color: var(--odd-cell-color) !important;
		}
		&:nth-child(even) {
			background-color: var(--even-cell-color) !important;
		}
		td {
			font-size: 14px !important;
			color: #000 !important;
			border: 3px solid white !important;
			font-size: 18px !important;
		}
	}
}
</style>
