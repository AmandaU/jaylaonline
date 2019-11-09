<template>

  <div class="centralcontainer">
    <div class="mainblock" >
      <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> 
      <div class="infoblock"  >
          <!-- <cube-spin v-if="!isready"></cube-spin> -->
        <div class="shoppingcartblock">
            <h1 >Check out</h1>
            <!-- <h2>R {{shoppingcart.purchasevalue}}</h2> -->
          
            <strong >Thank you for buying RudeBoyz kit.</strong>
            <br>

            <ShoppingCart ></ShoppingCart>
            <br>
        </div>
      </div>

      <div class="payColumn">
        <div class="payfastRow">
            <img src="../assets/PaymentMethods.png"  alt="Payment Methods"   style="margin: 10px;"/>  

              <br> <br>
              <a v-show="isready" @click="saveTicket()"  v-bind:href="payFastUrl"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png"  style="margin: 10px; width: 174 ; height: 59" alt="Pay" title="Pay Now with PayFast" /></a>
                
        </div>

         <br>
          <div id="Zapper" ></div>
      </div>
          
  </div>
 </div>
</template>

<script>

import Media from 'vue-media'
 import ShoppingCart from '../components/ShoppingCart'
import firebase from '../firebase-config';
import {zapperConfig} from '../config';
import {  db } from '../firebase-config';
import md5 from "js-md5";
import qs from "qs";

let usersRef = db.ref('users');

