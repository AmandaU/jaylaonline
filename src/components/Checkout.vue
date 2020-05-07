<template>

 <div class="container" style="margin-bottom: 20px">
 
    <div class="mainblock" >
       
        <div class="payblock">
          <h3>CHECKOUT</h3>
          <h4>PAYMENT OPTIONS</h4> <br>
          <!-- <div >Thank you for buying RudeBoyz kit.</div> -->
        
          <div class="payfastcolumn">
            <img src="../assets/PayFastLogo.png"  alt="Payment Methods"  />  <br>
            <div class="payfastlogopack">
              <img src="../assets/PFMethods/bitcoin.png"  alt="Bitcoin"  />  
               <img src="../assets/PFMethods/InstantEFT.png"  alt="PFInstantEFT"  />  
                <img src="../assets/PFMethods/Maestro.png"  alt="Maestro"  />  
                 <img src="../assets/PFMethods/Mastercard.png"  alt="Mastercard"  />  
                  <img src="../assets/PFMethods/Masterpass.png"  alt="masterpass"  />  
                    <img src="../assets/PFMethods/Mobicred.png"  alt="Mobicred"  />  
                      <img src="../assets/PFMethods/SCode.jpg"  alt="SCode"  />  
                        <img src="../assets/PFMethods/VisaElectron.png"  alt="VisaElectron"  /> 
                         <img src="../assets/PFMethods/Visa.png"  alt="Visa"  />   
            </div> <br> <br>
              <a  v-bind:href="payFastUrl"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png"  style="10px; width: 348 ; height: 118" alt="Pay" title="Pay Now with PayFast" /></a>
          </div>

          <br>
          <div id="Zapper" ></div>

      </div>

    </div>
          
      <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>  -->
    <div class="cartblock" v-show="!showCheckout" >
        <ShoppingCart :showCheckout="false"></ShoppingCart>
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
        componentKey: 0,
        showCheckout: false,
        user: {}
      }
    },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
 
  created() {
    window.addEventListener("resize", this.redrawComponent);
    this.$eventHub.$emit('showCheckout', this.isMobile);
    this.showCheckout = this.isMobile

    if(sessionStorage.getItem('jaylashop'))
     {
        this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
     }
    let self = this
    const currentuser = firebase.auth().currentUser;
    if(currentuser) {
      this.$rtdbBind('users', usersRef.orderByChild("uid").equalTo(currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()){
            console.log("snapshot.val" + users.val()[key]);
          self.user = users.val()[key];
        }
      });
    }
   this.loadZapperScript();
   this.saveInvoice()
  },

  watch: {
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
 
    total: function()
    {
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * item.price;
      });
     return theTotal.toFixed(2)
    },

   //Test Environment
    // a computed getter SameSite=None
    payFastUrl: function () {
        const url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + 'Jayla Shopping'
        + '&item_description=merchandise&amount=' + this.shoppingcart.purchasevalue
        + '&return_url=https%3A%2F%2Fjaylashop.web.app%2F%23%2FSuccess%2F%3Forderid%3D' + this.shoppingcart.reference ; 
        + '&cancel_url=https%3A%2F%2jaylashop.web.app%2F%23%Cancel%2F%3Forderid%3D' + this.shoppingcart.reference ; 
        //console.log(url);
        return url;
    },

    //Live Environment
    // a computed getter SameSite=None
    // payFastUrl: function () {
    //     const url =  'https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=12581557&item_name=' + 'Jayla Shopping'
    //     + '&item_description=merchandise&amount=' + this.shoppingcart.purchasevalue
    //     + '&return_url=http%3A%2F%2Fjaylashop.web.app%3A8080%2F%23%2FSuccess%2F%3Forderid%3D' + this.shoppingcart.reference ; 
    //     + '&cancel_url=http%3A%2F%2Fjaylashop.web.app%3A8080%2F%23%Cancel%2F%3Forderid%3D' + this.shoppingcart.reference ; 
    //     //console.log(url);
    //     return url;
    // },

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

     getNow: function() {
                    const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const dateTime = date +' '+ time;
                   return dateTime;
      },

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


    shopMore() {
      this.saveInvoice()
      this.$router.push('Success')
    },

    totalValueForItem: function(item){
      var value = item.number * item.price;
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
        //     sessionStorage.setItem(self.shoppingcart.reference, JSON.stringify(self.shoppingcart));
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
            self.shoppingcart.totalpaid = paymentResult.payment.amountPaid;
            self.shoppingcart.zapperReference = paymentResult.payment.zapperId;
            self.saveInvoice(self); 
            self.$router.replace({ name: 'Success', query: {orderid: self.shoppingcart.reference}});
          } else {
            self.$router.replace({ name: 'Cancel'});
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
      let order = {
          date: instance.getNow(),
          reference: instance.shoppingcart.reference,
          purchasevalue: instance.shoppingcart.purchasevalue,
          items: instance.shoppingcart.items.map(item => {
            return {
              key: item.key,
              productid: item.productid,
              productname: item.productname,
              size: item.size,
              price: item.price,
              number: item.number,
              sku: item.sku,
              dimensions: item.dimensions,
              weight: item.weight
            }
          }),
          totalpaid: instance.shoppingcart.totalpaid,
          totalitems: instance.shoppingcart.totalitems,
          deliveryfee: instance.shoppingcart.deliveryfee,
          courier: instance.courier,
          user: {
            uid: instance.user.uid,
            firstname: instance.user.firstname,
            surname: instance.user.surname,
            email: instance.user.email,
            address: instance.user.address
           },
          zapperPaymentMethod: instance.shoppingcart.zapperPaymentMethod,
          zapperPaymentId: instance.shoppingcart.zapperPaymentId,
          zapperReference: instance.shoppingcart.zapperReference
        };
      
      sessionStorage.setItem(order.reference, JSON.stringify(order));
    },

    saveTicketLocal() {
     //saveInvoice(null)
      // let key = this.shoppingcart.pricebreak['.key'];
      // let totalreserved  = Number(this.shoppingcart.pricebreak.reserved) + Number(this.shoppingcart.pricebreak.tickets);
      // this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      sessionStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
     
     // this.$router.replace({ name: 'Success'});
      this.$router.replace({ name: 'Success', query: {orderref: String(this.shoppingcart.reference)}});
    },

  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  @import "~@/styles/checkoutstyle.scss";
</style>