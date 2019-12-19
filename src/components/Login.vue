<template>
  <div>
     <div class="container" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <div v-if="!showForgotPassword" class="infoblock">
          <h2>{{signinmessage}}</h2>
          <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
          <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
          <button @click="login" class="loginbutton">Login</button>
          <p>You don't have an account ? You can 
            <span @click="goToSignup()" style="color:blue;cursor:pointer">create one</span>
           </p>
           <p>Forgot your password? 
            <span @click="showForgotPassword = true" style="color:blue;cursor:pointer">Send a reset email</span>
          </p>
        </div>
         <div v-if="showForgotPassword" class="infoblock">
          <h2>Send recovery email to:</h2>
          <input type="text" v-model="forgotEmail" placeholder="Recovery email"  class="infoblockitem"><br>
           <button @click="forgotPassword" class="loginbutton">Send recovery email</button>
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
        showForgotPassword: false,
        forgotEmail: "",
        busy: true,
        email: "",
        password: "",
        users: [],
        shoppingcart: {},
        signinmessage: 'Sign in:'
    }
  },

  props: {
    goto: String,
   },

  created () {
    if(this.$props.goto) {
      this.signinmessage = 'Please sign in to use your shopping cart'
    }
  },
 
  methods: {

    forgotPassword() {
        var auth = firebase.auth();
        var emailAddress = "user@example.com";
        let self = this
        auth.sendPasswordResetEmail(this.forgotEmail).then(function() {
                  
            alert('Email sent successfully. Check your email for steps to reset your password' )
              self.$router.replace({ name: 'Home'});
           
             }).catch(function(error) {
            alert('We could not send the email. Please check your email address and internet connectivity');
        });
    },

    goToSignup ()
    {
      if(this.$props.goto) {
        this.$router.replace({ name: 'Signup', params: {goto: this.$props.goto}});
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
          if(self.$props.goto)
          {
            if (self.$props.goto == 'Product') {
             self.$router.go(-1)
            } else {
               self.$router.replace({ name: self.$props.goto});
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