export default {
  name: 'checkout',
  components: {
      'ShoppingCart': ShoppingCart,
      Media
    },

  props: {
    user: Object,
  },

  data() {
      return {
        zapperConfig: zapperConfig,
        merchantId: zapperConfig.merchantId,
        siteId: zapperConfig.siteId,
        isready: false,
        merchantID: '10011455',//'12581557',
        merchantKey: 'ztdbyg14s7nyd',//'49qsjtvgayqaw',//
        greaterThan800: window.innerWidth > 800,
        zapperKey: 0,
        shoppingcart: {},
      }
    },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    console.log('App mounted!');
  },

  created() {
    if(localStorage.getItem('jaylashop'))
     {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
    }
    let self = this
    const currentuser = firebase.auth().currentUser;
    if(currentuser) {
      this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(currentUser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
          self.user = users.val()[key];
        }
      });
    }
   this.loadZapperScript();
  },

  watch: {
  },

  computed: {
 
    isMobile: function()
    {
        return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
    },
    
    total: function()
    {
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * Number(item.price);
      });
     return theTotal.toFixed(2)
    },

   
    // a computed getter
    payFastUrl: function () {
        const url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + 'JadeAyla Online Shopping'
        + '&item_description=tickets&amount=' + this.shoppingcart.purchasevalue
        + '&return_url=https%3A%2F%2Fjayla-tickets.firebaseapp.com%2F%23%2FSuccess%2F%3Fticketref%3D' + this.shoppingcart.reference ; 
        + '&cancel_url=https%3A%2F%2Fjayla-tickets.firebaseapp.com%2F%23%2FCheckout%2F%3Fticketref%3D' + this.shoppingcart.reference ; 
        //console.log(url);
        return url;
    },

    //  zapperUrl: function () {
    //   const qrcode = 'http://2.zap.pe?t=6&i=' + zapperConfig.merchantId + ':' + zapperConfig.siteId +':7[34|' + this.purchasevalue + '|11,66|' + this.shoppingcart.reference +
    //     '|10,60|1:10[38|Paati+Passports,39|ZAR';
    //     const url = 'https://www.zapper.com/payWithZapper?qr=' + qrcode + 
    //     '&appName=Paati+Passports' +
    //     '&successCallbackURL=http%3A%2F%2F192.168.8.103%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.shoppingcart.reference ; 
    //     '&failureCallbackURL=http%3A%2F%2F192.168.8.103%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.shoppingcart.reference ; 
    //     return url;
    // },
  },

  methods: {

    totalValueForItem: function(item){
      var value = Number(item.number * item.price);
      return value == 0? "R 0.00": String('R ' + value + '.00');
    },

    loadZapperV2()
    {
        // const paymentWidget = new zapper.payments.PaymentWidget(
        // "Zapper",
        // {
        //     merchantId: 39547,
        //     siteId: 47945,
        //     amount: 10.50,
        //     reference: "JA12345" 
        // })

        //  const paymentWidget = new zapper.payments.PaymentWidget(
        // "Zapper",
        // {
        //     merchantId: this.zapperConfig.merchantId,
        //     siteId: this.zapperConfig.siteId,
        //     amount: this.purchasevalue,
        //     reference: this.shoppingcart.reference 
        // })

        // paymentWidget.on('payment', ({ status, paidAmount, zapperId, reference }) => {    
        //    self.shoppingcart.zapperPaymentMethod = true;
        //   debugger;
        //   if(status == 1)
        //   {
        //     self.shoppingcart.totalPaid = paidAmount;
        //     self.shoppingcart.zapperPaymentId  = zapperId;
        //     self.shoppingcart.zapperReference = reference;
        //     self.saveTicket(true,self);
        //      self.$router.replace({ name: 'Success', params: {ticketparam: self.shoppingcart.reference}});
        //   }
        //   else
        //   {
        //     self.shoppingcart.zapperPaymentId = zapperId;
        //      self.shoppingcart.zapperReference = reference;
        //     localStorage.setItem(self.shoppingcart.reference, JSON.stringify(self.shoppingcart));
        //     self.$router.replace({ name: 'Cancel', params: {ticketid: self.shoppingcart.reference}});
        //   }
        //})
    },

    loadZapperScript()
    {
      let self = this;
     this.$loadScript("https://code.zapper.com/zapper.js")
      .then(() => {
         zapper("#Zapper", self.merchantId, self.siteId, self.shoppingcart.purchasevalue, self.shoppingcart.reference, function (paymentResult) {
          self.shoppingcart.zapperPaymentMethod = true;
          if(paymentResult.status == 1)
          {
            self.shoppingcart.zapperPaymentId = paymentResult.payment.paymentId;
            self.shoppingcart.totalPaid = paymentResult.payment.amountPaid;
            self.shoppingcart.zapperReference = paymentResult.payment.zapperId;
            self.saveInvoice(self); 
            self.$router.replace({ name: 'Success'});
          }
        });
      })
      .catch(() => {
        // Failed to fetch script
      });
    },

    media800Enter(mediaQueryString) {
      this.greaterThan800 = false
    },

    media800Leave(mediaQueryString) {
       this.greaterThan800 = true
    },

    handleWindowResize(event) { 
      if(window.innerWidth < 600)
      {
        this.containerWidth = event.currentTarget.innerWidth;
      }
      else
      if(window.innerWidth < 800)
      {
        this.containerWidth = event.currentTarget.innerWidth/2;
      }
      else
        this.containerWidth = event.currentTarget.innerWidth/3; 
    },
   
    saveInvoice(instance) {
      if(!instance) instance = this;
     
     // instance.shoppingcart.zapperPaymentMethod = isZapper;
      // let key = instance.shoppingcart.pricebreak['.key'];
      // let totalreserved  = Number(instance.shoppingcart.pricebreak.reserved) + Number(instance.shoppingcart.pricebreak.tickets);
      // instance.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      
      localStorage.setItem(instance.shoppingcart.reference, JSON.stringify(instance.shoppingcart));
    },

    saveTicketLocal(instance) {
     
      // let key = this.shoppingcart.pricebreak['.key'];
      // let totalreserved  = Number(this.shoppingcart.pricebreak.reserved) + Number(this.shoppingcart.pricebreak.tickets);
      // this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      //test
      this.$router.replace({ name: 'Success'});
    },

  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/checkoutstyles.scss";
  </style>