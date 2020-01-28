<template>
  
    <div :style="getContainerStyle()">
       <!-- <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :loader="dots"
        :color="blue"
        :is-full-page="fullPage"></loading> -->
   
    <media :query="{maxWidth: 800}" @media-enter="media600Enter" @media-leave="media600Leave"> </Media> 

        <div v-if="!isLoading" v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
            <div :style="getImageContainerStyle(product)"  v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">

                      <div class="flip-card">

                          <div  v-bind:class="[product.isFlipped ? 'doFlip' : 'doUnFlip']"
                              v-on:mouseleave="onUnHover(product)"
                              v-on:mouseover="onHover(product)">
                           
                            <div class="flip-card-front" >
                               <div :style="getImageStyle(product)"  >
                              <img  v-bind:src="product.images[0].url" alt="Avatar"  >
                               </div> 
                            </div> 
                      
                            <div class="flip-card-back">
                                <div :style="getImageStyle(product)"  >
                                   <div v-for="(image, index) in product.images" v-bind:key="index" v-bind:class="[index == product.flipIndex ? 'isVisible' : 'isInvisible']">
                                    <img   v-bind:src="product.images[index].thumbUrl" alt="Avatar" rel="preload" class="flip-thumb-image" >
                                    <img   v-bind:src="product.images[index].url" alt="Avatar" rel="preload" class="flip-image" >
                                   </div>
                                </div>
                            </div>

                          </div>

                     </div>  

            </div>
        </div> 

    </div>  
   
</template>

<script>
import { RepositoryFactory } from '../RepositoryFactory'
import Media from 'vue-media'
 import firebase from '../firebase-config';
import { db } from '../firebase-config';
const productsRef = db.ref('products')
const ExchangeRates = RepositoryFactory.get('rates')

export default {
  name: 'shop',

  components: {
     Media
   },

  data() {
      return {
        marginFactor: .9,
         isLoading: true,
        busy: false,
        products: [],
        numberOfProducts: 0,
        greaterThan600: window.innerWidth > 600,
        containerWidth: window.innerWidth > 800? (window.innerWidth * 0.9) * .33: window.innerWidth > 600? (window.innerWidth * 0.9) * .5: window.innerWidth * 0.9,
        showCheckout: false,
        hovering: false,
        loader: {},
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
   this.fetchRates()
    this.showCheckout = false
    this.addProducts()
    let self = this
    this.$rtdbBind('products', productsRef).then(products => {
       self.products === products
       let index = 0
        self.products.forEach(product => {
          const arrayResult = Object.keys(product.images).map(imagekey => {
              return product.images[imagekey]
          });
            product.images = arrayResult
           product.index = index
            product.isFlipped = false
          index += 1
  
         
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
      return this.products.length < 4
     
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

   async  fetchRates() {
    await ExchangeRates.getRates()
    // this.USDRate = ExchangeRates.USDRate
    // this.EURRate = ExchangeRates.EURRate
  },

  onHover(product) {

    if(!product.isFlipped) {
       product.flipIndex = product.flipIndex == product.images.length - 1 ? 1 : product.flipIndex += 1
    }
 },

  onUnHover(product) {
       product.isFlipped =  !product.isFlipped
    },

   handleWindowResize(event) { 
       let w = event.currentTarget.innerWidth * this.marginFactor
        if(window.innerWidth < 600)
        {
          this.containerWidth = w ;
        }
        else
        if(window.innerWidth < 800)
        {
          this.containerWidth = w * .5;
        }
        else
          this.containerWidth = w * .33; 
    },

    getImageStyle: function (product) { 
     var margin = 1
      if(this.products.length > 1) {
        margin = this.isMobile || !this.greaterThan600 ? 0.8 : 1
      } else {
        this.containerWidth + (this.containerWidth * this.marginFactor)
      }
      let w = this.containerWidth * margin
       return  {
          'background-color': 'white',
          'position': 'relative',
          'width': w + 'px',
          'height': w + 'px',
         'margin' : '0 auto',
      }
    },

    getImageContainerStyle: function (product) { 
      let w = this.containerWidth 
       return  {
          'width': w + 'px',
          'height': w + 'px',
          'position': 'relative',
          'margin' : '0 auto',
        }
    },

   getContainerStyle: function () { 
     let h = String(window.innerHeight - 90) + 'px'
      
         return  {
          'max-width': '100vw',
          'height' : '100%',
          'min-height' : h,
          'width':'100%',
          'float':'right',
          'display': 'flex',
          'overflow': 'auto',
          'align-self': this.showCheckout ? 'flex-start' : 'center',
          'justify-content': 'center',
          'align-items': this.showCheckout ? 'flex-start' :'center',
          'vertical-align': this.showCheckout ? 'flex-start' :'center',
          'perspective': window.innerWidth - 20,
          'margin-top': this.showCheckout ? '20px' : 'auto'
        //    ':hover .flip-card-inner' : {
        //       'transform': 'rotateY(180deg)'
        //  }
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
