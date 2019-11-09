<template>
  <div class="shipping">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="addressblock">
          
            <h2>Delivery</h2>
            
             <small class="addresslabel">First name</small>
            <h5  class="infoblockitem">{{ user.firstname}} </h5><br>
             <small class="addresslabel">Surname</small>
            <h5  class="infoblockitem">{{ user.surname}} </h5><br>
            <small class="addresslabel">Email</small>
            <h5  class="infoblockitem">{{ user.email}} </h5><br><br>

              <small class="addresslabel">Address line 1</small>
            <h5  class="infoblockitem">{{ user.address.addressline1}} </h5><br>
              <small class="addresslabel">Address line 2</small>
            <h5  class="infoblockitem">{{ user.address.addressline2}} </h5><br>
              <small class="addresslabel">Suburb</small>
            <h5  class="infoblockitem">{{ user.address.suburb}} </h5><br>
              <small class="addresslabel">City</small>
            <h5  class="infoblockitem">{{ user.address.city}} </h5><br>
              <small class="addresslabel">Region</small>
            <h5  class="infoblockitem">{{ user.address.region}} </h5><br>
              <small class="addresslabel">Country</small>
            <h5  class="infoblockitem">{{ user.address.country}} </h5><br>
              <small class="addresslabel">Postal code</small>
            <h5  class="infoblockitem">{{ user.address.postalcode}} </h5><br>

            
            <h1>R{{this.shoppingcart.deliveryfee}} </h1>

            <button   @click="getDeliveryFee" class="buttonstyle">calculate delivery fee</button><br>
            <button  v-visible="gotShippingQuote" @click="goToCheckout" class="buttonstyle">continue...</button>
            <button  @click="shopMore" class="buttonstyle">shop more</button>
     
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

  props: {
     user: Object,
   },

   firebase () {
     debugger
     let u = this.$props.user
     const currentUser = firebase.auth().currentUser;
    return {
      user: db.ref('users').orderByChild('uid').equalTo(currentUser.uid).limitToFirst(1), 
      address: addressRef
    }
  },


 data() {
      return {
        busy: true,
        gotShippingQuote: false,
        canGetShippingQuote: false,
        key: '',
        currentuser: null,
        totalitems: 0
      }
    },

  mounted() {
    let self = this
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       self.totalitems = total
       self.gotShippingQuote = self.totalitems > 0
      self.canGetShippingQuote = this.totalitems > 0
    });
 },

 created() {
    
    if(localStorage.getItem('jaylashop'))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
        this.totalitems = this.shoppingcart.totalitems
        this.canGetShippingQuote = this.totalitems > 0
        this.gotShippingQuote = false
    }

    this.currentuser = firebase.auth().currentUser;
    if(this.currentuser) {
        let self = this
        this.$rtdbBind('users', userRef.orderByChild("uid").equalTo(this.currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
            self.user = users.val()[key];
            self.key = key
            self.address = self.user.address
        }
        });
    } 
 },

  methods: {

  shopMore () {
    this.$router.replace({ name: 'Shop'});
  },
      
  getDeliveryFee () {
    this.shoppingcart.deliveryfee = 355
    this.$eventHub.$emit('fee', this.shoppingcart.deliveryfee);
 },

   goToCheckout: function() {

      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * Number(item.price);
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.shipping))
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      this.$router.push({ name: 'Checkout'});
  },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/shippingstyle.scss";
</style>