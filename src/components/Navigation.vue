<template>
<div> 
   
  <nav v-if="!isHome" class="nav" :style="getBarColorStyle()"
        v-on:mouseleave="isHover = false"
       v-on:mouseover="isHover = true"> 
    <div class="dropdown hoveritem"
      v-on:mouseleave="showLeftMenu = false "
       v-on:mouseover="showLeftMenu = true">
      <div class="menuicon" >
          <img src="../assets/menu.svg"  alt="cart"  class="cartimage" :style="getColorStyle(showLeftMenu)"/>

      </div>
        <transition name="slide">
          <div v-if="showLeftMenu" class="dropdown-content left">
              <a  v-on:click="navigate('Shop',true)" >SHOP</a>
              <!-- <a  v-on:click="navigate('Artists')">ARTISTS</a> -->
              <a  v-on:click="navigate('About', true)">ABOUT</a>
              <a  v-on:click="navigate('Contact', true)">CONTACT</a>
          </div> 
      </transition>    
    
    </div>
    <div class="hoveritem">
      <div class="menuicon" >
        
      </div>
    </div>
  
    <!-- <div class="hoveritem">Two</div> -->
    <div class="center hoveritem">
        <img  class="logo" src="../assets/sitelogo.png"  alt="cart"  @click="navigate('Shop')" :style="getLogoColorStyle()"/>
    </div>

    <div class="hoveritem">
      <div class="menuicon" 
       v-on:mouseleave="cartIconHover = false"
       v-on:mouseover="cartIconHover = true">
        <img src="../assets/cart.svg"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage" :style="getColorStyle(cartIconHover)"/>
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
      </div>
    </div>

    <div class="dropdown  hoveritem"
       v-on:mouseleave="showRightMenu = false"
       v-on:mouseover="showRightMenu = true">
      <div class="menuicon">
            <img src="../assets/user.svg"  alt="cart"  class="cartimage" :style="getColorStyle(showRightMenu)"/>
           </div>
        <transition  name="slide">
          <div v-if="showRightMenu" class="dropdown-content right" >
            <a v-show="!isLoggedin" v-on:click="navigate('Login', false)">LOGIN</a>
            <a v-show="!isLoggedin" v-on:click="navigate('Signup', false)">REGISTER</a>
            <a v-show="isLoggedin" v-on:click="navigate('Logout', false)">LOGOUT</a>
        </div>
        </transition>    
    </div>

     <div class="thinline" :style="getBarDividerColorStyle()"/>
  
   </nav>
 </div>
</template>

<script>

 import firebase from '../firebase-config';
 import {  db } from '../firebase-config';
 let usersRef = db.ref('users');
 
export default {
name: 'Navigation',

data() {
    return {
      whiteColor: '#ffffff',
      textColor: '#111111',
     hoverColor: '#111111',  
      unHoverColor: '#6a6a6a',
      lineColor: '#949494' ,
      isLoggedin: false,
      shoppingcart: {},
      user: {},
      totalitems: 0,
      currentuser: null,
      showCart: false,
      showLeftMenu: false,
      showRightMenu: false,
      isHover: false,
       cartIconHover: false,
      }
},

firebase () {
   this.currentuser = firebase.auth().currentUser ;
  return {
   }
},

mounted() {
   if(this.currentuser){
      this.isLoggedin = true
      this.fetchUser()
    }
    if(sessionStorage.getItem('jaylashop'))
    {
        this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
        this.totalitems = this.shoppingcart.totalitems
    }
    let self = this;
    this.$eventHub.$on('loggedin', ()=> {
        self.isLoggedin = true;
         self.currentuser = firebase.auth().currentUser ;
        self.fetchUser()
    });
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
      self.totalitems = total
    });

      this.$eventHub.$on('showCheckout', (show)=> {
         this.showCart = show
      });
  },

  computed: {

   isHome: function () {
     return this.$route.name == "Home"
   }
  },

methods: {


  fetchUser() {
    let self = this
      this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(this.currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
          self.user = users.val()[key];
         }
      });
    
  },

  navigate (navPath, isLeft) {
    if(isLeft){
       this.showLeftMenu = false
    }
    this.showRightMenu = false
   
    if(navPath == this.$route.name)
    return;
     if(navPath == "Logout") {
         let self = this;
         if(self.showCart) {
            self.showCart = false
            self.$eventHub.$emit('showCheckout', self.showCart);
          }
        firebase.auth().signOut().then(function() { 
        //console.log('Signed Out');
          self.$swal('Bye!', 'You have successfully logged out', 'warning') 
          
          self.isLoggedin = false;
          sessionStorage.clear()
          self.$eventHub.$emit('shoppingcarttotal', 0);
          self.$router.replace({ name: 'Home'});
        }, 
        function(error) {
           this.$swal('hmm...', error, 'error') 
          });
        return
      }  
      if(navPath == "Login" || navPath == "Register") {

        if(this.showCart) {
          this.showCart = false
          this.$eventHub.$emit('showCheckout', this.showCart);
        }
         this.$router.push({ name: navPath});
        return
      }
       if(navPath == "ShoppingCart") {
        if (this.totalitems == 0) {
          this.$router.push({ name: 'Shop'});
        } else {
          this.showCart = !this.showCart
          this.$eventHub.$emit('showCheckout', this.showCart);
        } 
        return
      }
        this.$router.push({ name: navPath});
   },

    getBarColorStyle: function () {
         return  {
         'background-color':  this.isHover ? this.whiteColor : this.$route.name == "Home" && !this.showCart  ? 'transparent' : this.whiteColor,
        'transition': 'background-color 200ms ease-in'
         }
     },

     getBarDividerColorStyle: function () {
         return  {
         'background-color':  this.isHover ? this.lineColor : this.$route.name == "Home" && !this.showCart ? this.whiteColor : this.lineColor,
        'transition': 'background-color 200ms ease-in'
         }
     },

     getColorStyle: function(iconHover) {
         return  {
        //  'filter': iconHover ? 'invert(0.1)' :
        //   this.isHover ? 'invert(0.5)' : 
        //   this.$route.name == "Home" && !this.showCart ? 'invert(1)' : 'invert(0.5)',
          'filter': iconHover ? 'invert(1)' : 'invert(0.01)'
   
        }
     },

     getLogoColorStyle: function(iconHover) {
         return  {
         'filter':  this.isHover ? 'invert(0)' : 
          this.$route.name == "Home" && !this.showCart ? 'invert(1)' : 'invert(0)',
         
        }
     },
},
  
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/commonstyle.scss";
    @import "~@/styles/navigationstyle.scss";
  </style>
