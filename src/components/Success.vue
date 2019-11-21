<template>
 
     <div class="container" >
           <div class="payblock">
          <br>
          <h1>Success!!</h1>
          <!-- <cube-spin v-if="isReady"></cube-spin> -->
          <h3>{{message1}}</h3>
          <h3>{{message2}}</h3>
          <h3>{{message3}}</h3>
          <br>
        </div>
   </div>
</template>

<script>
import {zapperConfig} from '../config';
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
//import { sha256, sha224 } from 'js-sha256';

export default {
  name: 'success',

 
  //  props: {
  //      orderid: String,
  //  },

  data() {
      return {
        zapperDetails: zapperConfig,
        payFastRef: "",
        promotion: [],
        order: {},
        isReady: false,
        message1:"",
        message2:"",
        message3:"",
      }
    },

 firebase() {
      return {
           ordersRef: db.ref('orders'),
         }
      },

  computed: {

    userName: function () {
      return this.order.user.firstname + ' ' + this.order.user.surname;
    },
   
    totalItems: function () {
      var total = 0;
      this.order.items.forEach(element => {
        total += element.number;
      });
      return total;
   },

  totalValue: function () {
      var value = 0;
      this.order.items.forEach(element => {
        value += Number(element.number * element.price);
      });
      return value ;
    },
  },

  created(){
    debugger
      var orderid = '';
      var index = window.location.hash.indexOf("=");
      if(index >= 0)
      {
         orderid =  window.location.hash.substring(index+1,window.location.hash.length) ;
      }
 
      if(sessionStorage.getItem(orderid))
      {
         this.order = JSON.parse(sessionStorage.getItem(orderid));
       
           if(this.order.zapperPaymentMethod) {
              this.$nextTick(() => {
                this.getZapperPaymentDetails();
              });
            } else {
              this.order.totalPaid =   String(this.totalValue );
              this.setConfirmationInfo();
            }
      }
      //sessionStorage.clear()
    },

methods: {

    // processPromoCode(promocode)
    // {
    //    this.$bindAsArray(
    //               "promotion",
    //               db.ref('promotions').orderByChild("code").equalTo(promocode).limitToFirst(1) ,
    //               null,
    //               () => {
    //                 let promo = this.promotion[0];
    //                 promo.redeemed += 1;
    //                 this.$firebaseRefs.promotionsRef.child(promo['.key']).child('redeemed').set(promo.redeemed);
    //               }
    //             );
    // },

    createInvoice()
    {
     // this.processPromoCode(this.shoppingcart.promocode);
      // var initials = this.order.user.firstname.substring(0,1).toUpperCase() + this.order.user.surname.substring(0,1).toUpperCase();
      // var ref = initials + Math.random().toString(36).substr(2, 9);
      
     
        this.$firebaseRefs.invoicesRef.push(invoice);
       
    },

    getZapperPaymentDetails()
    {
      let self = this;
      const url = 'https://zapapi.zapzap.mobi/ecommerce/api/v2/merchants/' + this.zapperDetails.merchantId + '/sites/' + this.zapperDetails.siteId + '/payments/' + this.order.zapperPaymentId;
         this.axios.get(
          url,
          {headers: {
           // "status": 'HTTP/1.0 200 OK',
            "siteid": String(this.zapperDetails.siteId),
            "poskey": this.zapperDetails.posKey,
            "posid": this.zapperDetails.posToken,
            "postype": "paatipassports",
            "posversion": "1.0",
            "signature": this.zapperDetails.signature
            }
          }
          )
          .then((response) => {
             if(response.data.statusId == 1)
              {
                var data = response.data.data[0];
                if(!data)return;
                self.order.zapperReference = data.ZapperId;
                self.order.totalPaid = data.PaidAmount;
                self.setConfirmationInfo()
              }
            },
            (error) => { 

            }
          );
    },

    createSecuritySignature: function (posToken,posKey)
    {
     var plainValue =  posToken.concat("&").concat(posKey).toUpperCase();
      var hash =  sha256(plainValue);
      hash = hash.replace("-", "");
      return hash;
    },


    // setTicket ()
    // {
    //    this.shoppingcart.pricebreaks.forEach(pricebreak => {
 
    //      let key = pricebreak['.key'];
    //      const sold = Number(pricebreak.sold) + Number(pricebreak.tickets);
    //      this.$firebaseRefs.pricebreaksRef.child(key).child('sold').set(sold);
    //       for(var holderkey in  pricebreak.ticketHolders )
    //       {
    //         var holder = pricebreak.ticketHolders[holderkey];
           
    //         let ref = this.shoppingcart.event.name.substring(0, 4).toUpperCase() +  Math.random().toString(36).substr(2, 9)
    //         let qrcode = ref + '|' + this.userName + '|' + this.user.email + '|' + holder.name + '|' + holder.email;
            
    //         let ticket = {
    //             ccemail: holder.email ==  ""? "" : this.user.email,
    //             email:  holder.email == ""? this.user.email: holder.email,
    //             holdername:  holder.name == ""? this.userName: holder.name,
    //             buyername:  this.userName,
    //             userid: this.shoppingcart.userid,
    //             eventid: this.shoppingcart.event.id,
    //             eventname: this.shoppingcart.event.name,
    //             from: this.shoppingcart.event.from,
    //             to: this.shoppingcart.event.to,
    //             price: pricebreak.price ,
    //             reference: ref,
    //             qrcode: qrcode,
    //             venuename: this.shoppingcart.event.venuename,
    //             venueaddress: this.shoppingcart.event.venueaddress,
    //             venuelatlong: this.shoppingcart.event.venuelatlong,
    //             used: false
    //           }
    //             this.$firebaseRefs.ticketsRef.push(ticket);
    //         }
    //  });
     
    //     this.setConfirmationInfo();
    //     this.createInvoice();
    //  },

    setConfirmationInfo(){
         const reference = 'Purchase reference number: ' + this.order.reference;
        var total = String(this.totalValue );
        var numberOfTickets = this.totalItems > 1? ' tickets': ' ticket';
        var each = this.totalTickets > 1? ' each': '';
        this.message1 = 'Your purchase from JaylaOnline was successful' ;
        // if(this.shoppingcart.promocode)
        // {
        //   this.message1 += ' You used your promotion code (' + this.shoppingcart.promocode + ') to the value of R' + this.shoppingcart.promotionvalue;
        // }
        this.message2 = 'The total deducted from your account is R ' + this.order.totalPaid + '.00';
        this.message3 = 'We will email you information about your delivery'
        this.$firebaseRefs.ordersRef.push(this.order);
        this.isReady = true;
    },
    
  },
};
</script>

<style lang="scss" scoped>
  // @import "~@/styles/commonstyle.scss";
    @import "~@/styles/checkoutstyle.scss";
  </style>
