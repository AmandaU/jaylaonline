<template>
 <div :style="getContainerStyle()">
   
        <img  class="frontimage" v-bind:src="imageurl"  alt=""   /> 
       
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
        imageurl: require('../assets/logo.png') ,
         showCheckout: false
      }
    },

firebase () {
        return {
         
          }
      },

created() {
  this.showCheckout = false
  },

mounted() {
  
  let self = this;
  this.$eventHub.$on('showCheckout', ()=> {
       self.showCheckout = !self.showCheckout;
  });
},

methods: {

//  enter(element) {
      
//       element.style.height = '50px';
//  },

//   leave(element) {
//        element.style.height = 'auto';
//  },

getContainerStyle: function () { 
 let h = String(window.innerHeight - 50) + 'px'
         return  {
          'max-height': h,
          'min-height': h,
          'min-width' : '100vw',
           'height': '100%',
          'width':'100%',
          'display': 'flex',
          'overflow-y': 'hidden',
          'overflow-x': 'hidden',
          'flex-direction': 'column',
          'justify-content': 'center',
         
          
       }
    },

}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
