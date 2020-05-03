<template>
    <!-- <div :class="isHome ? 'footerhome' : 'footer'"  ref="footer" > -->
<!--    
        <div :class="isHome ? 'menuitem homecolor' : 'menuitem normalcolor'"  @click="navigate('About')" >ABOUT
         </div> -->
        
          <div  v-visible="!isHome" class="mailer">
           <div class="mailercol">
             <h3>Subscribe to our mailer and get notified when new items land</h3> 
             <h5>We will not spam you. We will not share your email address with anyone</h5>
               <br>
           </div>
           <div class="mailercol">
             <br>
                <input type="text" v-model="mailer.name" placeholder="Name" class="infoblockitem"><br>
                <input type="text" v-model="mailer.email" placeholder="Email" class="infoblockitem">
             <br>
            </div>
            <div class="mailercol">
            <button :disabled="mailer.name == '' || mailer.email == ''"  @click="signUp" class="mailerbutton">SUBSCRIBE</button>
            <br v-visible="isMobile">
             </div>
         </div>
       
        <!-- <div :class="isHome ? 'menuitem homecolor' : 'menuitem normalcolor'"   @click="navigate('Contact')">CONTACT
        </div> -->
  
    <!-- </div> -->
</template>

<script>
import firebase from '../firebase-config';
import {  db } from '../firebase-config';

export default {
  name: 'BottomNav',
data() {
    return {
      loader: {},
      mailer: {
          name: '',
          email: '',
      }
   }
  },

   firebase() {
      return {
           mailersRef: db.ref('mailers'),
         }
      },

 mounted() {
    
 },

 computed: {

   isHome: function() {
      return this.$route.name == "Home"
   },
 },

methods: {

     navigate (navPath) {
    
         let gotopath = '/' + navPath;
         this.$router.push({path: gotopath,})
     },

     signUp()
     {

        this.$firebaseRefs.mailersRef.push(this.mailer);
        this.$swal('Success', 'You are subscribed', 'info')
        this.mailer.name = '';
        this.mailer.email = '';

      // this.$swal({
      //           title: '<i>Subscribe to our newsletter</i>',
      //           // add a custom html tags by defining a html method.
      //           html:'<div style="width: 100%;"><h5>We will not spam you. We will not share your email address with anyone</h5>' +
      //             '<input type="text" v-model="mailer.name" placeholder="Name" class="infoblockitem" style="padding-left: 10px;width: 80%;cursor: pointer;height:30px;align-self: center;border: 1px solid $color-lightLineColor;margin-bottom:10px"><br>' +
      //           '<input type="text" v-model="mailer.email" placeholder="Email" class="infoblockitem" style="padding-left: 10px;width: 80%;cursor: pointer;height:30px;align-self: center;border: 1px solid $color-lightLineColor"></div>',
      //           showCloseButton: false,
      //           showCancelButton: true,
      //           focusConfirm: false,
      //         })
  }
   
   },
}
</script>

<style lang="scss" scoped>
 // @import "~@/styles/commonstyle.scss";
  @import "~@/styles/bottomstyle.scss";
 </style>