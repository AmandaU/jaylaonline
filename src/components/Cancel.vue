<template>
     <div class="container" >
           <div class="payblock">
      
                <h1>Your purchase was unsuccessful :( </h1>
              <button   @click="gotoInformation" class="buttonstyle">try again...</button>
          </div>
       </div>
 </template>

<script>
    
export default {
  name: 'cancel',

  data() {
      return {
         results: [],
        busy: false,
       
      }
  },

 props: {
     orderid: String,
  },

created() {
   localStorage.clear()
 },

  methods: {

     gotoInformation () {
      this.$router.replace({ name: 'Information'});
    },
  }

}
</script>

<style lang="scss" scoped>
  // @import "~@/styles/commonstyle.scss";
  @import "~@/styles/checkoutstyle.scss";

</style>

