<template>
 <!-- <div class="centralcontainer"> -->
  <div :style="getContainerStyle()">
      <!-- <transition
          name="expand"
          @enter="enter"
          @after-enter="afterEnter"
          @leave="leave"
        > -->
       <div :style="getBannerStyle()"> 
          <img  class="frontimage" v-bind:src="imageurl"  alt=""   /> 
        </div>

         <!-- </transition>  -->

      
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
        showCheckout: false
      }
    },

firebase () {
        return {
         
          }
      },

created() {
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
         return  {
          'max-width': '100vw',
          'min-height' : '89vh',
          'max-height': '89vh',
          'height': '100%',
          'width':'100%',
          'display': 'flex',
          'overflow-y': 'hidden',
          'overflow-x': 'hidden',
          'flex-direction': 'row',
          'justify-content': 'center',
          'padding-top' : '0px',
       }
    },

  getBannerStyle: function () { 
      return  {
              'margin-top': this.showCheckout ? '2px' : '5%',
              'margin-bottom': this.showCheckout ? '2px' : '5%',
              'margin-left': 'auto',
              'margin-right': 'auto',
              'display': 'flex',
              'height': 'auto',
              'width': 'auto',
              'transition': 'all 500ms ease-in-out',
              // 'transition-delay': '250ms'
   }
  },
}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
