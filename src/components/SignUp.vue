<template>
  <div class="signup" >
    <div class="container" >
          <!-- <cube-spin v-if="busy"></cube-spin> -->
          <div class="infoblock">
            <p>Let's create a new account !</p>
            <input type="text" v-model="newUser.firstname" placeholder="First name" class="infoblockitem"><br>
            <input type="text" v-model="newUser.surname" placeholder="Surname" class="infoblockitem"><br>
            <input type="text" v-model="newUser.email" placeholder="Email" class="infoblockitem"><br>
            <input type="password" v-model="newUser.password" placeholder="Password" class="infoblockitem"><br><br>
            <vue-tel-input class="tel"  v-model="newUser.cellphone"
                          @onInput="onInput"
                          :preferredCountries="['za']">
            </vue-tel-input><br>
            <button @click="signUp" class="buttonstyle">Sign Up</button>
            <p>or go back to <span @click="goBackToLogin()" style="color:blue;cursor:pointer">login</span></p>
            
          </div>
    </div>
  </div>
  
</template>

 <script>

  //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';

  let myUsersRef = db.ref('users')

 export default {
  name: 'signup',
  
  components: {
    //CubeSpin
  },

  props: {
    currentPage: String,
  },

  data() {
    return {
      busy: false,
      newUser: {
        uid: '',
        firstname: '',
        surname: '',
        email: '',
        password: '',
        cellphone: '',
        address: {
          addressline1: '',
          addressline2: '',
          suburb: '',
          city: '',
          province: '',
          country: '',
          postalcode: ''
        },
        isAdmin: false,  
      }
    }
  },

  firebase () {
    return {
      myusers: myUsersRef    
    }
  },
 
methods: {
      
  goBackToLogin ()
  {
     if(this.$props.currentPage)
      {
        this.$router.replace({ name: 'Login', params: {currentPage: this.$props.currentPage}});
      } else {
        this.$router.replace({ name: 'Login'});
      }
  },

  logout: function() {
    firebase.auth().signOut().then(() => {
    this.$router.replace('Login')
  })
  },

  insert(uid){
    this.newUser.uid = uid;
    myUsersRef.push(this.newUser);
    this.newUser.firstname = '',
    this.newUser.surname = '',
    this.newUser.email = '',
    this.newUser.cellphone = '',
    this.newUser.uid = '',
    this.newUser.isAdmin = false,
    this.busy = false;
    alert("Succeessfully added")
  },

  remove(userUID){
     this.$firebaseRefs.users.child(userUID).remove()
  },

  onInput({ number, isValid, country }) {
    this.cellphone = number;
    console.log(number, isValid, country);
  },

  signUp: function() {
    this.busy = true;
    let self = this;
  
    firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(
      (user) => {
        let uid = user.user.uid;
        self.insert(uid)
        alert('Your account has been created')
        self.$eventHub.$emit('loggedin', '');
       if(localStorage.getItem(uid))
        {
            self.shoppingcart = JSON.parse(localStorage.getItem(uid));
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
        // else if(self.$props.eventid)
        // {
        //   self.$router.replace({ name: 'Event', params: {eventid: self.$props.shoppingcart}});
          
        // }
        else
        {
          self.$router.replace({ name: 'Home'});
        }
            
      },
      (err) => {
        alert('Oops. ' + err.message)
        this.busy = false;
      }
    );
  }
    }
  };
</script>

 <style lang="scss" scoped>
  @import "~@/styles/loginstyle.scss";
  @import "~@/styles/commonstyle.scss";
</style>