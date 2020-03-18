<template>
	<div>
		German Flores - Reporter Engine
		<form @submit.prevent="pressed">
			<div class="login">
				<input type="email" placeholder="login" v-model="email">
			</div>
			<div class="password">
				<input type="password" placeholder="password" v-model="password">
			</div>
			<button type="submit">Login</button>
		</form>
		<div class="error" v-if="error">{{error.message}}</div>
	</div>
</template>

<script>
	import * as firebase from "firebase/app"
	import "firebase/auth"

	export default {
		data() {
			return {
				email: '',
				password: '',
				error: ''
			}
		},
		methods: {
			async pressed() {
				try{
					const loginVal = await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
					console.log(loginVal)
					this.$router.replace({name: "Dashboard"})
				} catch(err) {
					console.log(err)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
div {
	color: inherit;
}
input {
	width: 400px;
	padding: 30px;
	margin: 20px;
	font-size: 21px;
}
button {
	width: 400px;
	height: 75px;
	font-size: 100%;
}
.error {
	color: red;
}
</style>