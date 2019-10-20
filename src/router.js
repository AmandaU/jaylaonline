/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-dupe-keys */

import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';
//import VueFire from 'vuefire';
//import LoadScript from 'vue-plugin-load-script';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/SignUp.vue';
import About from './components/About.vue';
//import Event from './components/Event.vue';
import Contact from './components/Contact.vue';
// import Checkout from './components/Checkout.vue';
// import Success from './components/Success.vue';
// import Cancel from './components/Cancel.vue';
// import Promoter from './components/Promoter.vue';
// import ManageEvent from './components/ManageEvent.vue';
// import ScanQR from './components/ScanQR.vue';
import Shop from './components/Shop.vue';


import { rtdbPlugin } from 'vuefire'

// const serialize = (snapshot: database.DataSnapshot) => {
//   const value = snapshot.val()
//   // if the value is a primitive, we create an object instead and assign the .value
//   const doc = value == Object(value) ? value : Object.defineProperty({}, '.value', { value })
//   // you could change `.key` by `id` if you want to be able to write
//   Object.defineProperty(doc, '.key', { value: snapshot.key })

//   return doc
// }

Vue.use(rtdbPlugin)



//Vue.use(LoadScript);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'home',
    },
    {
      path: '/',
      redirect: 'home',
     },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/shop',
      name: 'Shop',
      component: Shop
   },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: true,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      props: true,
    },
    {
      path: '/about',
      name: 'About',
      component: About, // () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    // {
    //   path: '/event/:eventid',
    //   name: 'Event',
    //   component: Event,
    // },
    // {
    //   // path: '/checkout/:ticketref',
    //   path: '/checkout',
    //   name: 'Checkout',
    //   component: Checkout,
    //   meta: {
    //     requiresAuth: true,
    //   },
    //   props: true,
    //   props: route => ({
    //     ticketref: route.query.ticketref,
    //   }),
    // },
    // {
    //   path: '/success',
    //   name: 'Success',
    //   component: Success,
    //   props: true,
    //   props: route => ({
    //     ticketref: route.query.ticketref,
    //   }),
    // },
    // {
    //   path: '/Cancel',
    //   name: 'Cancel',
    //   component: Cancel,
    //   props: true,
    //   props: route => ({
    //     ticketref: route.query.ticketref,
    //   }),
    // },
    // {
    //   path: '/Promoter',
    //   name: 'Promoter',
    //   component: Promoter,
    // },
    // {
    //   path: '/ManageEvent',
    //   name: 'ManageEvent',
    //   component: ManageEvent,
    //   props: true,
    //   // props: route => ({
    //   //   event: route.query.event,
    //   // }),
    // },
    // {
    //   path: '/scanqr',
    //   name: 'ScanQR',
    //   component: ScanQR,
    //   meta: {
    //     requiresAuth: true, requiresAdmin: true,
    //   },
    // },
    // {
    //   path: '/merch',
    //   name: 'Merch',
    //   component: Merch,
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) { next('login'); } else {
    next();
  }
});

export default router;

Vue.use(Router);
