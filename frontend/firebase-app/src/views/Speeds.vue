<template>
	<div>
		<h1>Speed Reports</h1>
		<h3>Page Load Time</h3>
		<!--<h5 v-for='speed in speeds' :key="speed.char_id">{{speed.page_load_time}}</h5>-->
		<button @click="getSelectedRows()">Get Selected Rows</button>
		<ag-grid-vue style="width: 33%; height:200px; margin: 0px 5% 0px 35%;"
				class="ag-theme-balham"
				:columnDefs="columnDefs"
				:rowData="speeds"
				rowSelection="multiple"
				@grid-ready="onGridReady"
			></ag-grid-vue>
		<div>
			<bar-chart :chart-data="datacollection" style="margin: 0px 45% 0px 0px; display: inline-block"></bar-chart>
			<line-chart :chart-data="datacollection" style="margin: 0px 0px 0px 75%px; display: inline-block"></line-chart>
		</div>

		<!--
		<div class="small">
			<line-chart :chart-data="datacollection"></line-chart>
			<button @click="fillData()">Randomize</button>
		</div>
		-->
	</div>
</template>

<script>
	import * as firebase from 'firebase/app'
	import 'firebase/auth'
	import { AgGridVue } from 'ag-grid-vue'
	import LineChart from '../LineChart2.js'
	import BarChart from '../BarChart.js'

	export default {
		data() {
			return{
				speeds: '',
				columnDefs: null,
				gridApi: null,
				columnApi: null,
				datacollection: null
			}
		},
		components: {
			AgGridVue,
			LineChart,
			BarChart
		},
		methods: {
			getSelectedRows() {
				const selectedNodes = this.gridApi.getSelectedNodes()
				const selectedData = selectedNodes.map(node => node.data)
				const selectedDataStringPresentation = selectedData
					.map(node => "Page Load Time: " + node.page_load_time + " | " + "End Load Time: " + node.end_load_time)
					.join(", ")
				alert(`Selected nodes: ${selectedDataStringPresentation}`)
			},
			onGridReady(params) {
				this.gridApi = params.api
				this.columnApi = params.columnApi
			},
		},
		beforeMount() {
			this.columnDefs = [
				{headerName: 'Page Load Time', field: 'page_load_time', sortable: true, filter: true, checkboxSelection: true },
				{headerName: 'End Load Time', field: 'end_load_time', sortable: true, filter: true },
				{headerName: 'Start Time', field: 'start_time', sortable: true, filter: true },
			]
		},
		async mounted() {
			const token = await firebase.auth().currentUser.getIdToken()
			let config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
			this.speeds = await this.$axios.get("https://us-central1-germanflores-cse135-hw5.cloudfunctions.net/api/reports/speed", config)
			this.speeds = this.speeds.data
		}
	}
</script>

<style lang="scss" scoped>
	.small {
		max-width: 600px;
		margin:  50px auto;
	}
</style>