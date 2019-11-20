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
          <img class="frontimage" v-bind:src="imageurl"  alt=""   /> 
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
          'min-height' : this.showCheckout ? '68vh' : '87vh',
          'max-height': this.showCheckout ? '68vh' : '87vh',
          'height': '100%',
          'width':'100%',
        // 'float':'right',
          'display': 'flex',
          'overflow-y': 'hidden',
            'overflow-x': 'hidden',
          'flex-direction': 'row',
            // 'padding-bottom': this.showCheckout ? '6rem' : '3rem',
            // 'padding-top': this.showCheckout ? '0rem' : '3rem',
            //'align-self': this.showCheckout ? 'flex-start' : 'center',
            'justify-content': 'center',
            'align-items': 'center'
        }
    },

  getBannerStyle: function () { 
        return  {
             'display': 'flex',
             'align-self': this.showCheckout ? 'flex-start' : 'center',
          
            //'margin': '0 auto',
            'transition': 'all 4000ms ease-in-out'
   }
  },
}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
