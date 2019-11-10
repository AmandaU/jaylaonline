/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-dupe-keys */

import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';
import LoadScript from 'vue-plugin-load-script';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/SignUp.vue';
import About from './components/About.vue';
import Information from './components/Information.vue';
import Shipping from './components/Shipping.vue';
import Contact from './components/Contact.vue';
import Checkout from './components/Checkout.vue';
import Success from './components/Success.vue';
import Cancel from './components/Cancel.vue';
import Shop from './components/Shop.vue';
import Product from './components/Product.vue';
import { rtdbPlugin } from 'vuefire';
import vueCountryRegionSelect from 'vue-country-region-select';
import VueTelInput from 'vue-tel-input';


Vue.use(rtdbPlugin)
Vue.use(LoadScript)
Vue.use(vueCountryRegionSelect)
Vue.use(VueTelInput)


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
    path: '/product',
    name: 'Product',
    component: Product,
    props: true,
     props: route => ({
        productid: route.query.productid,
      }),
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
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout,
      // meta: {
      //   requiresAuth: true,
      // },
      props: true,
      // props: route => ({
      //   ticketref: route.query.ticketref,
      // }),
    },
    {
      path: '/information',
      name: 'Information',
      component: Information,
      // meta: {
      //   requiresAuth: true,
      // },
     // props: true,
     },
     {
      path: '/shipping',
      name: 'Shipping',
      component: Shipping,
      // meta: {
      //   requiresAuth: true,
      // },
      props: true,
     },
    {
      path: '/success',
      name: 'Success',
      component: Success,
      props: true,
      props: route => ({
        ticketref: route.query.orderid,
      }),
    },
    {
      path: '/Cancel',
      name: 'Cancel',
      component: Cancel,
      props: true,
      props: route => ({
        ticketref: route.query.orderid,
      }),
    },
   
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
