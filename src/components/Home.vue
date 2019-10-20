<template>
  <div class="centralcontainer">
    <div class="centreblock">
    <br> <br>
    
         <div class="banner">
             <img  class="frontimage" v-bind:src="imageurl"  alt=""  /> 
        </div>
      
   </div>
  </div>
</template>

<script>
   //import firebase from '../firebase-config';
   //import {  db } from '../firebase-config';
   //import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'

export default {
  name: 'home',
  components: {
     // CubeSpin
    },
  data() {
      return {
        busy: false,
        position: 'relative',
        imageurl: require('../assets/logo.png') ,
      }
    },

firebase () {
        return {
         
          }
      },

created() {
  //this.$eventHub.$emit('eventimageurl', '');
 },


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
