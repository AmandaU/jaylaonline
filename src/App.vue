<template>
  <div id="app">
    
   <Navigation ></Navigation>
    <div class="fullpage" >
            <transition-expand>
             <div  class="dropdownblocktransition" v-if="showCheckout">
               <ShoppingCart  :showCheckout="showCheckout"></ShoppingCart>
               <div class="thinline"/>
          </div>
           </transition-expand>
       
        <keep-alive include="Information,Shipping,Checkout,ShippingCalculator">
          <router-view></router-view>
        </keep-alive>
        <BottomNav></BottomNav>
      </div>
   </div>  
</template>

<script>
import BottomNav from './components/BottomNav'
import Navigation from './components/Navigation'
import ShoppingCart from './components/ShoppingCart'
import TransitionExpand from './components/TransitionExpand'
import firebase from './firebase-config';

export default {
  name: 'app',
  components: {
    'Navigation': Navigation,
    'BottomNav': BottomNav,
    'ShoppingCart': ShoppingCart ,
    'TransitionExpand': TransitionExpand
  },

  data: function () {
  return {
    showCheckout: false
   }
  },

  beforeDestroy: function() {
        
    },

  mounted() {
    
    let self = this;
    this.$eventHub.$on('showCheckout', (show)=> {
      if (self.$route.name == 'Information'
      || self.$route.name == 'Shipping'
      || self.$route.name == 'Checkout') {
       self.showCheckout =  self.isMobile() ? show : false
      } else {
           self.showCheckout = show ;
        }
    });
  },

    methods: {

       isMobile: function() {
       if( navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) )
          {
            return true
          }
           return window.innerWidth < 800
      },

      gotoCheckout () {

        let currentuser = firebase.auth().currentUser;
        if (!currentuser){
        this.$router.push({ name: 'Login', params: {goto: 'Information'}});
        } else{
          this.$router.push({ name: 'Information'});
        }
      },

     enter(element) {
      const width = getComputedStyle(element).width;

      element.style.width = width;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.height = 'auto';

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      // Trigger the animation.
      // We use `setTimeout` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      setTimeout(() => {
        element.style.height = height;
      });
    },

     afterEnter(element) {
      element.style.height = 'auto';
    },

    leave(element) {
      const height = getComputedStyle(element).height;
      
      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      setTimeout(() => {
        element.style.height = 0;
      });
    },
  },
}
 
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
</style>