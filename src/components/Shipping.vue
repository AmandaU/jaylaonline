<template>
  <div class="login">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="infoblock">
          
            <p>Shipping address</p>
            <input type="text" v-model="user.addressline1" placeholder="Address line 1" class="infoblockitem"><br>
            <input type="text" v-model="user.addressline2" placeholder="Address line 2" class="infoblockitem"><br>
            <input type="text" v-model="user.suburb" placeholder="Suburb" class="infoblockitem"><br>
            <input type="text" v-model="user.city" placeholder="City" class="infoblockitem"><br>
            <input type="text" v-model="user.province" placeholder="Province" class="infoblockitem"><br>
             <input type="text" v-model="user.country" placeholder="Country" class="infoblockitem"><br>
           
            <button @click="shippingQuote" class="infoblockitem">Get shipping quote</button><br>
             <button  v-visible="gotShippingQuote" @click="goToCheckout" class="buybutton">Checkout</button>
            <!-- <p>or go back to <span @click="goBackToLogin()" style="color:blue;cursor:pointer">login</span></p> -->
          </div>
     </div>
  </div>
</template>

<script>
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
 let usersRef = db.ref('users');
 
 export default {
  name: 'shipping',


  data() {
      return {
         busy: true,
        user: {},
        gotShippingQuote: false
       
      }
    },

created() {
    debugger

    let cartref = 'jaylashop'
    if(localStorage.getItem(cartref))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem(cartref));
    }
    let self = this
    const currentUser = firebase.auth().currentUser;
    this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(currentUser.uid).limitToFirst(1)).then(users => {
      for(var key in users.val()){
          console.log("snapshot.val" + users.val()[key]);
        self.user = users.val()[key];
      }
    });

  },

  methods: {
      
  shippingQuote ()
  {
    
  },

   goToCheckout: function() {
    var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.selected * Number(item.price);
      });
     this.shoppingcart.purchasevalue = theTotal.toFixed(2)
      localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
      if (this.shoppingcart.userid == "")
      {
        this.$router.replace({ name: 'Login', params: {goToCheckout: true}});
      } 
      else
      {
        this.$router.replace({ name: 'Checkout'});
      }
  },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
</style>