<template>
  
    <div :style="getContainerStyle()">
       <!-- <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :loader="dots"
        :color="blue"
        :is-full-page="fullPage"></loading> -->
   
    <media :query="{maxWidth: 600}" @media-enter="media600Enter" @media-leave="media600Leave"> </Media> 
      
        <div v-if="!isLoading" v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
            <div v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">

              <!-- <div class="flip-card" :style="getImageStyle(product)">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <img  v-bind:src="product.linkphotourl" alt="Avatar" :style="getImageStyle(product)">
                  </div>
                   <div class="flip-card-back">
                    <img  v-bind:src="getHoverImage(product)" alt="Avatar" :style="getImageStyle(product)">
                  </div>
                </div>
              </div> -->

               <div :style="getImageStyle(product)" 
                  v-on:mouseenter="getHoverImage(product)">
                    <img  v-bind:src="product.linkphotourl" alt="Avatar" class="baseImage" >
                    <img v-if="product.hoverurl != ''" :src="product.hoverurl" alt="Avatar"  class="hoverImage">
               </div>

            </div>
        </div> 

    </div>  
   
</template>

<script>
import Media from 'vue-media'
 import firebase from '../firebase-config';
import { db } from '../firebase-config';
  const productsRef = db.ref('products')

export default {
  name: 'shop',

  components: {
     Media
   },

  data() {
      return {
        isLoading: true,
        busy: false,
        products: [],
        numberOfProducts: 0,
        greaterThan600: window.innerWidth > 600,
        containerWidth: window.innerWidth > 800? window.innerWidth/3: window.innerWidth > 600? window.innerWidth/ 2: window.innerWidth,
        showCheckout: false,
        hovering: false,
        itemimages: [],
         loader: {}
       }
    },

firebase () {
        return {
         
         }
      },

 beforeDestroy: function () {
  window.removeEventListener('resize', this.handleWindowResize)
},

mounted() {
  window.addEventListener('resize', this.handleWindowResize);
 
  let self = this;
  this.$eventHub.$on('showCheckout', ()=> {
       self.showCheckout = !self.showCheckout;
  });
},

 created () {
    this.showCheckout = false
    this.addProducts()
    let self = this
    this.$rtdbBind('products', productsRef).then(products => {
       self.products === products
       self.products.forEach(product => {
          const arrayResult = Object.keys(product.images).map(imagekey => {
              return product.images[imagekey]
          });
          product.images = arrayResult
          self.getHoverImage(product)
       });
       self.loader.hide()
       self.isLoading = false
    });

      this.loader = this.$loading.show({
                loader: 'dots',
                 color: 'blue'
            });
       
    },

 computed: {

   isRow: function () {
       if (this.isMobile || !this.greaterThan600) {
        return true
      } 
      return this.products.length <= 4 
     
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

  getHoverImage(product) {
     let images = product.images
    const idx = Math.floor(Math.random() * images.length);
    product.hoverurl =  images[idx].url 
  },

   handleWindowResize(event) { 
        if(window.innerWidth < 600)
        {
          this.containerWidth = event.currentTarget.innerWidth;
        }
        else
        if(window.innerWidth < 800)
        {
          this.containerWidth = event.currentTarget.innerWidth/2 - 20;
        }
        else
          this.containerWidth = event.currentTarget.innerWidth/3 - 40; 
    },

    getImageStyle: function (product) { 
      let w = this.containerWidth
     
      var t = product.ratio * w;
        return  {
        // 'background-color':'rgb(255, 255, 255)',
        // 'max-width': '100%',
          'width': w + 'px',
          'height': t + 'px',
        //'align-self': 'center',
         'position': 'relative',
      }
    },

   getContainerStyle: function () { 
     let h = String(window.innerHeight - 120) + 'px'
         return  {
          
          'max-width': '100vw',
          'height' : '100%',
          'min-height' : h,
          'width':'100%',
          'float':'right',
          'display': 'flex',
          'overflow': 'auto',
          'align-self': 'center',
          'justify-content': 'center',
          'align-items': 'center',
          'vertical-align': 'center',
          ':hover .flip-card-inner' : {
              'transform': 'rotateY(180deg)'
          }
         }
            
    },

  addProducts ()
   {
    //  this.$firebaseRefs.artists.push({
    //                     id: "artist1",
    //                     name: "Lady Gaga",
    //                     photourl: "12345"
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

  media600Enter(mediaQueryString) {
      this.greaterThan600 = false
  },

  media600Leave(mediaQueryString) {
      this.greaterThan600 = true
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
