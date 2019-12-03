<template>
  
    <div :style="getContainerStyle()">
   
    <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>  -->
      


     <!-- <div class="imagecontainer"> -->

       <!-- <div  v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
            <div v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">
              <div  v-on:mouseover="hover = !hover" :style="getImageStyle(product)"  > 
                  <img  :style="getImageStyle(product)" 
                  v-bind:src="product.linkphotourl" 
                  v-bind:alt="product.name" />
                 
                  <div  class="hoverLayer" >
                     <img v-if="hover" :style="getImageStyle(product)"  :src="getHoverImage(product.id)"  v-bind:alt="product.name" /> 
                  </div>
              </div>  
           </div>
        </div>  -->

        <div  v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
            <div v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">

              <div class="flip-card" :style="getImageStyle(product)">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <img  v-bind:src="product.linkphotourl" alt="Avatar" :style="getImageStyle(product)">
                  </div>
                  <div class="flip-card-back">
                    <img  v-bind:src="getHoverImage(product.id)" alt="Avatar" :style="getImageStyle(product)">
                  </div>
                </div>
              </div>

            </div>  
        </div> 

       


        <!-- <div class="column" v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">
              <div class="productimage">
               <img v-bind:src="product.linkphotourl" >
              </div>
              <div class="hovercolumn">
                <h2 >{{product.name}}</h2>
              </div>
          </div> -->
  
     <!-- </div> -->
                
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
        showCheckout: false,
        hover: false,
        itemimages: []
       }
    },

firebase () {
        return {
          //artists: db.ref('artists'),
          itemimages: db.ref('itemimages'),
          products: db.ref('products'),
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

  
 getHoverImage: function (id) {
   let images = this.itemimages.filter(image=> {
     if (image.productid == id) return image
   })
   const idx = Math.floor(Math.random() * images.length);
   
    return this.itemimages[idx].url

   },

   handleWindowResize(event) { 
        if(window.innerWidth < 600)
        {
          this.containerWidth = event.currentTarget.innerWidth;
        }
        else
        if(window.innerWidth < 800)
        {
          this.containerWidth = event.currentTarget.innerWidth/2;
        }
        else
          this.containerWidth = event.currentTarget.innerWidth/3; 
    },

      getImageStyle: function (product) { 
       var t = product.ratio * this.containerWidth;
          return  {
         // 'background-color':'rgb(255, 255, 255)',
          // 'max-width': '100%',
           'width': this.containerWidth + 'px',
           'height': t + 'px',
          //'align-self': 'center',
          // 'position': 'relative',
          
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

  media800Enter(mediaQueryString) {
      this.greaterThan800 = false
  },

  media800Leave(mediaQueryString) {
      this.greaterThan800 = true
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
