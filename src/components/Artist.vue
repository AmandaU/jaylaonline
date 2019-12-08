<template>

<div :style="getContainerStyle()" >
  <!-- <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :on-cancel="onCancel"
            :loader="dots"
            :color="c45adb"
            :is-full-page="fullPage"></loading> -->
   <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> -->
      
   <!-- <div v-for="artist in artists" v-bind:key="artist.id"> -->
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
          <!-- <center> -->
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
          <!-- </center>  -->
        </div> 
       </div> 
  
    </div>
   <!-- </div> -->
</template>

<script>
import Loading from 'vue-loading-overlay';
import Media from 'vue-media'
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let artistsRef = db.ref('artists');

export default {
  name: 'product',

  props: {
     artistid: String,
     //Media,
     //Loading
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
        //self.artists = artists
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
           'position': 'relative',
          'max-width': '100vw',
          'height' : '100%',
          'min-height' : h,
          'width':'100%',
          //'float':'right',
          'display': 'flex',
          'flex-direction': 'row',
          'overflow-x': 'hidden',
          'align-self': 'center',
          'justify-content': 'center',
          'align-items': 'center',
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
                //'transition-delay': randomTransitionTime + 'ms'
              }
      
    },


  //   getColStyle: function (image) { 
  //      let w = this.containerWidth * 3/4
  //       var h = image.ratio * w;
  //           return  {
  //           'min-width':'100%',
  //           '-moz-column-count':'3',
  //           '-moz-column-gap': '0px',
  //           '-webkit-column-count':'3',
  //           '-webkit-column-gap': '0px',
  //           'column-count': '3',
  //           'column-gap': '0px',
  //           'padding-top': '10%',
  //           'padding-bottom': '10%'
  //         }
  // },



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