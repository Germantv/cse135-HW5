import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import firebase from "firebase/app"
import 'ag-grid-enterprise'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx727cWFOgwNsQKKVoiOJBmmOlHjUGfEM",
  authDomain: "germanflores-cse135-hw5.firebaseapp.com",
  databaseURL: "https://germanflores-cse135-hw5.firebaseio.com",
  projectId: "germanflores-cse135-hw5",
  storageBucket: "germanflores-cse135-hw5.appspot.com",
  messagingSenderId: "872059621102",
  appId: "1:872059621102:web:24cc54e262e91e565d6dff"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let app

firebase.auth().onAuthStateChanged(user => {
  console.log(user)
  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
