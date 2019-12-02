<template>
 <!-- <div class="pagecontainer">  -->
<div :style="getContainerStyle()">
   <div class="productcontainer">
     <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>
       <!-- <div> -->
   <h1>{{artist.name}}</h1>
  
    <div class="imageblock">  
        <div  v-for="image in artist.images" v-bind:key="image.url">
            <img v-bind:src="image.url" v-bind:alt="Image" >
        </div>  
    </div> 
  
    </div>
   </div>
</template>

<script>
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let artistsRef = db.ref('artists');

export default {
  name: 'product',

  props: {
     artist: Object,
   },

  data() {
    return {
      greaterThan600: window.innerWidth > 600,
      busy: false,
      
     }
  },

firebase () {
 
},

mounted() {
  
    
},

created () {
 
},

 computed: {

 
    isMobileDevice: function()
    {
      return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i);
    },

  },

methods: 
{ 
  getContainerStyle: function () { 
     let h = String(window.innerHeight - 120) + 'px'
        return  {
        'max-width': '100vw',
        'min-height' : h,
        'width':'100%',
        'float':'left',
        'display': 'flex',
        'overflow-x': 'hidden',
        'align-self': 'center',
        'justify-content': 'center',
        'align-items': 'center',
        'padding-top': 'auto',//this.showCheckout ? '2px' : '7%',
        'padding-bottom': 'auto',
        'transition': 'padding-top 500ms ease-in-out',
      }
  },

  

  media800Enter(mediaQueryString) {
    this.greaterThan800 = false
  },
   
  media800Leave(mediaQueryString) {
    this.greaterThan800 = true
  },

 
  continueShopping () {
      this.$router.replace({ name: 'Shop'});
  },
 
  
// watch: {
//     productid: {
//       // call it upon creation too
//       immediate: true,
//       handler(productid) {
//         this.$rtdbBind('products', this.products.where('id', '==', this.productid)).then(products => {
//          debugger
//             this.product === products
//         })
//       },
//     },
//   },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/productstyle.scss";
    @import "~@/styles/commonstyle.scss";
</style>