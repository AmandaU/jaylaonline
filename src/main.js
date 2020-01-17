import Vue from 'vue';
import App from './App.vue';
import router from './router';
import firebase from './firebase-config';
import './styles/fontsandcolors.scss';
//import ExchangeRates from './exchangerates';

let app = ''
Vue.config.productionTip = false

//Vue.prototype.$exchangerates = new ExchangeRates();
Vue.prototype.$eventHub = new Vue(); 

Vue.directive('visible', function(el, binding) {
	el.style.visibility = binding.value ? 'visible' : 'hidden'  ;
});

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
   
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
    
  }
});
