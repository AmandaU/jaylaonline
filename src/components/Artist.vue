<template>

<div :style="getContainerStyle()" >
     <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> -->
      
    <div class="artistcontainer">
    
         <div v-if="!isLoading" class="biocolumn" >
           <center>
               <img v-bind:src="artist.logo" v-bind:alt="artist.name" style="height: 50px; width: auto;">
                <h1 align="center"> {{ artist.name }} </h1> 
               <img v-bind:src="artist.photourl" v-bind:alt="artist.name" style="height: 100px; width: auto;">
                <h5 align="center"> {{ artist.bio }} </h5> 
                 <br>
                 </center>
         </div> 
       
        <div  class="imagecontainer" ref="imageRef"> 
            <div  v-if="!isLoading" v-bind:class="[isRow ? 'rowstyle' : 'cols']"> 
              <div v-for="image in artist.images" v-bind:key="image.url">
                <div  :style="getImageStyle(image)"  > 
                    <img v-bind:src="image.url" :style="getImageStyle(image)"  > 
                      <div  class="hoverLayer" >
                        <div class="centerInHover" >  
                          <h5 style="color: white">{{artist.name}}</h5>
                          <h5 style="color: white">{{image.description}}</h5>
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
import Media from 'vue-media'
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let artistsRef = db.ref('artists');

export default {
  name: 'product',

  props: {
     artistid: String,
    },

  data() {
    return {
      //greaterThan800: window.innerWidth > 800,
      containerWidth: window.innerWidth > 800? window.innerWidth/4: window.innerWidth > 600 ? window.innerWidth/2 : window.innerWidth,
       artists: [],
       artist: {
         logo: "",
         photourl: "",
         name: "",
         description: "",
         images: []
       },
      isLoading: true,
      loader: {}   
     }
  },

firebase () {
 
},

 beforeDestroy: function () {
  window.removeEventListener('resize', this.handleWindowResize)
},

mounted() {
    window.addEventListener('resize', this.handleWindowResize);      
},

created () {
   let self = this
    this.$rtdbBind('artists', artistsRef.orderByChild("id").equalTo(this.$props.artistid).limitToFirst(1)).then(artists => {
     for(var key in artists.val()){
            console.log("snapshot.val" + artists.val()[key]);
          self.artist = artists.val()[key];
        }
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
       if (this.isMobile || this.lessThan600) {
        return false
      }
       return this.artist.images < 4
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
methods: 
{ 
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
      }
       
    },

     getImageStyle: function (image) { 
         let randomTransitionTime =  Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
         let w = this.containerWidth //* 0.8
         let h = image.ratio * w;
              return  {
              'max-width': '100%',
              'width': h + 'px',
              'height': w + 'px',
              'position': 'relative',
              'padding-top': '2px',
              'transition': 'all ' + randomTransitionTime + 'ms',
              }
    },

  // media800Enter(mediaQueryString) {
  //   this.greaterThan800 = false
  // },
   
  // media600Leave(mediaQueryString) {
  //   this.greaterThan800 = true
  // },

   handleWindowResize(event) { 
      if(window.innerWidth < 600)
      {
        this.containerWidth = event.currentTarget.innerWidth ;
      }
      else
      if(window.innerWidth < 800)
      {
        this.containerWidth = event.currentTarget.innerWidth/2 ;
      }
      else
        this.containerWidth = event.currentTarget.innerWidth/4; 
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
    @import "~@/styles/commonstyle.scss";
    @import "~@/styles/artiststyle.scss";
</style>