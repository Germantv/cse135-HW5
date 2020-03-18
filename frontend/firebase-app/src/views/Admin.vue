<template>
	<div>
		<h1>Admin</h1>
		<p><b>User: </b> {{user.email}} </p>
		<!--<h5 v-for='browser in browsers' :key="browser.char_id">{{browser.user_agent}}</h5>-->
		<button @click="getSelectedRows()">Delete Selected Users</button>
		<button><router-link to="/edit/user">Edit User</router-link></button>

		<div style="width: 40%; margin: 0 auto;" v-if="admin">
			<ag-grid-vue style="width: 100%; height:500px;"
				class="ag-theme-balham"
				:columnDefs="columnDefs"
				:rowData="roles"
				rowSelection="multiple"
				@grid-ready="onGridReady"
			></ag-grid-vue>
		</div>
		<div v-else>
			<h1>You do not have access to this data</h1>
			<h3><i>Ask your account manager to update your access settings</i></h3>
		</div>
		
	</div>
</template>

<script>
	import * as firebase from 'firebase'
	import { AgGridVue } from 'ag-grid-vue'
	
	export default {
    data() {
        return {
            roles: [],
			user: null,
			columnDefs: null,
			gridApi: null,
			columnApi: null,
			admin: false
        };
	},
	components: {
		AgGridVue
	},
	async created() {
		const db = firebase.firestore();
		const userID = await firebase.auth().currentUser.uid

		db.collection("roles").doc(userID).get()
			.then((doc) => {
				console.log("roleData: ", doc.data())
				let user = doc.data()
				if(user["role"] == "admin"){
					this.admin = true
				}
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
	},
    methods: {
		async getCurrUser() {
			const db = firebase.firestore();
			const userID = await firebase.auth().currentUser.uid

			db.collection("roles").doc(userID).get()
				.then((doc) => {
					console.log("roleData: ", doc.data())
					let user = doc.data()
					if(user["role"] == "admin"){
						this.admin = true
					}
				})
				.catch((err) => {
					console.log('Error getting documents', err);
				});
		},
		getSelectedRows() {
			const db = firebase.firestore();

			const selectedNodes = this.gridApi.getSelectedNodes()
			selectedNodes.forEach((node) => {
				console.log("NODE:", node.data.uid)
				var userID = node.data.uid
				db.collection("roles").doc(userID).delete()
			})
			alert("REFRESH PAGE TO SEE UPDATED TABLE")

		},
		onGridReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
		}
	},
	beforeMount() {
		this.columnDefs = [
			{headerName: 'Email', field: 'email', sortable: true, filter: true, checkboxSelection: true },
			{headerName: 'Role', field: 'role', sortable: true, filter: true},
			{headerName: 'UID', field: 'uid', sortable: true, filter: true},
			{headerName: 'Account Created', field: 'created', sortable: true, filter: true}
		]
	},
	async mounted() {
		const token = await firebase.auth().currentUser.getIdToken()
		const user = await firebase.auth().currentUser


		let config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		this.roles = await this.$axios.get("https://us-central1-germanflores-cse135-hw5.cloudfunctions.net/api/roles", config)
		
		this.user = user
		this.roles = this.roles.data
	}
};
</script>