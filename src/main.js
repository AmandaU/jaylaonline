import Vue from 'vue';
import App from './App.vue';
import router from './router';
import firebase from './firebase-config';


Vue.config.productionTip = false;

let app = ''
Vue.prototype.$eventHub = new Vue(); 

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
   
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
    
  }
});
