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
