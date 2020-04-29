<template>
  <div>
     <div class="container" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <div v-if="!showForgotPassword" class="infoblock">
          <h4>{{signinmessage}}</h4>
          <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
          <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
          <button @click="login" class="buttonstyle">LOGIN</button>
           <br>
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
          <button @click="forgotPassword" class="buttonstyle">Send recovery email</button>
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
        isLoading: false,
        loader: {},
        email: "",
        password: "",
        users: [],
        shoppingcart: {},
        signinmessage: 'SIGN IN'
    }
  },

  props: {
    goto: String,
   },

  created () {
   
    if(this.$props.goto) {
      this.signinmessage = 'SIGN IN TO USE YOUR SHOPPING CART'
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
      
      this.isLoading = true;
       this.loader = this.$loading.show({
                loader: 'dots',
                  color: 'grey'
      });  
      let self = this;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
            self.isLoading = false;
            self.loader.hide()
          let uid = user.user.uid;
          alert('Successful login');
          self.$eventHub.$emit('loggedin', '');
          if(sessionStorage.getItem('jaylashop'))
          {
              self.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
              self.$eventHub.$emit('shoppingcarttotal', self.shoppingcart.totalitems);
          }
          if(self.$props.goto)
          {
            if (self.$props.goto == 'Product') {
             self.$router.go(-1)
            } else {
               self.$router.replace({ name: self.$props.goto});
           }
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
         }
      );
      }
    }
  }
</script>

<style lang="scss" scoped>
 @import "~@/styles/commonstyle.scss";
  @import "~@/styles/loginstyle.scss";
 
</style>