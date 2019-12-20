<template>
<div> 
  
  <nav class="nav" > 
 
    <div class="menu menuleft">
       <img src="../assets/sitelogo.png"  alt="cart"  @click="navigate('Home')" />
      <!-- <div class="hoveritem"  @click="navigate('Home')">Home</div>
      <div class="verticalBorder" />
      <div class="hoveritem"  @click="navigate('Shop')">Shop</div>
      <div class="verticalBorder" /> -->
      <!-- <div class="hoveritem"  @click="navigate('Artists')">Artists</div>
      <div class="verticalBorder" /> -->
     
    </div>

     <!-- <div class="menu menucenter">
      <img src="../assets/sitelogo.png"  alt="cart"  @click="navigate('Home')" />
    </div> -->
   
   
    <!-- <div class="menu menuright">
       <div class="verticalBorder" />
      <div class="cartbox left">
       <img src="../assets/shoppingcart.png"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage"/>
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
       </div>
        <div class="verticalBorder" />
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Login')" >Login</div>
      <div class="hoveritem"  v-show="isLoggedin" v-on:click="navigate('Logout')" >Logout</div>
    </div> -->

    <div class="menu menuright">
       <div class="verticalBorder" />
      <div class="cartbox left">
        <img src="../assets/shoppingcart.png"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage"/>
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
       </div>
        <div class="verticalBorder" />
       <div class="dropdown">
          <div class="hoveritem"  >menu</div>
         <!-- <button class="dropbtn">menu</button> -->
        <div class="dropdown-content">
          <a v-show="!isLoggedin" v-on:click="navigate('Login')">login</a>
          <a v-show="isLoggedin" v-on:click="navigate('Logout')">logout</a>
          <a  v-on:click="navigate('Shop')">shop</a>
          <a  v-on:click="navigate('Artists')">artists</a>
        </div>
      </div>

    </div>

   


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
      isLoggedin: false,
      shoppingcart: {},
      user: {},
      totalitems: 0,
      currentuser: null,
      showCart: false
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
       
    //  if(window.location.hash.length > 8 && window.location.hash.substring(2,6) == "shop")
    //    {
    //      if(navPath == "Login")
    //      {
    //         this.$router.replace({ name: navPath});
    //      }
    //      else{
    //        this.$router.replace({ name: navPath});
    //      }
      //  }
      //  else
   }
},
  
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/navigationstyle.scss";
  </style>
