<template>

 <div class="container" :key="componentKey" style="margin-bottom: 20px" >
     
     <div class="mainblock">
       
        <div class="addressblock">
           
            <h3>CONTACT DETAILS</h3>
            <p>{{ shoppingcart.user.firstname}} {{ shoppingcart.user.surname}}</p>
            <p >{{ shoppingcart.user.email}} </p>
            <p >{{ shoppingcart.user.cellphone}} </p><br>

            <h3>SHIPPING ADDRESS</h3>
            <p >{{shippingAddress}}</p>
            
            <br>
            <ShippingCalculator style="width: 100%"></ShippingCalculator>
            
            <button  @click="shopMore" class="buttonstyle">SHOP MORE</button>
            <button  :disabled="!chekoutEnabled"  @click="goToCheckout" class="buttonstyle">CONTINUE</button>
        
         </div>
    
     </div> 

     <div class="cartblock" v-show="!showCheckout">
         <ShoppingCart :showCheckout="false"></ShoppingCart>
     </div>

  </div>
  
</template>

<script>
  import { RepositoryFactory } from '../RepositoryFactory'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import ShoppingCart from '../components/ShoppingCart'
  import ShippingCalculator from '../components/ShippingCalculator'
  //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  const userRef = db.ref('users')
  //const ShippingCalculator = RepositoryFactory.get('couriers')
  export default {
  name: 'shipping',

  components: {
    'ShoppingCart': ShoppingCart ,
    'ShippingCalculator' : ShippingCalculator
  },
 
 data() {
      return {
        chekoutEnabled: false,
        showCheckout: false,
        busy: true,
        key: '',
        currentuser: null,
        totalitems: 0,
        componentKey: 0,
        shoppingcart : {
          items: [],
          deliveryfee: 0,
          user: {
            firstname: '',
            surname: '',
            email: '',
            cellphone: '',
            address: {
              addressline1: '',
              addressline2: '',
              suburb: '',
              city: '',
              region: '',
              country: '',
              postalcode: ''
              }
            }
         }
      
      }
    },

  mounted() {
    let self = this

    this.$eventHub.$on('fee', (fee)=> {
        self.chekoutEnabled = true
        self.shoppingcart.deliveryfee = fee
      });
    
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       self.totalitems = total
        if(sessionStorage.getItem('jaylashop'))
        {
          self.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
        }
   });
 },

  destroyed() {
      window.removeEventListener("resize", this.redrawComponent);
     },

 created() {
     window.addEventListener("resize", this.redrawComponent);
    this.$eventHub.$emit('showCheckout', this.isMobile);
    this.showCheckout = this.isMobile
    if(sessionStorage.getItem('jaylashop'))
    {
        this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
        this.totalitems = this.shoppingcart.totalitems
    }

    this.currentuser = firebase.auth().currentUser;
    if(this.currentuser) {
        let self = this
        this.$rtdbBind('users', userRef.orderByChild("uid").equalTo(this.currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
            self.shoppingcart.user = users.val()[key];
            self.key = key
         }
        });
    } 
 },

   computed: {

       isMobile: function() {
          return window.innerWidth < 800 ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
      },

      shippingAddress: function()
      {
          let shipaddress = this.shoppingcart.user.address.addressline1 + ', '
          shipaddress += this.shoppingcart.user.address.addressline2 == '' ? '' : this.shoppingcart.user.address.addressline2 + ', '
          shipaddress += this.shoppingcart.user.address.suburb + ', ' 
          + this.shoppingcart.user.address.region + ', '
          + this.shoppingcart.user.address.country + ', '
          + this.shoppingcart.user.address.postalcode
          return shipaddress
      },
   },

  methods: {

    redrawComponent() {

      if (window.innerWidth < 800 && !this.showCheckout) {
         this.$eventHub.$emit('showCheckout', '');
         this.showCheckout = true
      } 
      if (window.innerWidth > 800 && this.showCheckout) {
          this.$eventHub.$emit('showCheckout', false);
         this.showCheckout = false
      }
       this.componentKey += 1
    },

    shopMore () {
      this.$router.replace({ name: 'Shop'});
    },
        
    getDeliveryFee () {
      this.shoppingcart.deliveryfee = 100 + (this.totalitems * 50) 
      this.$eventHub.$emit('fee', this.shoppingcart.deliveryfee);
    },

   goToCheckout: function() {
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * item.price;
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.deliveryfee))
      sessionStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      this.$router.push({ name: 'Checkout'});
   },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  @import "~@/styles/shippingstyle.scss";
  
</style>