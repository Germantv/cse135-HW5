<template>
	<div>
		Logged in
		<span v-if="loggedIn">Yes</span>
		<span v-else>No</span>
		<div>
			<button @click="signOut">Sign Out</button>
		</div>
		<div style="margin: 0px 0px 0px 70%">
			<router-link to="/profile">Profile</router-link>
		</div>
	</div>
</template>

<script>
	import * as firebase from "firebase/app"
	import "firebase/auth"
	
	export default {
		name: "top-header",
		created() {
			firebase.auth().onAuthStateChanged(user => {
				this.loggedIn = !!user

			})
		},
		data() {
			return {
				loggedIn: false
			}
		},
		methods: {
			async signOut() {
				try {
					const data = await firebase.auth().signOut()
					console.log(data)
					this.$router.replace({name: "Login"})
				}catch(err) {
					console.log(err)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>