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
           <h3>DELIVERY</h3>
           <div v-if="!isInternational" :key="componentKey">
              <div  v-for="courier in couriers" :key="courier.CarrierName" >
                  <div class="itemrow">
                    <div class="courierrow">
                      <div class="itemcolumn1">
                          <small style="color:white">{{courier.CarrierName}}</small>
                          <small style="color:white"> {{hoursToDays(courier)}}</small>
                      </div>
                      
                      <div class="itemcolumn2"> 
                          <small style="color:white">{{localDeliveryFee(courier)}} </small>
                      </div> 
                    </div>

                    <div class="itemcolumn3"  @click="selectCourier(courier)" > 
                      <button  v-bind:class="[courier.isSelected ? 'courierbutton red' : 'courierbutton white']"></button>
                    </div>  

                  </div>  
              </div> 
               <small v-if="isCOD" >Expect an email from info@jadeayla.com to arrange delivery</small> 
               <br>
          </div> 

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
      isCOD: false,
      isInternational: false,
      zones: [],
      rates: [],
      isDone: false,
      isLoading: true,
      hasFetched: false,
      loader: {},
      shoppingcart: {},
      user: {},
      couriers: [],
      authToken: 'a0a06d61fe7ff9f06235476a1af267f6311e6d8d239ba6c95565502ebf29ad04',
      baseUrl: 'https://rush.test.jini.guru/api/v2/',  //https://www.rush.co.za/api/v2/
      componentKey: 0,
    }
  },

  created() {
    debugger
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
        this.getLocalDeliveryQuote()
    } else {
       this.getInternationalDeliveryQuote()
    }

    this.loader = this.$loading.show({
                loader: 'dots',
                  color: 'blue'
      });  
},

watch: {
   
  },

 computed: {

    shippingFee: function() {
        return 'R ' + String(this.shoppingcart.deliveryfee.toFixed(2))
    },
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

//International
    getInternationalDeliveryQuote() {
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
    },


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

//Local
    getLocalDeliveryQuote() {
      if (this.hasFetched) return
      this.hasFetched = true

      let self = this;
          let data = this.shippingParameters() 
      const auth = {
            headers: {'X-Auth-Token': this.authToken,  'Content-Type': 'application/json'} 
        }
       const url = this.baseUrl + 'costComparison';
       this.axios.post(url, data,auth)
       .then(result => {
          if(result.statusText == "OK") {
             let allcouriers = result.data.data.CostComparisonResult.CostComparisonResults.ResultSet.Result
             if(allcouriers && allcouriers.length > 0) {
                self.getCouriers(allcouriers, self)
             }
          }

          self.isLoading = false
          self.loader.hide()
          self.isDone = true
        })
        .catch(e => {
           self.isLoading = false
           self.loader.hide()
            alert("There was a problem calculating the delivery fee")
        })
  },

    isCourierSelected: function (courier) {
      if(courier.isSelected) return true
      return false
    },

    localDeliveryFee: function (courier) {
     if (courier.CarrierAccount == "COD") return ''
     return 'R ' + courier.grandtotmrkup
   },

    selectCourier(courier) {
      this.couriers.forEach(c => {
        c.isSelected = false
      })
        courier.isSelected = !courier.isSelected
        this.shoppingcart.courier = courier
        this.shoppingcart.deliveryfee  = courier.CarrierAccount == "COD" ? 0 : Number(courier.grandtotmrkup.replace(',',''))
        localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
        this.$eventHub.$emit('fee', this.shoppingcart.deliveryfee);
        this.componentKey += 1
        this.isCOD = courier.CarrierAccount == "COD"
    },


    hoursToDays: function(courier) { 
      if (courier.CarrierAccount == "COD") return ''
        var days= Math.floor(Number(courier.DeliveryTimeHours)/24);
        var remainder = Number(courier.DeliveryTimeHours) % 24;
        var hours= Math.floor(remainder);
        var minutes= Math.floor(60*(remainder-hours));
        return days == 0 || days == 1 ? " - 1 day" : " - " + days + " days"
     },
  
  shippingParameters: function() {
      let weight = {}    
      let length = {}
      let width = {}
      let height = {}
      let amount = {}
      let ind = 0;
      this.shoppingcart.items.forEach(item => {
        weight[ind] = item.weight
        length[ind] = item.length
        width[ind] = item.width
        height[ind] = item.height
        amount[ind] = item.number
        ind += 1
      })
          let data = {   "insurance":false,
             "weight": weight,
              "length": length,
              "width": width,
              "height": height,
              "amount": amount,
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
        //  let data2 = {   "insurance":false,
            
        //       "weight":{
        //         "0":2,
        //         "1":2
        //         },
        //       "length":{
        //         "0":5,
        //         "1":5
        //         },
        //       "width":{
        //         "0":5,
        //         "1":19
        //         },
        //       "height":{
        //         "0":5,
        //         "1":67
        //         },
        //       "amount":{
        //         "0":1,
        //         "1":1
        //         },
        //       "pick_up": this.shippingFromAddress(),//"test,test2|| ||ALBERT LUTHULI||BLOEMFONTEIN||9323",
        //       "sender_name":"JadeAyla",
        //       "sender_email":"info@jadeayla.com",
        //       "sender_tel":"",
        //       "sender_mob":"0828391629",
        //       "receiver_contact":"testege",
        //       "receiver_name": this.shoppingcart.user.firstname,
        //       "receiver_phone":"",
        //       "receiver_mobile": this.shoppingcart.user.cellphone,
        //       "receiver_email": this.shoppingcart.user.email,
        //       "drop_off":  this.shippingToAddress()//"2 ,road||reter||ACTON CABA||TSOMO||5401"
        // }
        //  console.log( JSON.stringify(data) );
        //   console.log( JSON.stringify(data2) );
        return data
    },

    getCouriers(allcouriers, self) {
            //cheapest
            self.couriers[0] = allcouriers[0]
             allcouriers.forEach(courier => {
               if(courier.CarrierService == "Locker") return
                if(Number(courier.grandtotmrkup.replace(',','')) < Number( self.couriers[0].grandtotmrkup.replace(',',''))) {
                   self.couriers[0] = courier
                   self.couriers[0].isSelected = false
               }
              });

            //fastest
            self.couriers[1] = allcouriers[1]
            allcouriers.forEach(courier => {
                 if(courier.CarrierService == "Locker") return
                if(Number(courier.DeliveryTimeHours) < Number( self.couriers[1].DeliveryTimeHours)) {
                  self.couriers[1] = courier
                  self.couriers[1].isSelected = false
              }
             });

            //COD
              self.couriers[2] = {
                CarrierName: "COD, pickup or by arrangement",
                CarrierAccount: "COD",
                DeliveryTimeHours: '',
                TotalCostPlusMarkup: "TBA",
                isSelected: false
              }
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
      @import "~@/styles/shippingstyle.scss";
</style>

