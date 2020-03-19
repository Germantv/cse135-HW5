# CSE135_HW5

### Hosting live using Firebase Hosting
**https://germanflores-cse135-hw5.firebaseapp.com/**

**CSE135 Grader Account:**
- email: cse135grader@gmail.com
- password: password
	- Admin privileges enabled for this user!

### Stack
#### Frontend
- VueJS
- VueChartJS
- AgGrid Vue
#### Backend 
- Firebase Functions
- Firebase Authentication
- NodeJS
- Express
- FireStore DB

## Overview of Auth Code
**backend / functions / index.js**

#### Backend Auth Code - Index.js Firebase Functions 
## Routing Code
All Routing for backend api happens inside **Index.js**
- Moved backend code to Firebase functions to have it publicly deployed for grading
```
const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

admin.initializeApp(functions.config().firebase);
// Automatically allow cross-origin requests
app.use(cors({ origin: true, credentials: true }));

const db = admin.firestore();


app.get("/roles", (req, res) => {
	db.collection("roles").get()
		.then((snapshot) => {
			var docsArray = []
			snapshot.forEach(doc => {
				console.log(doc.id, "=>", doc.data())
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

app.get("/reports/browsers", (req, res) => {
	db.collection('browsers').get()
		.then((snapshot) => {
			var docsArray = []
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

app.get("/reports/speed", (req, res) => {
	db.collection('speeds').get()
		.then((snapshot) => {
			var docsArray = []
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

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
```
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

#### frontend (SPA)
**frontend / cse135-hw4 / src / router / index.js**
- App launches and goes to http://localhost:8082/ 
	- click login goes to http://localhost:8082/login
	- after user logs in taken to http://localhost:8082/dashboard
	- dashboard has 2 buttons **Speeds** and **Browsers** which take you to http://localhost:8082/reports/speed  and http://localhost:8082/reports/browsers respectively
	- For final project, another button, **Admin** allows admin users to see user table, delete users, and edit users 
		- route: http://localhost:8082/admin
		- http://localhost:8082/edit/user
	- Finally, for Final, added **Profile** button to see your own logins and account information
		- route: http://localhost:8082/profile
```
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Speeds from '../views/Speeds.vue'
import Browsers from '../views/Browsers.vue'
import Admin from '../views/Admin.vue'
import Profile from '../views/Profile.vue'
import EditUser from '../views/EditUser.vue'

import * as firebase from "firebase/app"
import "firebase/auth"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
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
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit/user',
    name: 'EditUser',
    component: EditUser
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  if(requiresAuth && !isAuthenticated) {
    next("/dashboard")
  } else {
    next()
  }
})

export default router


```
## Final Diagram showing All Routes and Views
![Diagram](https://github.com/Germantv/CSE135-HW5/blob/master/final-wireframe.png)


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
![grid screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/grid-vue-filtering.png)	
![grid filter screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/browsers_filter_search.png)	

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
#### Charts in my Vue Project depicting data reports
![chart screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/speeds.png)	
![chart screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/browsers.png)	
![chart screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/dashboard.png)	
![chart screenshot](https://github.com/Germantv/CSE135-HW5/blob/master/profile.png)	

#### Admin Views 
![deleted user](https://github.com/Germantv/CSE135-HW5/blob/master/admin_delete-user.png)	
![edit user](https://github.com/Germantv/CSE135-HW5/blob/master/edit_user.png)	
![success editing user](https://github.com/Germantv/CSE135-HW5/blob/master/success_edit-user.png)	
**Admin View when User is not an Admin**
![not admin view](https://github.com/Germantv/CSE135-HW5/blob/master/not_admin_view.png)	
