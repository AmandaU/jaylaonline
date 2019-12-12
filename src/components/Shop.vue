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
            <div   v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItem(product)">
              
              <!-- <transition :name="currentTransition" mode="out-in"> -->
                  <div class="flip-card" :style="getImageStyle(product)" 
                      ref="flipcard"
                      v-on:mouseleave="onUnHover(product)"
                      v-on:mouseover="onHover(product)"
                      >
                  
                      <div class="flip-card-inner" ref="flipInner"  >
                          <div class="flip-card-front">
                            <img  v-bind:src=" product.fronturl" alt="Avatar" class="baseImage" >
                          </div>
                        
                          <div class="flip-card-back">
                            <img  v-bind:src=" product.backurl" alt="Avatar" class="baseImage" >
                          </div>
                      </div>
        
                  </div>
               <!-- </transition> -->

                     
                  <!-- <div class="flip-card" :style="getImageStyle(product)" 
                   ref="flipcard"
                      v-on:mouseleave="flip(product)"
                      v-on:mouseover="setImage(product)" >
                  
                      <div class="flip-card-inner" ref="flipInner"  :style="'background-color: pink'">Front
                          <div class="flip-card-front">
                            <div   class="baseImage" >
                           </div>
                          </div>
                          <div class="flip-card-back"  :style="'background-color: blue'">Back
                            <div   class="baseImage" >
                           </div>
                             </div>
                      </div>
        
                  </div> -->



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
        mustFlip: false,
        isLoading: true,
        busy: false,
        products: [],
        numberOfProducts: 0,
        greaterThan600: window.innerWidth > 600,
        containerWidth: window.innerWidth > 800? window.innerWidth/3: window.innerWidth > 600? window.innerWidth/ 2: window.innerWidth,
        showCheckout: false,
        hovering: false,
        itemimages: [],
        loader: {},
        currentTransition :  'positive' 
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
          product.fronturl = product.images[0].url
          product.backurl = product.images[product.images.length -1].url
          product.isFlipped = false
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

  onHover(product) {
    //: 'negative';
        if(product.isFlipped) {
             product.fronturl = product.images[0]
            } else {
               product.backurl = product.images[product.images.length - 1].url
          }
            product.images.push(product.images.shift()); 
             product.isFlipped =  !product.isFlipped
             this.currentTransition =  'positive' 
     let self = this
     setTimeout(function(){ 
        self.$refs.flipInner[product.index].style.transformStyle = "flat"
        self.$refs.flipcard[product.index].style.transformStyle = "flat";
        self.$refs.flipcard[product.index].style.cursor = "pointer";
        self.$refs.flipcard[product.index].style.transition = "transform 0.5s ease-in-out";
        self.$refs.flipcard[product.index].style.transform = "scale(1.25)";
        self.$refs.flipcard[product.index].style.msTransform = "scale(1.25)"; 
        self.$refs.flipcard[product.index].style.WebkitTransform = "scale(1.25)";
         });
       
  },

  onUnHover(product) {
    let self = this
       setTimeout(function(){ 

          self.$refs.flipInner[product.index].style.transformStyle = "flat"
        self.$refs.flipcard[product.index].style.transformStyle = "flat";
       self.$refs.flipcard[product.index].style.cursor = "auto";
         self.$refs.flipcard[product.index].style.transition = "transform 0.5s ease-in-out";
       self.$refs.flipcard[product.index].style.transform = "scale(1)";
        self.$refs.flipcard[product.index].style.msTransform = "scale(1)"; 
        self.$refs.flipcard[product.index].style.WebkitTransform = "scale(1)";
          
     });
setTimeout(function(){ 
  this.currentTransition =  'negative' 
          if (!product.isFlipped) {
          
            self.$refs.flipInner[product.index].style.transition = "transform 0.5s ease-in-out";
            self.$refs.flipInner[product.index].style.transformStyle = "preserve-3d";
            self.$refs.flipcard[product.index].style.transformStyle = "preserve-3d";
            self.$refs.flipInner[product.index].style.WebkitTransform = "rotateY(0deg)"; 
            self.$refs.flipInner[product.index].style.msTransform = "rotateY(0deg)"; 
            self.$refs.flipInner[product.index].style.transform = "rotateY(0deg)"; 

         } else {
          
          self.$refs.flipInner[product.index].style.transition = "transform 0.5s ease-in-out";
          self.$refs.flipInner[product.index].style.transformStyle = "preserve-3d";
          self.$refs.flipcard[product.index].style.transformStyle = "preserve-3d";
          self.$refs.flipInner[product.index].style.WebkitTransform = "rotateY(180deg)"; 
          self.$refs.flipInner[product.index].style.msTransform = "rotateY(180deg)"; 
          self.$refs.flipInner[product.index].style.transform = "rotateY(180deg)"; 
         }
     
     });
 
       
  },

  // frontImage: function(product) {
  //    let images = product.images
  //   const idx = Math.floor(Math.random() * images.length);
  //   //product.hoverurl =  images[0].url 
  //   return images[0].url 
  // },

  //  backImage: function(product) {
  //   return product.images[product.images.length - 1].url 
  // },

  getHoverImage (product) {
      this.products.forEach( prod => {
            prod.mustFlip = false
        })
     product.images.push(product.images.shift()); 
     product.mustFlip = true
     
    // if (!this.$refs.flipInner) return
      this.$nextTick(() => {
     
       
      });
      let self = this
      setTimeout(function(){ 
        self.products.forEach( prod => {
            prod.mustFlip = false
        })
        
       }, 200);
     
    //   this.$refs.flipInner.style.WebkitTransform = "translateY(180deg)"; 
      
    //     this.$refs.flipInner.style.msTransform = "translateY(180deg)"; 
    //     this.$refs.flipInner.style.transform = "translateY(180deg)"; 
    //});
     
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
          'width': w + 'px',
          'height': t + 'px',
         'position': 'relative',
        //  'margin-right': '2px',
         
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
          // ':hover .flip-card-inner' : {
          //     'transform': 'rotateY(180deg)'
         // }
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
