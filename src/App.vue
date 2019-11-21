<template>
  <div id="app">
    
    <Navigation ></Navigation>
      <div class="fullpage" >
      
                  <transition
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave"
                    v-on:before-leave="beforeleave" >

          <!-- <div  class="dropdownblock" v-bind:class="[showCheckout ? 'open' : 'closed']"> -->
             <div  class="dropdownblocktransition" v-if="showCheckout">
             
               <div class="shoppingcartrow" >
                  <span @click="hide" class="hoveritem">hide this</span> 
                  <span @click="gotoCheckout" class="hoveritem">checkout</span>
               </div>
               <ShoppingCart ></ShoppingCart>
           
            <div class="thinline"/>
          </div>
         </transition>
       
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
import Velocity from 'velocity-animate'

export default {
  name: 'app',
  components: {
    'Navigation': Navigation,
    'BottomNav': BottomNav,
     'ShoppingCart': ShoppingCart 
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
    this.$eventHub.$on('showCheckout', ()=> {
       if (self.$route.name == 'Information'
      || self.$route.name == 'Shipping'
      || self.$route.name == 'Checkout') {
        self.showCheckout = false
      } else {
        self.showCheckout = !self.showCheckout;
      }
    });
   
  },

    methods: {

      hide() {
        this.$eventHub.$emit('showCheckout', '');
      },

      gotoCheckout () {
        this.$router.push({ name: 'Information'});
      },

     beforeEnter: function (el) {
       el.style.opacity =  '0'
      el.style.height = '0px'
      el.style.transform = 'translateY(-100%)'
    },

    enter: function (el, done) {
        Velocity(el, { translateY: '0%', height: '100%' ,  opacity: '1'}, { duration: 1000 })
      // Velocity(el, {  height: '100%' ,  opacity: '1'}, { duration: 2000 })
    },
 
   beforeLeave: function (el) {
       el.style.opacity =  '1'
      el.style.height = '100%'
      el.style.transform = 'translateY(0%)'
  },

    leave: function (el, done) {
  // Velocity(el, {  height: '0px' , opacity: 0}, { duration: 600 })
       Velocity(el, { translateY: '-100%', height: '0px' , opacity: 0}, { duration: 600 })
      // Velocity(el, {
      //   translateY: '0%',
      //   height: '100%',
      //   opacity:  1
      // }, { complete: done })

      // Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      // Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      // Velocity(el, {
      //   rotateZ: '45deg',
      //   translateY: '30px',
      //   translateX: '30px',
      //   opacity:  1
      // }, { complete: done })
    },

    
  }
}

 
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>