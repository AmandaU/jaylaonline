<template>
<div> 
   
  <nav class="nav" :style="getBarColorStyle()"
        v-on:mouseleave="isHover = false"
       v-on:mouseover="isHover = true"> 
    <div class="dropdown hoveritem"
      v-on:mouseleave="showLeftMenu = false "
       v-on:mouseover="showLeftMenu = true">
      <div class="menuicon" >
          <img src="../assets/menu.svg"  alt="cart"  class="cartimage" :style="getColorStyle(showLeftMenu)"/>

      </div>
          <transition   name="slide">
        <div v-if="showLeftMenu" class="dropdown-content left">
            <a  v-on:click="navigate('Shop')" >SHOP</a>
            <a  v-on:click="navigate('Artists')">ARTISTS</a>
            <a  v-on:click="navigate('About')">ABOUT</a>
            <a  v-on:click="navigate('Contact')">CONTACT</a>
        </div> 
      </transition>    
    
    </div>
    <div class="hoveritem">
      <div class="menuicon" >
        
      </div>
    </div>
  
    <!-- <div class="hoveritem">Two</div> -->
    <div class="center hoveritem"
     v-on:mouseleave="logoIconHover = false"
       v-on:mouseover="logoIconHover = true">
        <img  class="logo" src="../assets/sitelogo.svg"  alt="cart"  @click="navigate('Home')" :style="getColorStyle(logoIconHover)"/>
    </div>

    <div class="hoveritem">
      <div class="menuicon" 
       v-on:mouseleave="cartIconHover = false"
       v-on:mouseover="cartIconHover = true">
        <img src="../assets/shoppingcart.svg"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage" :style="getColorStyle(cartIconHover)"/>
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
      </div>
    </div>

    <div class="dropdown  hoveritem"
       v-on:mouseleave="showRightMenu = false"
       v-on:mouseover="showRightMenu = true">
      <div class="menuicon">
            <img src="../assets/login.svg"  alt="cart"  class="cartimage" :style="getColorStyle(showRightMenu)"/>
           </div>
        <transition   name="slide">
          <div v-if="showRightMenu" class="dropdown-content right" >
            <a v-show="!isLoggedin" v-on:click="navigate('Login')">LOGIN</a>
            <a v-show="!isLoggedin" v-on:click="navigate('Register')">REGISTER</a>
            <a v-show="isLoggedin" v-on:click="navigate('Logout')">LOGOUT</a>
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
      textColor: '#2c2c2c',
     hoverColor: '#2c2c2c',  
    unHoverColor: '#919090', 
      isLoggedin: false,
      shoppingcart: {},
      user: {},
      totalitems: 0,
      currentuser: null,
      showCart: false,
      showLeftMenu: false,
      showRightMenu: false,
      isHover: false,
      logoIconHover: false,
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
    if(localStorage.getItem('jaylashop'))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
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

  navigate (navPath) {
     if(navPath == "Logout") {
        let self = this;
        firebase.auth().signOut().then(function() { 
        //console.log('Signed Out');
          alert('You have successfully logged out');
          self.isLoggedin = false;
          localStorage.clear()
          self.$eventHub.$emit('shoppingcarttotal', 0);
          self.$router.replace({ name: 'Home'});
        }, 
        function(error) {
          alert(error);
        });
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
         'background-color':  this.isHover ? 'white' : this.$route.name == "Home" ? 'transparent' : 'white',
        'transition': 'background-color 200ms ease-in'
         }
     },

     getBarDividerColorStyle: function () {
         return  {
         'background-color':  this.isHover ? this.unHoverColor : this.$route.name == "Home" ? 'white' : this.unHoverColor,
        'transition': 'background-color 200ms ease-in'
         }
     },

     getColorStyle: function(iconHover) {
         return  {
         'filter': iconHover ? 'invert(0.1)' :
          this.isHover ? 'invert(0.5)' : 
          this.$route.name == "Home" ? 'invert(1)' : 'invert(0.5)',
         
       }
     },
},
  
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/commonstyle.scss";
    @import "~@/styles/navigationstyle.scss";
  </style>
