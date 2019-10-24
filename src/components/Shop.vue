<template>
   <div class="centralcontainer">
   
  <div class="photocontainer">
     <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> 
      
       <div  v-bind:class="[isRow ? 'rowstyle' : 'cols']">  
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
     }
    },

firebase () {
        return {
          items: db.ref('items'),
          itemimages: db.ref('itemimages'),
          products: db.ref('products'),
         }
      },

//  created: function () {
//   this.addProducts();
//  },

 created () {
    //   this.$rtdbBind('products', products.orderByKey()).then(products => {
    //     this.products === products;
    //     this.numberOfProducts = products.length
    //  });
    },

 computed: {
  isRow: function () {
    return this.greaterThan800 ?  this.products.length <= 4 : false;
    }
  },

methods: {

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

    navigateToItems(product) {
        this.$router.replace({ name: 'Items', params: {productId: product.id}});
    },


},


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
