<template>
<div> 
  
  <nav class="nav" > 

    <div class="menu menuleft">
      <div class="hoveritem"  @click="navigate('Home')">Home</div>
      <div class="hoveritem"  @click="navigate('Shop')">Shop</div>
     
    </div>
    <div class="menu menuright">
      <div class="nameitem" v-show="isLoggedin">Hi {{user.firstname}}</div>
      <div class="hoveritem" v-show="totalitems > 0" v-on:click="navigate('Checkout')" >Checkout({{totalitems}})</div>
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
      shoppingcart: {},
      user: {},
      totalitems: 0
    }
  },

firebase () {
      return {
      }
},

mounted() {
    let currentuser = firebase.auth().currentUser;
     if(currentuser){
       this.isLoggedin = true
     }
    if(localStorage.getItem(currentuser.uid))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem(currentuser.uid));
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

  // fetchUser() {
  //   let currentuser = firebase.auth().currentUser;
  //    if(currentuser){
  //      if(self.shoppingcart) {
  //       self.shoppingcart.userid = currentUser.uid
  //       self.shoppingcart.email = currentUser.email
  //       localStorage.setItem('jaylashop', JSON.stringify(self.shoppingcart));
  //     }
  //     this.isLoggedin = true;
  //     // let self = this
  //     // this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(currentuser.uid).limitToFirst(1)).then(users => {
  //     //   for(var key in users.val()){
  //     //       console.log("snapshot.val" + users.val()[key]);
  //     //     self.user = users.val()[key];
  //     //    }
  //     // });
  //   }
  // },

  navigate (navPath) {
     if(navPath == "Logout")
      {
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
      }
    if(navPath == "Checkout") {
      let currentuser = firebase.auth().currentUser;
      if (!currentuser) {
         self.$router.replace({ name: 'Login',  params: {currentPage: 'Shipping'}});
      } 
      else
      {
        this.$router.replace({ name: 'Shipping'});
      }
      return 
      }
      this.$router.replace({ name: navPath});
    
       
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