<template>
 
  <div class="centralcontainer">
      <transition
          name="expand"
          @enter="enter"
          @after-enter="afterEnter"
          @leave="leave"
        >
       <div style="getBannerStyle()">
          <img class="frontimage" v-bind:src="imageurl"  alt=""   /> 
        </div>

         </transition>

      
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

  getBannerStyle: function () { 
        return  {
             'display': 'block',
            'text-align': 'center',
            'margin-top': this.showCheckout ? '0px' : 'auto',
            'margin-bottom': '0px',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'transition': 'margin-top 4000ms ease-in-out, box-shadow 1000ms ease-in-out'

      }
  },
}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
