<template>
	<div>
		<h1>Dashboard</h1>
		<div>
			<h2>Reports</h2>
			<router-link to="/reports/speed">Speeds</router-link> |
			<router-link to="/reports/browsers">Browsers</router-link> | 
			<router-link to="/admin">Admin</router-link>
		</div>
		<h2>March 2020 Error Logs</h2>
		<div>
			<line-chart :chart-data="datacollection" style="width:35%; display: inline-block;"></line-chart>
		</div>
	</div>
</template>

<script>
	import LineChart from '../LineChart3.js'
	export default {
		data() {
			return{
				datacollection: null
			}
		},
		components: {
			LineChart,
		},
	}
</script>

<style lang="scss" scoped>

</style>