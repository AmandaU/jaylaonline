<template>
  <div class="centralcontainer" >
    <h3>This is an about page</h3>
     <h4>This is an about page,.kjhkjkhbk.jhbkjhkhjbkhbkjb.kjb.kjbh.kjbh.kjb.kjb.kjb.kjb.kjb.kjb.kjb,kjb,jhb,jb</h4>
    
  </div>
</template>

<script>
    
export default {
  name: 'about',

  data() {
      return {
         results: [],
        busy: false,
       
      }
    },

firebase () {
        return {
          //events: myEventsRef    
        }
      },

created() {
  this.$eventHub.$emit('eventimageurl', '');
 },


// mounted() {
//  debugger;

//   this.$nextTick(() => {
//       this.getParameterByName();
//       //window.location.href = '/';
//     });

//     let self = this;

//     axios.get(
//     "https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za",
//     {headers: {
//        "status": 'HTTP/1.0 200 OK'
//       }
//     }
//   )
//   .then((response) => {
//       self.results = response.data;
//     },
//     (error) => {
//       var status = error.response.status
//     }
//   );

// },

}
</script>

<style lang="scss" scoped>
   @import "~@/styles/commonstyle.scss";
</style>

