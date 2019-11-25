<template>
  <div id="app">
    
    <Navigation ></Navigation>
      <div class="fullpage" >
    
            <transition-expand>
             <div  class="dropdownblocktransition" v-if="showCheckout">
             
               <div class="shoppingcartrow" >
                  <span @click="hide" class="hoveritem">hide this</span> 
                  <span @click="gotoCheckout" class="hoveritem">checkout</span>
               </div>
               <ShoppingCart  :showCheckout="showCheckout"></ShoppingCart>
           
            <div class="thinline"/>
          </div>
           </transition-expand>
       
        <keep-alive include="Information,Shipping,Checkout">
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
      // Clean up
      // this.$eventHub.$off('eventimageurl', '');
      
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
          return window.innerWidth < 800 ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
      },

      hide() {
        this.$eventHub.$emit('showCheckout', false);
      },

      gotoCheckout () {
        this.$router.push({ name: 'Information'});
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