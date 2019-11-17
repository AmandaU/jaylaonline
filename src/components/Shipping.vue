<template>
  <div class="shipping">

 <div class="container" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
     <div class="mainblock">
       
        <div class="addressblock">
          
            <h1>Delivery</h1>
            
            <h2>Contact details</h2>
            <p>{{ user.firstname}} {{ user.surname}}</p>
            <p >{{ user.email}} </p>
            <p >{{ user.cellphone}} </p><br>

            <h2>Shipping address</h2>
            <p >{{shippingAddress}}</p>
            
            <br>
            <h1  v-show="gotShippingQuote">R {{this.shoppingcart.deliveryfee}} </h1><br>

            <button   @click="getDeliveryFee" class="buttonstyle">calculate delivery fee</button><br>
            <button  v-show="gotShippingQuote" @click="goToCheckout" class="buttonstyle">continue...</button>
            <button  @click="shopMore" class="buttonstyle">shop more</button>
     
         </div>
     
    
     </div> 

     <div class="cartblock">
         <ShoppingCart ></ShoppingCart>
     </div>

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


 data() {
      return {
        busy: true,
        gotShippingQuote: false,
        key: '',
        currentuser: null,
        totalitems: 0
      }
    },

  mounted() {
    let self = this
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       self.totalitems = total
       self.gotShippingQuote = self.shoppingcart.deliveryfee > 0
   });
 },

 created() {
      this.$eventHub.$emit('showCheckout', '');
    if(localStorage.getItem('jaylashop'))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
        this.totalitems = this.shoppingcart.totalitems
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
         }
        });
    } 
 },

   computed: {

      shippingAddress: function()
      {
          let shipaddress = this.user.address.addressline1 + ', '
          shipaddress += this.user.address.addressline2 == '' ? '' : this.user.address.addressline2 + ', '
          shipaddress += this.user.address.suburb + ', ' 
          + this.user.address.region + ', '
          + this.user.address.country + ', '
          + this.user.address.postalcode
          return shipaddress
      },
   },

  methods: {

    shopMore () {
      this.$router.replace({ name: 'Shop'});
    },
        
    getDeliveryFee () {
      this.shoppingcart.deliveryfee = 100 + (this.totalitems * 50) 
      this.$eventHub.$emit('fee', this.shoppingcart.deliveryfee);
      this.gotShippingQuote = true
    },

   goToCheckout: function() {
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * Number(item.price);
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.deliveryfee))
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      this.$router.push({ name: 'Checkout', params: {user: this.user}});
   },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/shippingstyle.scss";
    @import "~@/styles/commonstyle.scss";
</style>