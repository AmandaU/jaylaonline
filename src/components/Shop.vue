<template>
  <div class="centralcontainer">
    <div class="centreblock">
    <br> <br>
    
       <div class="photocontainer">

     <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> 
      
        <div  class="cols">  
             <div  v-for="product in products"  v-bind:key="product['.key']" v-on:click="navigateToItems(product)">
                 <div  :style="getImageStyle(product)"  > 
                   <!-- <img src="@/assets/IMG_0758.jpg" :style="getImageStyle(project)"  >  -->
                  <!-- <img src="require('@/assets/IMG_0758.jpg')" :style="getImageStyle(project)"  >  -->
                  <img v-bind:src="product.linkphotourl" :style="getImageStyle(product)"  > 
                    <div  class="hoverLayer" >
                       <ul class="centerInHover" >  
                        <li >{{product.name}}</li>
                        <li >{{product.description}}</li>
                      </ul>
                  </div>  
                 </div> 
                  
               </div> 
        </div>  
    </div>
      
   </div>
  </div>
</template>

<script>

import { db } from '../firebase-config';
  
export default {
  name: 'shop',
  components: {
     // CubeSpin
    },
  data() {
      return {
         busy: false,
         products: [],
        greaterThan800: window.innerWidth > 800
     }
    },

firebase () {
        return {
          products: db.ref('products') ,
          // items: db.ref('items') ,
          // itemimages: db.ref('itemimages') ,
        }
      },

created() {
      //  this.$firebaseRefs.products.push({
      //                   id: "product2",
      //                   name: "Cargos burnt sienna",
      //                   descriptipon: "RudeBoyz pants they wore in Berlin",
      //                   linkphotourl: "12345",
      //                   ratio: "1"
      //   });
      //   this.$firebaseRefs.items.push({
      //                   productid: "product2",
      //                   number: "10",
      //                   size: "M"
      //   });
         
      //   this.$firebaseRefs.itemimages.push({
      //                   productid: "product2",
      //                   url: "jhjkhkj"
      //   });
       
 },

methods: {

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

    navigateToItems(product) {
        this.$router.replace({ name: 'Items', params: {productId: product.id}});
    },


},


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
