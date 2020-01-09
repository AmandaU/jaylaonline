<template>
    <div class="container" :key="componentKey">
       <!-- <cube-spin v-if="busy"></cube-spin> -->
     <div class="mainblock">
        <div class="addressblock">
        
             <!-- <h1>Your information</h1> -->
            <h2>Contact details</h2>
            <small v-show="userInvalid" style="color: red">Please enter a name and surname</small>
             <small style="color: red" v-show="userInvalid && shoppingcart.user.firstname == ''">*</small>
            <input type="text" v-model="shoppingcart.user.firstname" placeholder="First name" class="addressitem">
             <small style="color: red" v-show="userInvalid && shoppingcart.user.surname == ''">*</small>
            <input type="text" v-model="shoppingcart.user.surname" placeholder="Surname" class="addressitem">


             <small v-show="emailInvalid" style="color: red">Please enter a valid email</small><br>
             <small style="color: red" v-show="userInvalid ">*</small>
            <input type="email" v-model="shoppingcart.user.email" placeholder="Email" class="addressitem">

             <small v-show="cellInvalid" style="color: red">Please enter a valid cell number</small><br>
             <small style="color: red" v-show="cellInvalid ">*</small>
             <vue-tel-input class="listSelectitem"  v-model="shoppingcart.user.cellphone"
                          :preferredCountries="['za']">
             </vue-tel-input><br>

            <h2>Shipping address</h2>
            <small v-show="addressInvalid" style="color: red">Your address is not quite right, please check</small>
             <small style="color: red"  v-show="addressInvalid && shoppingcart.user.address.country == ''">*</small>
            <country-select v-model="shoppingcart.user.address.country" :country="shoppingcart.user.address.country" topCountry="ZA" class="listSelectitem"/>
            <small style="color: red"  v-show="addressInvalid && shoppingcart.user.address.region == ''">*</small>
            <region-select v-model="shoppingcart.user.address.region" :country="shoppingcart.user.address.country" :region="shoppingcart.user.address.region" class="listSelectitem" />
           
            
            <small style="color: red" v-show="addressInvalid && shoppingcart.user.address.addressline1 == ''">*</small>
            <input type="text" v-model="shoppingcart.user.address.addressline1" placeholder="Address" class="addressitem"><br>
          
            <small  v-visible="addressInvalid && shoppingcart.user.address.addressline1 == ''"> </small>
            <input type="text" v-model="shoppingcart.user.address.addressline2" placeholder="Apartment, suite, etc (optional)" class="addressitem">
            
            <small style="color: red"  v-show="addressInvalid && shoppingcart.user.address.suburb == ''">*</small>

            <!--Old way-->
            <input type="text" v-model="shoppingcart.user.address.suburb" placeholder="Suburb" class="addressitem"  >
            <small style="color: red"  v-show="addressInvalid && shoppingcart.user.address.city == ''">*</small>
              <input type="text" v-model="shoppingcart.user.address.city" placeholder="City" class="addressitem">
             <small style="color: red"  v-show="addressInvalid && shoppingcart.user.address.postalcode == ''">*</small>
            <input type="number" v-model="shoppingcart.user.address.postalcode" placeholder="Code" class="addressitem"  ><br>

            <!--Better way-->
            <!-- <input type="text" v-model="shoppingcart.user.address.suburb" placeholder="Suburb" class="addressitem"  @input="onChangeSuburb" >
            <div v-if="isChangingSuburb && filteredAddresses.length > 0"> Changing suburb!
                <div  v-for="address in filteredAddresses" v-bind:key="address.postalcode">
                  <span @click="onSelectAddress(address)">{{ address.suburb }}, {{ address.city }}, {{ address.postalcode }}</span>
                </div>
             </div>
           
              <small v-if="!isChangingSuburb" class="addresslabel" >{{shoppingcart.user.address.city}}, </small>
              <small v-if="!isChangingSuburb" class="addresslabel" >{{shoppingcart.user.address.postalcode}}</small> -->
           
           
           <div style=" text-align: center;">
            <button  @click="shopMore" class="buttonstyle">shop more</button>
            <button :disabled="shoppingcart.totalitems == 0"  @click="goToDelivery" class="buttonstyle">continue...</button>
            
            </div>
      
         </div>
    
     </div> 

     <div class="cartblock" v-show="!showCheckout">
         <ShoppingCart :showCheckout="false"></ShoppingCart>
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
  name: 'information',

  components: {
    'ShoppingCart': ShoppingCart 
  },

 data() {
      return {
        loader: {},
        isChangingSuburb: false,
        validAddress: {},
        allValidAddresses: [],
        filteredAddresses: [],
        showCheckout: false,
        componentKey: 0,
        busy: true,
        addressInvalid: false,
        userInvalid: false,
        emailInvalid: false,
        cellInvalid: false,
        key: '',
        currentuser: null,
        totalitems: 0,
        shoppingcart : {
          items: [],
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
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       self.totalitems = total
        if(localStorage.getItem('jaylashop'))
        {
          self.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
        }
      });
  },

  destroyed() {
      window.removeEventListener("resize", this.redrawComponent);
  },

 created() {
    this.loader = this.$loading.show({
              loader: 'dots',
                color: 'blue'
    });  
    window.addEventListener("resize", this.redrawComponent);
    this.$eventHub.$emit('showCheckout', this.isMobile());
    this.showCheckout = this.isMobile()
    if(localStorage.getItem('jaylashop'))
    {
      this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
      this.totalitems = this.shoppingcart.totalitems
    }
    this.currentuser = firebase.auth().currentUser;
    if(this.currentuser){
      let self = this
      this.$rtdbBind('users', userRef.orderByChild("uid").equalTo(this.currentuser.uid).limitToFirst(1)).then(users => {
        for(var key in users.val()) {
          console.log("snapshot.val" + users.val()[key]);
          self.shoppingcart.user = users.val()[key];
          self.key = key
        }
      });
    }
    this.getAddresses()
 },

  computed: {

      
   },

  methods: {

    filterAddresses()  {
        let self = this
        this.filteredAddresses =   self.allValidAddresses.filter(address => {
         if (address) {
                 if (address.suburb.toLowerCase().includes(self.shoppingcart.user.address.suburb.toLowerCase()) 
                 || address.city.toLowerCase().includes(self.shoppingcart.user.address.suburb.toLowerCase())
                 || address.state.toLowerCase().includes(self.shoppingcart.user.address.suburb.toLowerCase()) ) {
                   return  address
                 }
          }
         })
       
      },

    onChangeSuburb(value) {
       if(value.inputType == "insertText") {
            if( this.shoppingcart.user.address.suburb.length <= 3) {
            this.isChangingSuburb = false
            return
        }
         this.filterAddresses()
         this.isChangingSuburb = true
      }
    },

     onSelectAddress(address) {
            this.isChangingSuburb = false
            this.shoppingcart.user.address.suburb = address.suburb 
            this.shoppingcart.user.address.city = address.city
            this.shoppingcart.user.address.postalcode = address.postalcode 
        },

    getAddresses() {
     let self = this
      const auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
         "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"} 
    }
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://www.rush.co.za/ecommerce/address/addressListingEcommerceApi.json"
      this.axios.get(proxyurl + url, auth)
       .then(result => {
         if(result.statusText == "OK") {
            self.allValidAddresses = result.data.map(address => {
                 if (address['USE'] == "Yes")
                {
                  return {
                    suburb : address['SUBURB'],
                    city : address['STATE'],
                    postalcode : address['POSTCODE'],
                    state: address['STATE']
                  }
                }
            })
           }
          self.isLoading = false
          self.loader.hide()
    
        })
        .catch(e => {
           self.isLoading = false
           self.loader.hide()
         //  alert("There was a problem calculating the delivery fee")
        })
    },


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

    redrawComponent() {
       if (window.innerWidth < 800 && !this.showCheckout) {
         this.$eventHub.$emit('showCheckout', true);
         this.showCheckout = true
      } 
      if (window.innerWidth > 800 && this.showCheckout) {
          this.$eventHub.$emit('showCheckout', false);
         this.showCheckout = false
      }
       this.componentKey += 1
    },

    onInput({ number, isValid, country }) {
      if(valid) {
       this.shoppingcart.user.cellphone = number;
      }
    },

    submitForm () {
      if (this.checkForm()) {
          console.log('formValidated');
            this.goToDelivery()
      }
    },

    checkForm: function () {
     this.emailInvalid = !this.validEmail(this.shoppingcart.user.email) 
     this.cellInvalid = this.shoppingcart.user.cellphone == '' 
     || this.shoppingcart.user.cellphone.length < 9
    
     this.userInvalid = this.shoppingcart.user.firstname == ''
        || this.shoppingcart.user.surname == ''
    
     this.addressInvalid = this.shoppingcart.user.address.addressline1 == ''
        || this.shoppingcart.user.address.suburb == ''
        || this.shoppingcart.user.address.country == '' 
        || this.shoppingcart.user.address.postalcode == ''
        || isNaN(this.shoppingcart.user.address.postalcode) 

     return !this.emailInvalid && !this.userInvalid && !this.addressInvalid && !this.cellInvalid
      
    },

    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

  shopMore () {
    localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
    this.$router.replace({ name: 'Shop'});
  },
  
   goToDelivery: function() {
      if(!this.checkForm()) return
      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * item.price;
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.shipping))
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));

     if(this.currentuser){
       db.ref('users/' + this.key).set(this.shoppingcart.user);
      } 
      this.$router.push({ name: 'Shipping'});
     },

  }
}
</script>

<style lang="scss" scoped>
 @import "~@/styles/commonstyle.scss";
  @import "~@/styles/shippingstyle.scss";
</style>