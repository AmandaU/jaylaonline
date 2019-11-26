<template>
  <div class="login">
     <div class="container" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="infoblock">
          <h3>{{signinmessage}}</h3>
          <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
          <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
          <button @click="login" class="buttonstyle">Login</button>
          <p>You don't have an account ? You can 
            <span @click="goToSignup()" style="color:blue;cursor:pointer">create one</span>
          </p>
         </div>
     </div>
  </div>
</template>

<script>
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'

 export default {
  name: 'login',

  data() {
      return {
        busy: true,
        email: "",
        password: "",
        users: [],
        shoppingcart: {},
        signinmessage: 'Sign in:'
    }
  },

  props: {
    currentPage: String,
   },

  created () {
    
    if(this.$props.currentPage) {
      this.signinmessage = 'Please sign in to use your shopping cart'
    }
  },
 
  methods: {

    goToSignup ()
    {
      if(this.$props.currentPage) {
        this.$router.replace({ name: 'Signup', params: {currentPage: this.$props.currentPage}});
      } else {
        this.$router.replace({ name: 'Signup'});
      }
    },
    
    login: function() {
      
      this.busy = true;
      let self = this;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          let uid = user.user.uid;
          alert('Successful login');
          self.$eventHub.$emit('loggedin', '');
          if(localStorage.getItem('jaylashop'))
          {
              self.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
              self.$eventHub.$emit('shoppingcarttotal', self.shoppingcart.totalitems);
          }
          if(self.$props.currentPage)
          {
            if (self.$props.currentPage == 'Product') {
             self.$router.go(-1)
            } else {
               self.$router.replace({ name: self.$props.currentPage,  params: {currentPage: this.$props.currentPage}});
           }
            self.busy = false;
          }
          // else if(self.$props.cartref)
          // {
          //   self.$router.replace({ name: 'Event', params: {cartref: self.shoppingcart}});
          // }
          else
          {
            self.$router.replace({ name: 'Home'});
          }
        
           
        },
        (err) => {
           alert('Oops. ' + err.message);
          self.busy = false;
        }
      );
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/loginstyle.scss";
  @import "~@/styles/commonstyle.scss";
</style>