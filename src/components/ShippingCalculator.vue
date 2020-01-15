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
     
         <div v-if="isDone" >
           <h2>Delivery information</h2>
           <h4 v-if="!isInternational">Courier: {{courier.CarrierName}} </h4>
           <h4 v-if="!isInternational">Delivery time: {{hoursToDays(courier.DeliveryTimeHours)}} days</h4>
           <h4 v-if="!isInternational">Delivery fee: R {{courier.TotalCostPlusMarkup}} </h4>
           <h4 v-if="isInternational">Delivery fee: {{shippingFee}} </h4>
           <h5 v-if="isInternational">IMPORTANT!! YOUR COUNTRY MAY CHARGE YOU LOCAL CUSTOM DUTY</h5>
         </div>
        </transition>
      </div>
 
</template>

<script>
 import qs from "qs";
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  const ratesRef = db.ref('rates')
export default {
  name: 'ShippingCalculator',

  data() {
    return {
      isInternational: false,
      zones: [],
      rates: [],
      isDone: false,
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
   this.createZones()
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
      if (this.shoppingcart.user.address.country == "South Africa") {
          this.getDeliveryQuote()
      } else {
        this.isInternational = true
        let self = this
        this.$rtdbBind('rates', ratesRef).then(rates => {
            self.rates === rates
            let rateKey  =  self.getCountryShippingZone(self.shoppingcart.user.address.country)
            let rate  = self.rates.find(rate => {
            let key = rate['.key']
              if (key == rateKey) return rate
            });
            self.calculateInternationalShippingFee(rate, self)
            self.loader.hide()
            self.isLoading = false
      });
    }

    this.loader = this.$loading.show({
                loader: 'dots',
                  color: 'blue'
      });  
   
},

 computed: {

    shippingFee: function() {
        return 'R ' + String(this.shoppingcart.deliveryfee.toFixed(2))
    },
  
   },

  methods: {

   getCountryShippingZone (country) {
    if (this.zones.hasOwnProperty(country)) {
        return this.zones[country];
    } else {
        return country;
    }
  },

    getInternationalShippingFee(self) {
      let rateKey  =  self.zones[self.shoppingcart.user.address.country].value
       let rate  = Object.keys(self.rates).find(ratekey => {
       
         if (ratekey == rateKey) return self.rates[ratekey]
      });
        self.calculateInternationalShippingFee(rate)
    },

    calculateInternationalShippingFee(rate, self) {
      var fee = 0;
      self.shoppingcart.items.forEach(item => {
          if (item.weight < 0.5) {
            fee += item.number * rate.base
          } else if (item.weight > 0.5 && item.weight <= 1) {
             fee += item.number * rate.base1
          }  else if (item.weight > 1 && item.weight <= 2) {
             fee += item.number * rate.base2
          } else if (item.weight > 2 && item.weight <= 5) {
             fee += item.number * rate.base5
          } else  {
             fee += item.number * rate.base * 0.75
          }
      })
      self.shoppingcart.deliveryfee = fee
       localStorage.setItem('jaylashop', JSON.stringify(self.shoppingcart));
      self.$eventHub.$emit('fee', self.shoppingcart.deliveryfee);
      self.isDone = true
   },

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

    hoursToDays: function(numberOfHours) { 
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
          self.isDone = true
        })
        .catch(e => {
          debugger
           self.isLoading = false
           self.loader.hide()
           alert("There was a problem calculating the delivery fee")
        })

    },

    createZones() {
this.zones = { "Botswana": "A",
 "Namibia": "B",
  "UK": "D",
   "USA": "G",
    "India": "H",
    "Australia": "J",
    "New Zealand": "J",
     "China": "J",
     "Andorra": "F",
     "Austria": "F",
     "Belgium": "F",
      "Denmark": "F",
       "Finland": "F",
       "France": "F",
        "Germany": "F",
         "Greece": "F",
          "Iceland": "F",
          "Ireland": "F",
          "Italy": "F",
           "Liechtenstein": "F",
            "Luxemborg": "F",
             "Malta": "F",
              "Monaco": "F",
               "Netherlands": "F",
                "Norway": "F",
                 "Portugal": "F",
                  "San Marino": "F",
                   "Spain": "F",
                    "Sweden": "F",
                    "Switzerland": "F",
                     "Turkey": "F",
                     "Bulgaria": "L",
                      "Czech Republic": "L",
                      "Hungary": "L",
                       "Poland": "L",
                       "Romania": "L",
                        "Russia": "L",
                        "Slovakia": "L",
                         "Belarus": "L",
                         "Moldova": "L",
                          "Ukraine": "L"}
    }

  },
};

</script>

<style lang="scss" scoped>
     @import "~@/styles/commonstyle.scss";
</style>

