<template>
<div> 
  
  <nav class="nav" > 
 
    <div class="menu menuleft">
      <div class="hoveritem"  @click="navigate('Home')">Home</div>
      <div class="verticalBorder" />
      <div class="hoveritem"  @click="navigate('Shop')">Shop</div>
      <div class="verticalBorder" />
      <!-- <div class="hoveritem"  @click="navigate('Artists')">Artists</div>
      <div class="verticalBorder" /> -->
     
    </div>

     <div class="menu menucenter">
      <img src="../assets/sitelogo.png"  alt="cart"  @click="navigate('ShoppingCart')" />
    </div>
   
   
    <div class="menu menuright">
       <div class="verticalBorder" />
      <div class="cartbox left">
       <img src="../assets/shoppingcart.png"  alt="cart"  @click="navigate('ShoppingCart')" class="cartimage"/>
        <small class="numberbox" v-visible="totalitems > 0">{{totalitems}}</small>
       </div>
        <div class="verticalBorder" />
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

<style> 

.nav{
   top: 0;
   left: 0;
   right: 0;
   width: 100vw;
   z-index: 10;
   height: 50px;
   position: relative;
   width: 100%;
   display: flex;
   flex-direction:row; 
  
 }

 
 .menu {
   height: 100%;
   display: flex;
   margin: 0% auto;
   position: relative;
   flex-direction:row; 
    align-items: center;
   justify-content: space-between;
   font-weight: 10;
   font-size: 20px;
   width: 100%;
   
 }

.menuleft{
   text-align: center;
   justify-content: flex-start;
   float: left;
     border-left: 1px solid rgb(160, 159, 159);
       border-top: 1px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
}

.menuright{
  text-align: center;
  float: right;
  justify-content: flex-end;
  right:0;
  border-right: 1px solid rgb(160, 159, 159);
    border-top: 1px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
}

.menucenter{
  float:none;
  text-align: center;
  justify-content:center;
  display: flex;
}

.menucenter img {
   height: 100%;
  width: auto;
}

.spacing { 
  Margin-right: 15px; 
} 

 .verticalBorder {
   height: 100%;
   border-left: 1px solid rgb(160, 159, 159);
 }

.menuitem, .cartbox, .nameitem, .hoveritem {
   position: relative;
  text-align: center;
   width:200px;
 }

 .cartbox {
  color:transparent;
 }

/* Bottom left text */
.numberbox {
  position: relative;
  margin-top: 0px;
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
    justify-content:center;
    align-content:center;
    bottom:0;
   }

.hoveritem{
    background-color:transparent;
    color: rgb(65, 63, 63);
    justify-content:center;
    align-content:center;
 }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }

  @media (max-width: 800px) {
  .nav{
    background-color:rgb(255, 255, 255);
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    z-index: 10;
    height: 100px;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction:column; 
     }

    .menuitem, .cartbox, .nameitem, .hoveritem {
   position: relative;
  text-align: center;
   width:50%;
 }

  .menucenter{
   display: none
  }

  .menuleft {
    float: bottom;
    text-align: center;
    justify-content: flex-start;
    border-right: 1px solid rgb(160, 159, 159);
      border-top: 1px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
  }

  .menuright{
    float: bottom;
    text-align: center;
    justify-content: flex-start;
    border-right: 1px solid rgb(160, 159, 159);
      border-top: 0px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
   }
    
}

@media (max-width: 600px) {
.nav{
    background-color:rgb(255, 255, 255);
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    z-index: 10;
    height: 100px;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction:column; 
     }

  .menucenter{
   
   display: none;
  }

  .menuleft {
    float: bottom;
    text-align: center;
    justify-content: flex-start;
    border-right: 1px solid rgb(160, 159, 159);
      border-top: 1px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
  }

  .menuright{
    float: bottom;
    text-align: center;
    justify-content: flex-start;
    border-right: 1px solid rgb(160, 159, 159);
      border-top: 0px solid rgb(160, 159, 159);
   border-bottom: 1px solid rgb(160, 159, 159);
   }

   .menuitem, .cartbox, .nameitem, .hoveritem {
   position: relative;
  text-align: center;
   width:50%;
 }

}

</style>