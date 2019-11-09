<template>
  <div class="information">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="addressblock">
          <form
            id="informationform"
            @submit="checkForm"
            method="post" 
          >
            <h2>Your information</h2>
            <small v-visible="userInvalid" style="color: red">Please enter a name and surname</small><br>
             <small class="addresslabel">First name</small><small style="color: red" v-visible="userInvalid && user.firstname == ''">*</small>
            <input type="text" v-model="user.firstname" placeholder="First name" class="addressitem"><br>
             <small class="addresslabel">Surname</small><small style="color: red" v-visible="userInvalid && user.surname == ''">*</small>
            <input type="text" v-model="user.surname" placeholder="Surname" class="addressitem"><br>

             <small v-visible="emailInvalid" style="color: red">Please enter a valid email</small><br>
             <small class="addresslabel">Email</small><small style="color: red" v-visible="userInvalid ">*</small>
            <input type="email" v-model="user.email" placeholder="Enter email" class="addressitem"><br>


            <small v-visible="addressInvalid" style="color: red">Your address is not quite right, please check</small><br>
            <small class="addresslabel">Address line 1</small><small style="color: red" v-visible="addressInvalid && user.address.addressline1 == ''">*</small>
            <input type="text" v-model="user.address.addressline1" placeholder="Address line 1" class="addressitem"><br>
            <small class="addresslabel">Address line 2</small>
            <input type="text" v-model="user.address.addressline2" placeholder="Address line 2" class="addressitem"><br>
            <small class="addresslabel">Suburb</small><small style="color: red"  v-visible="addressInvalid && user.address.suburb == ''">*</small>
            <input type="text" v-model="user.address.suburb" placeholder="Suburb" class="addressitem"><br>
            <small class="addresslabel">City</small><small style="color: red"  v-visible="addressInvalid && user.address.city == ''">*</small>
            <input type="text" v-model="user.address.city" placeholder="City" class="addressitem"><br>
            <small class="addresslabel">Country</small><small style="color: red"  v-visible="addressInvalid && user.address.country == ''">*</small>
            <country-select v-model="user.address.country" :country="country" topCountry="ZA" class="countryitem"/><br>
            <small class="addresslabel">Region</small><small style="color: red"  v-visible="addressInvalid && user.address.region == ''">*</small>
            <region-select v-model="user.address.region" :country="user.address.country" :region="region" class="countryitem"/><br>
             <small class="addresslabel">Postal code</small><small style="color: red"  v-visible="addressInvalid && user.address.postalcode == ''">*</small>
            <input type="number" v-model="user.address.postalcode" placeholder="Code" class="addressitem"  ><br><br>
           
            <button class="buttonstyle" type="submit" @click.prevent="submitForm()">SUBMIT</button>
            <button   @click="goToDelivery" class="buttonstyle">continue...</button>
            <button  @click="shopMore" class="buttonstyle">shop more</button>
      </form>
         </div>
     
       <ShoppingCart ></ShoppingCart>
     
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

  //  firebase () {
  //    debugger
  //    const currentUser = firebase.auth().currentUser;
  //   return {
  //     user: db.ref('users').orderByChild('uid').equalTo(currentUser.uid).limitToFirst(1), 
  //     address: addressRef
  //   }
  // },


 data() {
      return {
        busy: true,
        user: {
          firstname: '',
          surname: '',
          email: '',
          address: {
            addressline1: '',
            addressline2: '',
            suburb: '',
            city: '',
            region: '',
            country: '',
            postalcode: ''
         }
        },
        addressInvalid: false,
        userInvalid: false,
        emailInvalid: false,
        key: '',
        currentuser: null,
        totalitems: 0
      }
    },

  mounted() {
    let self = this
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       self.totalitems = total
    });
 },

 created() {
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
          self.user = users.val()[key];
          self.key = key
          self.address = self.user.address
        }
      });
    }
 },

  methods: {

    submitForm () {
            if (this.checkForm()) {
                console.log('formValidated');
                 this.goToDelivery()
            }
        },

    checkForm: function (e) {
      debugger
       this.emailInvalid = !this.validEmail(this.user.email) 
    
      if(this.user.firstname == ''
        || this.user.surname == '') {
          this.userInvalid = true
    } 

      if(this.user.address.addressline1 == ''
          || this.user.address.suburb == ''
          || this.user.address.country == '' 
          || this.user.address.postalcode == ''
          || isNaN(this.user.address.postalcode) ) {
           this.addressInvalid = true
        } 

     e.preventDefault();
     return !this.emailInvalid && !this.userInvalid && !this.addressInvalid
      
    },

    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

  shopMore () {
    this.$router.replace({ name: 'Shop'});
  },
      
  

   goToDelivery: function() {

      var theTotal = 0;
      this.shoppingcart.items.forEach(item => {
          theTotal += item.number * Number(item.price);
      });
      this.shoppingcart.purchasevalue = String((theTotal + this.shoppingcart.shipping))
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));

     if(this.currentuser){
       db.ref('users/' + this.key).set(this.user);
       this.$router.push({ name: 'Shipping'});
     } else {

      this.$router.push({ name: 'Shipping',  params: { user: this.user}});
         //this.userRef.push(this.user);
     }
     
  },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/shippingstyle.scss";
</style>