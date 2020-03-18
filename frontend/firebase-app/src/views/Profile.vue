<template>
	<div>
		<h1>Profile</h1>
		
		<h2>Name: <i>{{name}}</i></h2>
		<h2>Email: <i>{{email}}</i></h2>
		
		<h3>Role: <i>{{role}}</i></h3>
		<h4><i>Account Created: {{created}}</i></h4>

		<div class="small">
			<line-chart :chart-data="datacollection"></line-chart>
		</div>
	</div>
</template>

<script>
	import * as firebase from 'firebase'
	import 'firebase/auth'
	import LineChart from '../LineChart.js'

	export default {
		data() {
			return{
				name: '',
				created: '',
				email: '',
				role: '',
				datacollection: null
			}
		},
		components: {
			LineChart
		},
		async created() {
			const db = firebase.firestore();
			const userID = await firebase.auth().currentUser.uid

			db.collection("roles").doc(userID).get()
				.then((doc) => {
					console.log("roleData: ", doc.data())
					let user = doc.data()

					this.name = user["name"]
					this.email = user["email"]
					this.created = user["created"]
					this.role = user["role"]
				})
				.catch((err) => {
					console.log('Error getting documents', err);
				});
		},	
		methods: {
		},
		async mounted() {
		}
	}
</script>

<style lang="scss" scoped>
	.small {
		max-width: 600px;
		margin:  50px auto;
	}
</style>