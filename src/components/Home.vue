<template>
    <div :style="getContainerStyle()" >
  
      <div class="swap-on-hover" @click="gotoShop()">
         <img  class="swap-on-hover__front-image"   v-bind:src="imageurl"/>
         <img  class="swap-on-hover__back-image"  v-bind:src="hoverImageUrl"/>
        <!-- <img  class="frontimage" v-bind:src="imageurl"  alt="where the fuck did it go?"   @click="gotoShop()" />  -->
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
        imageurl: require('../assets/dog.png') ,
        hoverImageUrl: require('../assets/eish-dog.png') ,
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

gotoShop() {
  this.$router.push({ name: 'Shop'});
},


getContainerStyle: function () { 
 let h = String(window.innerHeight) + 'px'
         return  {
          'max-height': '100vh',
          'min-height': '100vh',
          'min-width' : '100vw',
          'margin-top': '70px',
          'background-color': 'orange',
           'height': '100%',
          'width':'100%',
          'display': 'flex',
          'overflow-y': 'hidden',
          'overflow-x': 'hidden',
          'flex-direction': 'column',
          'justify-content': 'center',
          'align-content': 'center',
          'align-self': 'center',
          'vertical-align': 'middle',
          'margin': '0 auto'
       }
    },

}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
