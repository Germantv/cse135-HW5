<template>
	<div>
		<h2><router-link to="/admin">Back to Admin Page</router-link></h2>
		<label for="uid">
			<span>Enter User ID </span>
		</label>
		<input v-model="uid" placeholder="AK3DFbcEDXmcwjLcbIu7">
		<br>
		<label for="newRole">
			<span>Enter New Role</span>
		</label>
		<input v-model="newRole" placeholder="analyst">

		<button @click="updateUserRole()">Update</button>
		<div v-if="updated">
			<hr>
			<h1>Successfully Updated Document on Firebase!</h1>
			<p>UserID is: {{ uid }}</p>
			<p>Updated Access Level is: {{ newRole }}</p>
		</div>

	</div>
</template>

<script>
import * as firebase from 'firebase'
import 'firebase/auth'

export default {
	data() {
		return{
			uid: '',
			newRole: '',
			updated: false
		}
	},
	components: {

	},
	methods: {
		updateUserRole() {
			console.log("UID: " + this.uid + " --ROLE: " + this.newRole)

			const db = firebase.firestore();

			db.collection("roles").doc(this.uid).update({role: this.newRole})
			this.updated = true
			console.log("upated: " + this.updated)
		}
	},
}
</script>

<style>

</style>