<template>
  <div>
    <div class="container" >
          <!-- <cube-spin v-if="busy"></cube-spin> -->
          <div class="infoblock">
            <h4>CREATE AN ACCOUNT</h4>
            <input type="text" v-model="newUser.firstname" placeholder="First name" class="infoblockitem"><br>
            <input type="text" v-model="newUser.surname" placeholder="Surname" class="infoblockitem"><br>
            <input type="text" v-model="newUser.email" placeholder="Email" class="infoblockitem"><br>
            <input type="password" v-model="newUser.password" placeholder="Password" class="infoblockitem"><br><br>
            <vue-tel-input class="tel" style="height:40px;margin-top:-10px" v-model="newUser.cellphone"
                          @onInput="onInput"
                          :preferredCountries="['za']">
            </vue-tel-input><br>
            <button @click="signUp" class="buttonstyle">SIGN UP</button>
           <div style="display:flex;flex-direction:row;vertical-align:middle">
              <input  type="checkbox" id="checkbox" v-model="subscribe" >
              <label  for="checkbox" style="padding-left:10px;padding-top:12px">would you like to subscribe to our newsletter?</label>
            </div>
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
    goto: String,
  },

  data() {
    return {
       subscribe: false,
       loader: {},
       isLoading: false,
        mailer: {
          name: '',
          email: '',
      },
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
          region: '',
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

   created () {
    
   },
 
methods: {
      
  goBackToLogin ()
  {
     if(this.$props.goto)
      {
        this.$router.replace({ name: 'Login', params: {goto: this.$props.goto}});
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
      this.$swal('Hello', 'You are now a customer of ours, congratulations', 'success') 
  },

  remove(userUID){
     this.$firebaseRefs.users.child(userUID).remove()
  },

  onInput({ number, isValid, country }) {
    this.cellphone = number;
    console.log(number, isValid, country);
  },

  signUp: function() {
    
    this.isLoading = true;
    this.loader = this.$loading.show({
              loader: 'dots',
              color: 'grey'
    });  
    let self = this;

     if(this.subscribe)
    {
      this.mailer.name = this.newUser.firstname + ' ' + this.newUser.surname;
      this.mailer.email = this.newUser.email;
      this.$firebaseRefs.mailersRef.push(this.mailer);
    }
  
    firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(
      (user) => {
        self.isLoading = false;
        self.loader.hide()
        let uid = user.user.uid;
        self.insert(uid)
         this.$swal('Hello', 'You have registered successfully, congratulations', 'success') 
        self.$eventHub.$emit('loggedin', '');
       if(sessionStorage.getItem(uid))
        {
            self.shoppingcart = JSON.parse(sessionStorage.getItem(uid));
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
         this.$swal('Oops...', err.message, 'error') 
      }
    );
  }
    }
  };
</script>

 <style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  @import "~@/styles/loginstyle.scss";
 
</style>