<template>
  <div class="shipping">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="addressblock">
          
            <h2>Shipping address</h2>
            <small v-visible="addressInvalid" style="color: red">Your address is not quite right, please check</small><br>
            <small class="addresslabel">Address line 1</small><small style="color: red" v-visible="addressInvalid && user.address.addressline1 == ''">*</small>
            <input type="text" v-model="user.address.addressline1" placeholder="Address line 1" class="addressitem"><br>
            <small class="addresslabel">Address line 2</small>
            <input type="text" v-model="user.address.addressline2" placeholder="Address line 2" class="addressitem"><br>
            <small class="addresslabel">Suburb</small><small style="color: red"  v-visible="addressInvalid && user.address.suburb == ''">*</small>
            <input type="text" v-model="user.address.suburb" placeholder="Suburb" class="addressitem"><br>
            <small class="addresslabel">City</small><small style="color: red"  v-visible="addressInvalid && user.address.city == ''">*</small>
            <input type="text" v-model="user.address.city" placeholder="City" class="addressitem"><br>
            <small class="addresslabel">Country</small><small style="color: red"  v-visible="addressInvalid && user.address.country == ''">*</small>
            <country-select v-model="user.address.country" :country="country" topCountry="ZA" class="addressitem"/><br>
            <small class="addresslabel">Region</small><small style="color: red"  v-visible="addressInvalid && user.address.province == ''">*</small>
            <region-select v-model="user.address.province" :country="user.address.country" :region="region" class="addressitem"/><br>
             <small class="addresslabel">Postal code</small><small style="color: red"  v-visible="addressInvalid && user.address.postalcode == ''">*</small>
            <input type="text" v-model="user.address.postalcode" placeholder="Code" class="addressitem" min="1" max="5" ><br>
           
            <button @click="shippingQuote" class="addressitem">Get shipping quote</button><br>
            <button  v-visible="gotShippingQuote" @click="goToCheckout" class="addressitem">Checkout</button><br>
           
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

  mounted() {

    this.$eventHub.$on('shoppingcart', (shoppingcart)=> {
      self.shoppingcart = shoppingcart
  });
     
 },

 created() {
     const currentUser = firebase.auth().currentUser;
      let cartref = 'jaylashop'
      if(localStorage.getItem(cartref))
      {
          this.shoppingcart = JSON.parse(localStorage.getItem(cartref));
      }
    let self = this
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
        this.$router.replace({ name: 'Checkout', params: {goToCheckout: true}});
      } 
      else
      {
        this.$router.replace({ name: 'Login'});
      }
  },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/shippingstyle.scss";
</style>