<template>
  <div>
     <div class="container" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <div class="infoblock">
          <h2>{{signinmessage}}</h2>
          <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
          <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
          <button @click="login" class="loginbutton">Login</button>
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
    goto: String,
   },

  created () {
    if(this.$props.goto) {
      this.signinmessage = 'Please sign in to use your shopping cart'
    }
  },
 
  methods: {

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