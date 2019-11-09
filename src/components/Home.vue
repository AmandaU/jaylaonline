<template>
  <div class="centralcontainer">
   
    <div class="banner">
       <img  class="frontimage" v-bind:src="imageurl"  alt=""  /> 
    </div>
      
   </div>
  
</template>

<script>
  
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
  },


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
