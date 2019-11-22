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
 let h = String(window.innerHeight - 100) + 'px'
         return  {
          'max-width': '100vw',
          'min-height' : h,
          //'max-height': h,
          'height': '100%',
          'width':'100%',
          'display': 'flex',
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
          'flex-direction': 'row',
          'justify-content': 'center',
         //'padding-top' : '0px',
          
       }
    },

  getBannerStyle: function () { 
      return  {
              'margin-top': this.showCheckout ? '2px' : 'auto',
                'margin-bottom':  'auto',
              'margin-left': 'auto',
              'margin-right': 'auto',
              'display': 'flex',
              'height': '100%',
              'width': 'auto',
              'transition': 'all 3000ms ',
              'transition-delay': '3000ms'
   }
  },
}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
