<template>
  
    <div :style="getContainerStyle()">
       <!-- <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :loader="dots"
        :color="blue"
        :is-full-page="fullPage"></loading> -->
   
    <media :query="{maxWidth: 600}" @media-enter="media600Enter" @media-leave="media600Leave"> </Media> 
      
        <div  v-if="!isLoading" v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
            <div v-for="artist in artists"  v-bind:key="artist['.key']" v-on:click="navigateToItem(artist)">

              <div class="flip-card" :style="getImageStyle(artist)">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <img  v-bind:src="artist.photourl" alt="Avatar" :style="getImageStyle(artist)">
                  </div>
                  <div class="flip-card-back">
                    <img  v-bind:src="getHoverImage(artist)" alt="Avatar" :style="getImageStyle(artist)">
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
import { db } from '../firebase-config';
  const artistsRef = db.ref('artists')

export default {
  name: 'artists',

  components: {
     Media
   },

  data() {
      return {
        artists: [],
        numberOfArtists: 0,
        greaterThan600: window.innerWidth > 600,
        containerWidth: window.innerWidth > 800? window.innerWidth/3: window.innerWidth > 600? window.innerWidth/ 2: window.innerWidth,
        showCheckout: false,
        hover: false,
       // itemimages: [],
         isLoading: true,
         loader: {}
       }
    },

firebase () {
        return {
          //artists: db.ref('artists'),
          //itemimages: db.ref('itemimages'),
          //products: db.ref('products'),
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
    let self = this
    this.$rtdbBind('artists', artistsRef).then(artists => {
       self.artists === artists
       self.artists.forEach(artist => {
          const arrayResult = Object.keys(artist.images).map(imagekey => {
              return artist.images[imagekey]
          });
          artist.images = arrayResult
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
      return this.artists.length <= 4 
     
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

  getHoverImage: function (artist) {
    let images = artist.images
    const idx = Math.floor(Math.random() * images.length);
       
    return  images[idx].url
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

      getImageStyle: function (artist) { 
       var t = artist.ratio * this.containerWidth;
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


  media600Enter(mediaQueryString) {
      this.greaterThan600 = false
  },

  media600Leave(mediaQueryString) {
      this.greaterThan600 = true
  },

  navigateToItem(artist) {
      this.$router.replace({ name: 'artist', query: {artistid: artist.id}});
     
  },

},

}
</script>

<style lang="scss" scoped>
    @import "~@/styles/shopstyle.scss";
    @import "~@/styles/commonstyle.scss";
  </style>
