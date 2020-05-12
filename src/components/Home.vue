<template>
    <div :style="getContainerStyle()" >

       <div v-if="isMobile()" class="swap-on-hover" @click="gotoShop()">
         <img  :src="imageMobile"  class="swap-on-hover__front-image">
          <img  :src="imageMobile"  class="swap-on-hover__back-image">
       </div>
 
  
      <div v-if="!isMobile()" class="swap-on-hover" @click="gotoShop()">
          <img   :src="imageurl"  class="swap-on-hover__front-image"/>
          <img   :src="hoverImageUrl"  class="swap-on-hover__back-image"/>
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
        imageMobile: require('../assets/dog-mobile.png') ,
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

  imageSrc() {
    if(this.isMobile()) {
      return 'dog-mobile.png';
    } else {
      return 'dog.png';
    }
  },

   isMobile: function() {
     debugger
       if( navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) )
          {
            return true
          }
           return window.innerWidth < 800
      },

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
         // 'background-color': 'orange',
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
