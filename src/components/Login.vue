<template>
  <div class="login">
    <div class="centralcontainer" >
       <!-- <cube-spin v-if="busy"></cube-spin> -->
        <br>
        <div class="infoblock">
          <h3>Sign In</h3>
          <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
          <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
          <button @click="login" class="infoblockitem">Login</button>
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
        shoppingcart: {}
      }
    },

  props: {
    goToCheckout: Boolean,
   },
 
  methods: {

    goToSignup ()
    {
      if(this.$props.cartref)
      {
        this.$router.replace({ name: 'Signup', params: {goToCheckout: true}});
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
          if(self.$props.goToCheckout)
          {
            self.$router.replace({ name: 'Shipping'});
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
        
          // self.$bindAsArray(
          //         "users",
          //        db.ref('users').orderByChild("uid").equalTo(uid).limitToFirst(1),
          //         null,
          //         () => {
          //           if(self.shoppingcart)
          //           {
          //             self.shoppingcart.userid = uid;
          //             localStorage.setItem(self.shoppingcart.reference, JSON.stringify(self.shoppingcart));
          //             self.$router.replace({ name: 'Checkout', query: {cartref: self.$props.cartref}});
          //             self.busy = false;
          //           }
          //           // else if(self.$props.cartref)
          //           // {
          //           //   self.$router.replace({ name: 'Event', params: {cartref: self.shoppingcart}});
          //           // }
          //           else
          //           {
          //             self.$router.replace({ name: 'Home'});
          //           }
          //         }
          //       );
           
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
  @import "~@/styles/styles.scss";
</style>