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
           <h4>Courier: {{courier.CarrierName}} </h4>
           <h4>Delivery time: {{hoursToDays(courier.DeliveryTimeHours)}} days</h4>
           <h4>Delivery fee: R {{courier.TotalCostPlusMarkup}} </h4>
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

      let self = this
      this.$rtdbBind('rates', ratesRef).then(rates => {
        self.rates === rates
        
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
  
   },

  methods: {

    getInternationalShippingFee() {
      let rateKey  =  zones[self.shoppingcart.user.address.country].value
       let rate  = Object.keys(self.rates).find(ratekey => {
       
         if (ratekey == rateKey) return rates[ratekey]
      });
        this.calculateInternationalShippingFee(rate)
    },

    calculateInternationalShippingFee(rate) {
        var fee = 0;
      this.shoppingcart.items.forEach(item => {
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

    hoursToDays: function(numberOfHours)
      { 
          var days=Math.floor(numberOfHours/24);
        var remainder=numberOfHours % 24;
        var hours=Math.floor(remainder);
        var minutes=Math.floor(60*(remainder-hours));
        return days == 0 ? 1 : days
        //return({"Days":Days,"Hours":Hours,"Minutes":Minutes})
      },


    getInternationalRate: function() {

      switch (this.shoppingcart.user.address.country) {
        //Zone J
        case "Australia":
        case "New Zealand":
        case "China":
          return 410;
        //Zone G
        case "USA":
          return 265;
        //Zone H
        case "India":
          return 300;
        //Zone D
        case "UK":
          return 200;
        case "France":
        case "Germany":
        case "Spain":
          return 255;
         //Zone A 
        case "Botswana": 
          return "200";
        //Zone C
        case "Namibia":
          return  210;
      }
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
debugger
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
       zones.push({
        key: "Botswana",
        value: "A"
      })
      zones.push({
        key: "Namibia",
        value: "B"
      })
      zones.push({
        key: "UK",
        value: "D"
      })
      zones.push({
        key: "France",
        value: "F"
      })
      zones.push({
        key: "Germany",
        value: "F"
      })
      zones.push({
        key: "Spain",
        value: "F"
      })
      zones.push({
        key: "USA",
        value: "G"
      })
      zones.push({
        key: "India",
        value: "H"
      })
      zones.push({
        key: "Australia",
        value: "J"
      })
      zones.push({
        key: "New Zealand",
        value: "J"
      })
      zones.push({
        key: "China",
        value: "J"
      })
      zones.push({
        key: "Andorra",
        value: "F"
      })
      zones.push({
        key: "Austria",
        value: "F"
      })
      zones.push({
        key: "Belgium",
        value: "F"
      })
      zones.push({
        key: "Denmark",
        value: "F"
      })
      zones.push({
        key: "Finland",
        value: "F"
      })
      zones.push({
        key: "France",
        value: "F"
      })
      zones.push({
        key: "Germany",
        value: "F"
      })
      zones.push({
        key: "Greece",
        value: "F"
      })
      zones.push({
        key: "Iceland",
        value: "F"
      })
      zones.push({
        key: "Ireland",
        value: "F"
      })
      zones.push({
        key: "Italy",
        value: "F"
      })
      zones.push({
        key: "Liechtenstein",
        value: "F"
      })
      zones.push({
        key: "Luxemborg",
        value: "F"
      })
      zones.push({
        key: "Malta",
        value: "F"
      })
      zones.push({
        key: "Monaco",
        value: "F"
      })
      zones.push({
        key: "Netherlands",
        value: "F"
      })
      zones.push({
        key: "Norway",
        value: "F"
      })
      zones.push({
        key: "Portugal",
        value: "F"
      })
      zones.push({
        key: "San Marino",
        value: "F"
      })
      zones.push({
        key: "Spain",
        value: "F"
      })
      zones.push({
        key: "Sweden",
        value: "F"
      })
      zones.push({
        key: "Switzerland",
        value: "F"
      })
      zones.push({
        key: "Turkey",
        value: "F"
      })

      zones.push({
        key: "Bulgaria",
        value: "L"
      })
      zones.push({
        key: "Czech Republic",
        value: "L"
      })
      zones.push({
        key: "Hungary",
        value: "L"
      })
      zones.push({
        key: "Poland",
        value: "L"
      })
      zones.push({
        key: "Romania",
        value: "L"
      })
      zones.push({
        key: "Russia",
        value: "L"
      })
      zones.push({
        key: "Slovakia",
        value: "L"
      })
      zones.push({
        key: "Belarus",
        value: "L"
      })
      zones.push({
        key: "Moldova",
        value: "L"
      })
      zones.push({
        key: "Ukraine",
        value: "L"
      })
    }

  },
};

</script>

<style lang="scss" scoped>
     @import "~@/styles/commonstyle.scss";
</style>

