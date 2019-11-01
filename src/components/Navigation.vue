<template>
<div> 
  
  <nav class="nav" > 

    <div class="menu menuleft">
      <div class="hoveritem"  @click="navigate('Home')">Home</div>
      <div class="hoveritem"  @click="navigate('Shop')">Shop</div>
     
    </div>
    <div class="menu menuright">
      <div class="nameitem" v-show="isLoggedin">Hi {{user.firstname}}</div>
      <div class="hoveritem" v-show="shoppingcart.totalitems > 0" v-on:click="navigate('Checkout')" >Checkout({{shoppingcart.totalitems}})</div>
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Login')" >Login</div>
      <div class="hoveritem"  v-show="isLoggedin" v-on:click="navigate('Logout')" >Logout</div>
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
      shoppingCartItems: 0,
      shoppingcart: {},
      user: {}
    }
  },

firebase () {
      return {
      }
},

mounted() {
    let self = this;
    this.$eventHub.$on('loggedin', ()=> {
       self.fetchUser()
    });

     this.$eventHub.$on('shoppingcart', (shoppingcart)=> {
       self.shoppingcart = shoppingcart
    });
     this.fetchUser()
 },

methods: {

  fetchUser() {
    var currentuser = firebase.auth().currentUser;
    if(currentuser){
      this.isLoggedin = true;
      let self = this
      this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
          self.user = users.val()[key];
        }
      });
    }
  },

  navigate (navPath) {
  
    if(navPath == "Logout")
      {
        let self = this;
        firebase.auth().signOut().then(function() { 
        //console.log('Signed Out');
          alert('You have successfully logged out');
          self.isLoggedin = false;
          self.$router.replace({ name: 'Home'});
          }, 
          function(error) {
            alert(error);
            });
      }

     if(window.location.hash.length > 8 && window.location.hash.substring(2,6) == "shop")
       {
         if(navPath == "Login")
         {
            this.$router.replace({ name: navPath, params: {eventid: window.location.hash.substring(9,9)}});
        }
         else{
           this.$router.replace({ name: navPath});
         }
       }
       else
       if(navPath == "Logout")
       {
         this.$router.replace({ name: 'Login'});
       }
       else
       {
         this.$router.replace({ name: navPath});
         }
       
    }
},
  
}
</script>

<style> 

.nav{
    background-color:rgb(253, 252, 252);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 10;
    height:10vh;
    position: relative;
    text-align: center;

}

 .menu {
  position: relative;
  height:30px;
  width:auto;
  bottom: 0px;
  font-weight: 200;
  font-size: 20px;
  display: flex;
  padding-bottom: 5px;
  flex-direction:row; 
}

.menuleft{
 left:30;
 text-align: left;
 float: left;
 padding-left: 40px;
}

.menuright{
 right:30;
 text-align: right;
 float: right;
 padding-right: 40px;
}

  .spacing { 
    Margin-right: 10px; 
  } 

  .nameitem{
    background-color:transparent;
    color: rgb(65, 63, 63);
    position:relative;
    text-align: right;
    justify-content:center;
    align-content:center;
    padding: 5px;
    bottom:0;
  }

  .hoveritem{
    background-color:transparent;
    color: rgb(65, 63, 63);
    position:relative;
    text-align: right;
    justify-content:center;
    align-content:center;
    padding: 5px;
    bottom:0;
  }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>