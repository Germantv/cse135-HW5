# CSE135_HW4

## Overview of Auth Code
**backend / fire-token / src / auth.middleware.ts**
- Using Firebase Authentication, Express, NodeJS, TypeScript *(backend only)*, VueJS *(frontend)*
#### Backend Auth Code
```
// Takes away TypeScript error lets me add more properties to req object
interface IRequest extends Express.Request {
	[key: string]: any
}

const getAuthToken = (req: IRequest, _: any, next: any) => {
	// Authorizaion: "Bearer 1232849dkls"
	if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer") {
		// grab token from req header and set it
		req.authToken = req.headers.authorization.split(" ")[1]
	} else {
		req.authToken = null
	}
	next()
}

// check if user is authenticated add this middleWare to get routes
export const checkIfAuthenticated = (req: IRequest, res: Express.Response, next: any) => {
	// calling getAuthToken created above and verifying bearer token 
	getAuthToken(req, res, async () => {
		try {
			const { authToken } = req
			// firebase verifyIdToken 
			const userInfo = await admin.auth().verifyIdToken(authToken)
			req.authId = userInfo.uid
			return next()
		} catch(err){
			return res.status(401).send({error: 'You are not authorized'})
		}
	})
}
```
- The above Authentication code has 2 methods: `getAuthToken` and `checkIfAuthenticated`
  - `getAuthToken` gets called inside `checkIfAuthenticated` which gets used as middleware in my routes where I pull data from Firebase 
#### Frontend Auth/Login Code
**index.js**
```
// Dashboard view protected - requires auth - can't view any view nexted 
// inside dashboard without being authenticated
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {requiresAuth: true}
  },
```
**Login.vue**
```
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
```
## Routing Code
#### Backend
**backend / fire-token / src / index.ts**

My api endpoints are `/reports/browsers` and `/reports/speed` which also match the routing for my Vue endpoint
```
import * as Express from "express"
import * as Cors from "cors"
import * as admin from 'firebase-admin'
import { checkIfAuthenticated } from './auth.middleware'

const app = Express()
const port = 3000

let db = admin.firestore()

app.use(Cors())

app.get("/reports/browsers", checkIfAuthenticated, async (_, res: Express.Response) => {
	db.collection('browsers').get()
		.then((snapshot) => {
			var docsArray: FirebaseFirestore.DocumentData[] = []
			snapshot.forEach((doc) => {
				console.log(doc.id, '=>', doc.data())
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

app.get("/reports/speed", checkIfAuthenticated, async (_, res: Express.Response) => {
	db.collection('speeds').get()
		.then((snapshot) => {
			var docsArray: FirebaseFirestore.DocumentData[] = []
			snapshot.forEach((doc) => {
				console.log(doc.id, '=>', doc.data());
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

app.listen(port, () => console.log("working on port: " + port))
```
#### frontent (SPA)
**frontend / cse135-hw4 / src / router / index.js**
- App launches and goes to http://localhost:8082/ 
	- click login goes to http://localhost:8082/login
	- after user logs in taken to http://localhost:8082/dashboard
	- dashboard has 2 buttons **Speeds** and **Browsers** which take you to http://localhost:8082/reports/speed  and http://localhost:8082/reports/browsers respectively
```
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Speeds from '../views/Speeds.vue'
import Browsers from '../views/Browsers.vue'

import * as firebase from "firebase/app"
import "firebase/auth"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/reports/browsers',
    name: 'Browsers',
    component: Browsers
  },
  {
    path: '/reports/speed',
    name: 'Speeds',
    component: Speeds
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router

```
## Diagram showing PoC examples including their routes
![Diagram](https://github.com/Germantv/CSE135_HW4/blob/master/app-diagram.png)


## Grid Library Used
https://www.ag-grid.com/vuejs-grid/
- Ag Grid was the simplest most robust library I found for VueJS
- Used VueJS for my frontend because after some research I found this would be the easiest framework to work with for *Proof of Concept*
	- Since I am only proving concept and making rough draft of final project, figured VueJS (a simple frontend framework) would be ideal to avoid wasting time trying to learn more complex technologies
- Ag Grid makes it very easy to add **sort**, **search**, and **filter** functionality by simply adding flags to each header object made for your columns
- Ag Grid is easily able to parse json payloads by simply making sure column fields match json keys 
```
// Creating table columns
beforeMount() {
	this.columnDefs = [
		{headerName: 'Page Load Time', field: 'page_load_time', sortable: true, filter: true, checkboxSelection: true },
		{headerName: 'End Load Time', field: 'end_load_time', sortable: true, filter: true },
		{headerName: 'Start Time', field: 'start_time', sortable: true, filter: true },
	]
},
```
```
// Making call to API made on backend with Express
async mounted() {
	const token = await firebase.auth().currentUser.getIdToken()
	let config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	this.speeds = await this.$axios.get("http://localhost:3000/reports/speed", config)
	// here I am setting a speeds variable to the payload received from my api
	this.speeds = this.speeds.data
}
		
```
Creating Grid object and using exported data from <script> tags to populate grid table
```
<ag-grid-vue style="width: 42%; height:200px; margin: 0 30%;"
	class="ag-theme-balham"
	:columnDefs="columnDefs"
	:rowData="speeds"
	rowSelection="multiple"
	@grid-ready="onGridReady"
></ag-grid-vue>
```
![grid screenshot](https://github.com/Germantv/CSE135_HW4/blob/master/grid-vue-filtering.png)	
## Chart Library Used
https://vue-chartjs.org/guide/#introduction
- vue-chartsjs is a wrapper for Chart.js, a popular well known library for charts using JS
- vue-chartsjs makes it easy to make charts by creating a simple component importing objects from the module and configuring some values then simply using the component element in your html vue code to display it
- it has a big community and lots of support and tutorials online - choosing this library was an easy decision considering how flexible and complex it lets us make charts
BarChart.js a component I made importing the module and setting the data from Firebase
- There is a way to pull directly from API but I manually configured data since I wanted to learn the library better
```
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
		//type: 'horizontalBar',
		// data on x-axis
		labels: ['Page Load Time', 'End Load Time', 'Start Time'],
		datasets: [
			{
				//type: 'horizontalBar',
				label: 'Average Load Times',
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
				],
				// data on y-axis
				data: [543, 655, 748, 393, 642, 432, 547, 840, 450, 520, 512, 611],
			}
		],
    })
  }
}
```
**Speeds.vue**
```
<template>
	<div class="small">
		<bar-chart :chart-data="datacollection"></bar-chart>
	</div>
</template>
```
Once Component is imported *(as seen below)* can use it in html *(as seen above)*
```
<script>
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
	BarChart
},
</script
```
![chart screenshot](https://github.com/Germantv/CSE135_HW4/blob/master/chart-vue.png)	
