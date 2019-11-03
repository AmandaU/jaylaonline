<template>
  <div class="login">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="infoblock">
          
            <p>Shipping address</p>
            <small v-visible="addressInvalid" style="color: red">Your address is not quite right, please check</small>
            <input type="text" v-model="user.address.addressline1" placeholder="Address line 1" class="infoblockitem"><br>
            <input type="text" v-model="user.address.addressline2" placeholder="Address line 2" class="infoblockitem"><br>
            <input type="text" v-model="user.address.suburb" placeholder="Suburb" class="infoblockitem"><br>
            <input type="text" v-model="user.address.city" placeholder="City" class="infoblockitem"><br>
            <input type="text" v-model="user.address.province" placeholder="Province" class="infoblockitem"><br>
            <input type="text" v-model="user.address.country" placeholder="Country" class="infoblockitem"><br>
            <input type="text" v-model="user.address.postalcode" placeholder="Code" class="infoblockitem" min="1" max="5"><br>
           
            <button @click="shippingQuote" class="infoblockitem">Get shipping quote</button><br>
            <button  v-visible="gotShippingQuote" @click="goToCheckout" class="infoblockitem">Checkout</button>
         </div>
     
       <ShoppingCart ></ShoppingCart>
     
     </div>
  </div>
</template>

<script>
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import ShoppingCart from '../components/ShoppingCart'
  //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  const userRef = db.ref('users')
  
  export default {
  name: 'shipping',

  components: {
    'ShoppingCart': ShoppingCart 
  },

  //  firebase () {
  //    debugger
  //    const currentUser = firebase.auth().currentUser;
  //   return {
  //     user: db.ref('users').orderByChild('uid').equalTo(currentUser.uid).limitToFirst(1), 
  //     address: addressRef
  //   }
  // },


 data() {
      return {
        busy: true,
        user: null,
        gotShippingQuote: false,
        addressInvalid: false,
        address: null,
        key: ''
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

    let us = this.user
    this.$rtdbBind('users', userRef.orderByChild("uid").equalTo(currentUser.uid).limitToFirst(1)).then(users => {
      for(var key in users.val()){
         console.log("snapshot.val" + users.val()[key]);
        self.user = users.val()[key];
        self.key = key
        self.address = self.user.address
      }
     
    });
 },

  methods: {
      
  shippingQuote ()
  {
    debugger
    if(this.user.address.addressline1 == ''
    || this.user.address.suburb == ''
    || this.user.address.country == '' 
    || this.user.address.postalcode == ''
    || isNaN(this.user.address.postalcode) ) {
        this.addressInvalid = true
        return
    }
    this.addressInvalid = false
    this.gotShippingQuote = true
    this.shoppingcart.shipping = 355
    this.$eventHub.$emit('shoppingcart', this.shoppingcart);
    let user = this.user
    db.ref('users/' + this.key).set(user);

  
  },

   goToCheckout: function() {
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.selected * Number(item.price);
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.shipping))
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