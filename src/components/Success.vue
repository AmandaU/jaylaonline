<template>
 
     <div class="container" >
          <!-- <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :on-cancel="onCancel"
            :loader="dots"
            :color="c45adb"
            :is-full-page="fullPage"></loading> -->
           <div class="payblock">
        
            <h2>{{successMessage}}</h2>
            <h3>{{message1}}</h3>
            <h3>{{message2}}</h3>
            <h3>{{message3}}</h3>
            <br>
        </div>
   </div>
</template>

<script>
import 'vue-loading-overlay/dist/vue-loading.css';
import {zapperConfig} from '../config';
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let itemsRef = db.ref('items');

export default {
  name: 'success',

  data() {
      return {
        zapperDetails: zapperConfig,
        payFastRef: "",
        promotion: [],
        order: {},
        successMessage:"",
        message1:"",
        message2:"",
        message3:"",
        isLoading: true,
        loader: {},
        fullPage: true
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
        value += element.number * element.price;
      });
      return value ;
    },
  },
 
  created(){
     this.$eventHub.$emit('showCheckout', false);
      this.loader = this.$loading.show({
              loader: 'dots',
                color: 'grey'
          });
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
                debugger;
                this.getZapperPaymentDetails();
              });
            } else {
              this.order.totalpaid =   String(this.totalValue );
              this.setConfirmationInfo();
            }
      }
      //sessionStorage.clear()
    },



methods: {

  updateItems() {
    this.order.items.forEach(item => {

         this.$rtdbBind('items', itemsRef.orderByKey().equalTo(item.key)).then(items => {
           for(var key in items.val()){
               let fetchedItem = items.val()[key];
                let number = fetchedItem.number - item.number
                itemsRef.child(item.key).child('number').set(number);
            }
          });

      });
   },

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

   // Live : https://api.zapper.com/business/api/v1/merchants/{merchantId}/payments/{zapperId}

    getZapperPaymentDetails()
    {
      let self = this;
      //Test
     // const url = 'https://zapapi.zapzap.mobi/ecommerce/api/v2/merchants/' + this.zapperDetails.merchantId + '/sites/' + this.zapperDetails.siteId + '/payments/' + this.order.zapperPaymentId;
      //Live
      const url = 'https://api.zapper.com/business/api/v1/merchants/' + this.zapperDetails.merchantId + '/sites/' + this.zapperDetails.siteId + '/payments/' + this.order.zapperPaymentId;
   
     debugger
       this.axios.get(
          url,
          {headers: {
            "status": 'HTTP/1.0 200 OK',
           "siteid": String(this.zapperDetails.siteId),
           "poskey": this.zapperDetails.posKey,
           "posid": this.zapperDetails.posToken,
           "postype": "paatipassports",
           "posversion": "1.0",
           "signature": this.zapperDetails.signature,
           "Accept": "application/json"
            }
          }
          )
          .then((response) => {
             if(response.data.statusId == 1)
              {
                debugger;
                var data = response.data.data[0];
                if(!data)return;
                self.order.zapperReference = self.order.zapperPaymentId;
                self.order.totalpaid = data.InvoicedAmount;
                self.currency = data.CurrencyISO
                self.setConfirmationInfo()
              }
            },
            (error) => { 
                self.isLoading = false
               self.loader.hide()
               this.message1 = 'Your purchase from Ifinyela was successful but we could not retrieve the details. Please check your email for details from Zapper' ;
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

    setConfirmationInfo(){
        const reference = 'Purchase reference number: ' + this.order.reference;
        var total = String(this.totalValue );
        this.successMessage = 'Order number: ' + this.order.reference;
        this.message1 = 'Your purchase from Ifinyela was successful' ;
        this.message2 = 'The total deducted from your account is ' + this.order.currency + ' ' + this.order.totalpaid;
        this.message3 = 'We will email you information about your delivery.'
        this.$firebaseRefs.ordersRef.push(this.order);
        this.updateItems()
        this.isLoading = false
         this.loader.hide()
        sessionStorage.clear()
        this.$eventHub.$emit('shoppingcarttotal', 0);
        this.$eventHub.$emit('refreshshoppingcart', true);
    },
    
  },
};
</script>

<style lang="scss" scoped>
   @import "~@/styles/commonstyle.scss";
    @import "~@/styles/checkoutstyle.scss";
  </style>
