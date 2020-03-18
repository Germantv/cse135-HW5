<template>
	<div>
		<h1>Browser Reports</h1>
		<h3>Browser User Agent</h3>
		<!--<h5 v-for='browser in browsers' :key="browser.char_id">{{browser.user_agent}}</h5>-->
		<button @click="getSelectedRows()">Get Selected Rows</button>
		<div style="width: 65%; margin: 0 auto;">
			<ag-grid-vue style="width: 100%; height:300px;"
				class="ag-theme-balham"
				:columnDefs="columnDefs"
				:rowData="browsers"
				rowSelection="multiple"
				@grid-ready="onGridReady"
			></ag-grid-vue>
		</div>
		<div>
			<bar-chart :chart-data="datacollection" style="margin: 0px 40% 0px 0px; display: inline-block;"></bar-chart>
			<pie-chart :chart-data="datacollection" style="margin: 0px 0px 0px 75%px; display: inline-block"></pie-chart>
		</div>
	</div>
</template>

<script>
	import * as firebase from 'firebase/app'
	import 'firebase/auth'
	import { AgGridVue } from 'ag-grid-vue'
	import BarChart from '../BarChart2.js'
	import PieChart from '../PieChart.js'

	export default {
		data() {
			return{
				browsers: '',
				columnDefs: null,
				gridApi: null,
				columnApi: null
			}
		},
		components: {
			AgGridVue,
			BarChart,
			PieChart
		},
		methods: {
			getSelectedRows() {
				const selectedNodes = this.gridApi.getSelectedNodes()
				const selectedData = selectedNodes.map(node => node.data)
				const selectedDataStringPresentation = selectedData
					.map(node => "User Agent: " + node.user_agent)
					.join(", ")
				alert(`Selected nodes: ${selectedDataStringPresentation}`)
			},
			onGridReady(params) {
				this.gridApi = params.api
				this.columnApi = params.columnApi
			}
		},
		beforeMount() {
			this.columnDefs = [
				{headerName: 'User', field: 'userID', sortable: true, filter: true, checkboxSelection: true },
				{headerName: 'User Agent', field: 'user_agent', sortable: true, filter: true},
				{headerName: 'Role', field: 'role', sortable: true, filter: true },
				{headerName: 'Available Width', field: 'available_width', sortable: true, filter: true },
				{headerName: 'Available Height', field: 'available_height', sortable: true, filter: true },
				{headerName: 'Cookies Enabled', field: 'cookies_enabled', sortable: true, filter: true },
			]
		},
		async mounted() {
			const token = await firebase.auth().currentUser.getIdToken()
			let config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
			this.browsers = await this.$axios.get("https://us-central1-germanflores-cse135-hw5.cloudfunctions.net/api/reports/browsers", config)
			this.browsers = this.browsers.data
		}
	}
</script>

<style lang="scss" scoped>

</style>