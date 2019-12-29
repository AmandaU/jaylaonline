<template>
  <!-- <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  > -->
    <div>
       <transition name=" slide-in">
     
         <div v-if="!isLoading" >
           <h2>Delivery information</h2>
           <h4>Courier: {{courier.CarrierName}} </h4>
           <h4>Delivery time: {{hoursToDays(courier.DeliveryTimeHours)}} days</h4>
           <h4>Delivery fee: R {{courier.TotalCostPlusMarkup}} </h4>
         </div>
        </transition>
      </div>
 
</template>

<script>
 import qs from "qs";

export default {
  name: 'ShippingCalculator',

  data() {
    return {
      isLoading: true,
      loader: {},
      shoppingcart: {},
      user: {},
      courier: {},
      authToken: 'a0a06d61fe7ff9f06235476a1af267f6311e6d8d239ba6c95565502ebf29ad04',
      baseUrl: 'https://rush.test.jini.guru/api/v2/'  //https://www.rush.co.za/api/v2/
      
    }
},

created() {

    this.$eventHub.$on('shoppingcarttotal', (totalitems)=> {
        if (totalitems != this.shoppingcart.totalitems) {
          this.isLoading = true
          this.loader.show()
          this.getDeliveryQuote()
        }
    });

    if(localStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
    }

   this.loader = this.$loading.show({
              loader: 'dots',
                color: 'blue'
    });
   this.getDeliveryQuote()
},

 computed: {

      
   
   },

  methods: {

    shippingToAddress: function()
      {
          if(!this.shoppingcart || !this.shoppingcart.user) return ""
          let shipaddress = this.shoppingcart.user.address.addressline1 + '||'
          shipaddress += this.shoppingcart.user.address.addressline2 == '' ? ' ||' : this.shoppingcart.user.address.addressline2 + '||'
          shipaddress += this.shoppingcart.user.address.suburb + '||' 
          + this.shoppingcart.user.address.region + '||'
           + this.shoppingcart.user.address.postalcode
          return shipaddress
      },

      shippingFromAddress: function()
      {
          return '18 Belper Road|| || Wynberg||Western Province||7800'
      },

    hoursToDays: function(numberOfHours)
      { 
          var days=Math.floor(numberOfHours/24);
        var remainder=numberOfHours % 24;
        var hours=Math.floor(remainder);
        var minutes=Math.floor(60*(remainder-hours));
        return days == 0 ? 1 : days
        //return({"Days":Days,"Hours":Hours,"Minutes":Minutes})
      },

 getDeliveryQuote() {

  let self = this;
  let data =  {
         "insurance":false,
       "weight":{
        "0":2,
        "1":2
        },
        "length":{

        "0":5,
        "1":5
        },
        "width":{

        "0":5,
        "1":19
        },
        "height":{

        "0":5,
        "1":67
        },
        "amount":{

        "0":1,
        "1":1
        },
       "pick_up": this.shippingFromAddress(),//"test,test2|| ||ALBERT LUTHULI||BLOEMFONTEIN||9323",
      "sender_name":"JadeAyla",
      "sender_email":"info@jadeayla.com",
      "sender_tel":"",
      "sender_mob":"0828391629",
      "receiver_contact":"testege",
      "receiver_name": this.shoppingcart.user.firstname,
      "receiver_phone":"",
      "receiver_mobile": this.shoppingcart.user.cellphone,
      "receiver_email": this.shoppingcart.user.email,
      "drop_off":  this.shippingToAddress()//"2 ,road||reter||ACTON CABA||TSOMO||5401"
}
  const auth = {
        headers: {'X-Auth-Token': this.authToken,  'Content-Type': 'application/json'} 
    }
       const url = this.baseUrl + 'costComparison';

       this.axios.post(url, data,auth)
       .then(result => {
         debugger
          if(result.statusText == "OK") {
          self.courier = result.data.data.CostComparisonResult.CostComparisonResults.ResultSet.Result
          self.shoppingcart.courier = self.courier
          self.shoppingcart.deliveryfee = Number(self.courier.TotalCostPlusMarkup.replace(',',''))
           localStorage.setItem('jaylashop', JSON.stringify(self.shoppingcart));
          self.$eventHub.$emit('fee', self.shoppingcart.deliveryfee);
         }
          self.isLoading = false
          self.loader.hide()
        })
        .catch(e => {
           self.isLoading = false
           self.loader.hide()
           alert("There was a problem calculating the delivery fee")
        })

    },

  },
};

</script>

<style lang="scss" scoped>
     @import "~@/styles/commonstyle.scss";
</style>

