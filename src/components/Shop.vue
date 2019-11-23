<template>
  
    <div :style="getContainerStyle()">
   
    <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>  -->
      
     <div class="imagecontainer">
        <div class="column" v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">
           <!-- <div class="column"> -->
              <div class="productimage">
               <img v-bind:src="product.linkphotourl" >
              </div>
              <div class="hovercolumn">
                <h2 >{{product.name}}</h2>
              </div>
           <!-- </div> -->
        </div>
  
     </div>
                
    </div>  
 
   
</template>

<script>
 import firebase from '../firebase-config';
import { db } from '../firebase-config';
 //const products = db.ref('products')
export default {
  name: 'shop',
  components: {
     // CubeSpin
    },
  data() {
      return {
         busy: false,
         products: [],
         numberOfProducts: 0,
        greaterThan800: window.innerWidth > 800,
        containerWidth: window.innerWidth > 800? window.innerWidth/3: window.innerWidth > 600? window.innerWidth/ 2: window.innerWidth,
        showCheckout: false
     }
    },

firebase () {
        return {
         // items: db.ref('items'),
          itemimages: db.ref('itemimages'),
          products: db.ref('products'),
         }
      },

mounted() {

  let self = this;
  this.$eventHub.$on('showCheckout', ()=> {
       self.showCheckout = !self.showCheckout;
  });
},

 created () {
    this.showCheckout = false
    },

 computed: {
   isRow: function () {
      if (this.isMobile) {
        return false
      } 
      if (this.products.length <= 4 ) {
        return true
      }
      return !this.greaterThan800 ;
    },

    isMobile: function()
    {
        return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
    }
  },
 
methods: {

   getContainerStyle: function () { 
     let h = String(window.innerHeight - 120) + 'px'
         return  {
          'max-width': '100vw',
          'height' : '100%',
          'min-height' : h,
          'width':'100%',
          'float':'right',
          'display': 'flex',
          'overflow-y': 'auto',
          'align-self': 'center',
          'justify-content': 'center',
          'align-items': 'center',
      }
    },

  addProducts ()
   {
    //  this.$firebaseRefs.products.push({
    //                     id: "product3",
    //                     name: "TShirt",
    //                     descriptipon: "RudeBoyz t-shirt special",
    //                     linkphotourl: "12345",
    //                     ratio: "1"
    //     });
    //     this.$firebaseRefs.items.push({
    //                     productid: "product2",
    //                     number: "10",
    //                     size: "S"
    //     });
         
        // this.$firebaseRefs.itemimages.push({
        //                 productid: "product2",
        //                 url: "jhjkhkj"
        // });
   },

  media800Enter(mediaQueryString) {
      this.greaterThan800 = false
  },

  media800Leave(mediaQueryString) {
      this.greaterThan800 = true
  },

  getImageStyle: function (product) { 
      // var t = 1.34 * this.containerWidth;
      var t = product.ratio * this.containerWidth;
        return  {
          'background-color':'rgb(255, 255, 255)',
          'max-width': '100%',
          'width': this.containerWidth + 'px',
          'height': t + 'px',
          'position': 'relative'
        
      }
  },

  navigateToItem(product) {
      this.$router.replace({ name: 'Product', query: {productid: product.id}});
     
  },

},

}
</script>

<style lang="scss" scoped>
    @import "~@/styles/shopstyle.scss";
    @import "~@/styles/commonstyle.scss";
  </style>
