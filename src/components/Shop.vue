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
            
               <!-- <div class="tile" :style="getImageStyle(product)" 
                      ref="hovercard"
                      v-on:mouseleave="onUnHover(product)"
                      v-on:mouseover="onHover(product)"
                      >
                            <transition name="flip" mode="out-in">
                         <div   v-for="(image, index) in product.images"  v-bind:key="image.productid" :ref="'flip' + product.id" > 
                              <div v-if="index == 0" class="card front" >
                                 <img  :src="image.url" alt="Avatar" class="baseImage" > 
                              </div>
                              <div v-if="index > 0" class="card back" >
                                <img  :src="image.url" alt="Avatar" class="baseImage" v-visible="product.flipIndex == index" > 
                              </div>
                         </div> -
                          </transition> -->

                     <div class="tile" :style="getImageStyle(product)" 
                       v-on:mouseleave="onUnHover(product)"
                       v-on:mouseover="onHover(product)"
                      >
                  
                  <!-- <div class="overlay">
                      <p class="overlay-text">I don't like this one</p>
                
                  </div> -->

                        <transition name="flip">
                              
                                      <img  v-if="!product.isFlipped" :src="product.images[0].url" alt="Avatar"   key="front" > 
                            
                                      <img  v-else :src="product.images[product.images.length - 1].url" alt="Avatar" key="back" > 
                            
                            </transition>

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
        isFlipped: false,
         isLoading: true,
        busy: false,
        products: [],
        numberOfProducts: 0,
        greaterThan600: window.innerWidth > 600,
        containerWidth: window.innerWidth > 800? (window.innerWidth * .8) * .33: window.innerWidth > 600? (window.innerWidth * .8) * .5: window.innerWidth * .8,
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
       let index = 0
        self.products.forEach(product => {
          const arrayResult = Object.keys(product.images).map(imagekey => {
              return product.images[imagekey]
          });
          product.images = arrayResult
           product.index = index
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


 
  onHover(product) {
   
    //  product.isFlipped =  !product.isFlipped


    // if(!product.isFlipped) {
    //   product.flipIndex = product.flipIndex == product.images.length - 1 ? 1 : product.flipIndex += 1
    // }
    
     // product.images.push(product.images.shift())

    //  if (product.isFlipped) {
    //    product.fronturl = product.images[0].url
       
    //  } else {
    //    product.backurl = product.images[product.images.length - 1].url
    //  }
    //      product.componentKey += 1  
    // let self = this
    //  setTimeout(function(){  
    //     self.$refs.hovercard[product.index].style.transition = ""
    //      self.$refs.hovercard[product.index].style.WebkitTransform = ""; 
    //       self.$refs.hovercard[product.index].style.msTransform = ""; 
    //       self.$refs.hovercard[product.index].style.transform = ""; 

    //     self.$refs.hovercard[product.index].style.cursor = "pointer";
    //     self.$refs.hovercard[product.index].style.transition = "transform 0.3s ease-in-out";
    //     self.$refs.hovercard[product.index].style.transform = "scale(1.25)";
    //     self.$refs.hovercard[product.index].style.msTransform = "scale(1.25)"; 
    //     self.$refs.hovercard[product.index].style.WebkitTransform = "scale(1.25)";
    //   });
  },

  onUnHover(product) {

      product.isFlipped =  !product.isFlipped
    

    // let self = this
    //    setTimeout(function(){ 
    //        self.$refs.hovercard[product.index].style.cursor = "auto";
    //       //self.$refs.hovercard[product.index].style.transition = "transform 0.5s ease-in-out";
    //       self.$refs.hovercard[product.index].style.transform = "scale(1)";
    //       self.$refs.hovercard[product.index].style.msTransform = "scale(1)"; 
    //       self.$refs.hovercard[product.index].style.WebkitTransform = "scale(1)";
    //   });
    //    self.$refs.hovercard[product.index].style.transformStyle = "preserve-3d";
    //   setTimeout(function(){ 
      
        // self.$refs.hovercard[product.index].style.transition = "transform 0.5s ease-in-out";
        // if (product.isFlipped) {
        //   self.$refs.hovercard[product.index].style.WebkitTransform = "rotateY(0deg)"; 
        //   self.$refs.hovercard[product.index].style.msTransform = "rotateY(0deg)"; 
        //   self.$refs.hovercard[product.index].style.transform = "rotateY(0deg)"; 
           
        // } else {
              // self.$refs.hovercard[product.index].style.WebkitTransform = "rotateY(180deg)"; 
              // self.$refs.hovercard[product.index].style.msTransform = "rotateY(180deg)"; 
              // self.$refs.hovercard[product.index].style.transform = "rotateY(180deg)"; 
        // }
        
 
    // },310);
       
  },

 

   handleWindowResize(event) { 
     let w = event.currentTarget.innerWidth * .8
        if(window.innerWidth < 600)
        {
          this.containerWidth = w;
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
      let w = this.containerWidth 
      var t = product.ratio * w;
        return  {
          'width': w + 'px',
          'height': t + 'px',
          'position': 'relative',
         // 'transform-style' : 'preserve-3d',
         // 'transform' : '0.5s ease-in-out'
          
      }
    },

   getContainerStyle: function () { 
     let h = String(window.innerHeight - 20) + 'px'
      
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
          'perspective': window.innerWidth - 20
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
