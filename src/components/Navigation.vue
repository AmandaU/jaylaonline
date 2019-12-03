<template>
<div> 
  
  <nav class="nav" > 

    <div class="menu menuleft">
      <div class="hoveritem right"  @click="navigate('Home')">Home</div>
      <div class="hoveritem right"  @click="navigate('Shop')">Shop</div>
     
    </div>
    <div class="menu menuright">
      <div class="nameitem left" v-show="isLoggedin">Hi {{user.firstname}}</div>
      <div class="cartbox left">
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
       <img src="../assets/shoppingcart.png"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage"/>
       
      </div>
      <!-- <div class="hoveritem" v-show="totalitems > 0" v-on:click="navigate('Checkout')" >Checkout({{totalitems}})</div> -->
      <div class="hoveritem left" v-show="!isLoggedin" v-on:click="navigate('Login')" >Login</div>
      <div class="hoveritem left"  v-show="isLoggedin" v-on:click="navigate('Logout')" >Logout</div>
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
    this.currentuser = firebase.auth().currentUser;
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

<style> 

.nav{
   background-color:rgb(255, 255, 255);
   top: 0;
   left: 0;
   right: 0;
   width: 100vw;
   z-index: 10;
   height: 50px;
   position: relative;
   border-bottom: 1px solid rgb(129, 127, 127);
 }

 .menu {
   height: 100%;
    display: flex;
    margin: 0% auto;
    position: relative;
    flex-direction:row; 
    font-weight: 10;
    font-size: 20px;
   width: auto;
 }

.menuleft{

 text-align: left;
 float: left;
 padding-left: 40px;
}

.menuright{

 text-align: right;
 float: right;
 padding-right: 40px;
}

  .spacing { 
    Margin-right: 15px; 
  } 

  .cartbox {
  position: relative;
  text-align: center;
   width: 200px;
  
}

/* Bottom left text */
.numberbox {
  position: absolute;
  top: 0px;
  right: 0px;
  color:rgb(238, 43, 157)
}
  .cartimage{
   width: 25px;
   height: 25px;
  vertical-align: middle;
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  padding-right:3px;
   cursor: pointer;
 }

 .nameitem{
    background-color:transparent;
    color: rgb(65, 63, 63);
    position:relative;
    text-align: center;
    justify-content:center;
    align-content:center;
    bottom:0;
     padding: 5px;
     width: 200px;
    
 }
 .left {
   border-left: 1px solid rgb(129, 127, 127);
 }

 .right {
   border-right: 1px solid rgb(129, 127, 127);
 }

  .hoveritem{
    background-color:transparent;
    color: rgb(65, 63, 63);
    position:relative;
    text-align: center;
    justify-content:center;
    align-content:center;
    padding: 5px;
    bottom:0;
     width: 200px;
   
  }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>