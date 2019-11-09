<template>
  <div class="shipping">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="addressblock">
          
            <h2>Delivery</h2>
            
            
            <h5>{{ user.firstname}} </h5>
            
            <p  >{{ user.surname}} </p>
          
            <p >{{ user.email}} </p><br>

            
            <p >{{ user.address.addressline1}} </p>
            
            <p>{{ user.address.addressline2}} </p>
             
            <p >{{ user.address.suburb}} </p>
           
            <p>{{ user.address.city}} </p>
             
            <p>{{ user.address.region}} </p>
              
            <p >{{ user.address.country}} </p>
              
            <p>{{ user.address.postalcode}} </p>

            <br>
            <h1  v-show="gotShippingQuote">R {{this.shoppingcart.deliveryfee}} </h1><br>

            <button   @click="getDeliveryFee" class="buttonstyle">calculate delivery fee</button><br>
            <button  v-show="gotShippingQuote" @click="goToCheckout" class="buttonstyle">continue...</button>
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
    this.currentUser = firebase.auth().currentUser;
    return {
      user: db.ref('users').orderByChild('uid').equalTo(currentUser.uid).limitToFirst(1), 
    }
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

  methods: {

    shopMore () {
      this.$router.replace({ name: 'Shop'});
    },
        
    getDeliveryFee () {

      var fee = 100 
      if(this.totalitems > 5 && this.totalitems < 10) {
        fee = 200
      }
      this.shoppingcart.deliveryfee = this.totalitems * 100 
      this.$eventHub.$emit('fee', this.shoppingcart.deliveryfee);
      this.gotShippingQuote = true
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