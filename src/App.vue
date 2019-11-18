<template>
  <div id="app">
    
    <Navigation ></Navigation>
      <div class="fullpage" >
      
        <transition name="fade">
          <div v-show="showCheckout" class="dropdownblock" >
               <div class="shoppingcartrow" >
                  <span @click="hide" class="hoveritem">hide this</span> <br/> <br/>
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
        this.showCheckout = false;
      },

      gotoCheckout () {
        this.$router.push({ name: 'Information'});
      }
  }
  }

 
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>