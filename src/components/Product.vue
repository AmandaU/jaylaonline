<template>
 <div class="page"> 
    <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>
  <div class="navcolumn">
    <div  v-for="product in products" v-bind:key="product.id">
            <h1>{{ product.name }}</h1>
      <!-- <p v-html="splurb"></p> -->
      <h2>{{ product.description }}</h2>
   </div>

     <div class="pricebreakblock">
             <div  v-for="item in items" :key="item['.key'] ">
              <div class="pricebreakrow">
            
                <div class="pricebreakcolumn1">
                   <strong>Size {{item.size}},  R{{item.price}} each </strong>
                  <small>{{ total(item) }}</small>
                </div>

                <div  class="pricebreakcolumn2">
                     <div v-show="!isAvailable(item)" class="pricebreakdetailitem">SOLD OUT !! </div>
                
                     <div v-show="isAvailable(item)" class="pricebreaknumberrow" >

                        <div  class="ticketselection ">
                          <div  v-show="item.number> 0" class="pricebreakdetailitem"> {{item.selected}}</div>
                        </div>  
                        <br>

                        <div  class="pricebreakbuttonbox">
                          <img src="../assets/plus.jpg"  alt="plus"  @click="itemsSelected(item,true)" class="pricebreakimage"/>
                          <img v-show="item.selected > 0" src="../assets/minus.png"  alt="minus"  @click="itemsSelected(item, false)" class="pricebreakimage"/><br>
                        </div>   
                  
                    </div> 
                </div>  

                 <div class="thinline"></div>  

              </div> 
             </div> 
  </div> 

  </div>
  <div class="centreblock"> 
    <div v-bind:class="[isMobile ? 'productcontainercol' : 'productcontainerrow']">
          <div v-bind:class="[isMobile ? 'imageboxcol' : 'imageboxrow' ]"  v-for="image in itemimages" v-bind:key="image.productd">
              <img v-bind:src="image.url" v-bind:alt="image.alt" >
          </div> 
    </div> 
   </div> 
</div>
 
</template>

<script>
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let productsRef = db.ref('products');
//let itemsRef = deb.ref('items');
export default {
  name: 'product',

  props: {
     productid: String,
   },

  data() {
    return {
      greaterThan800: window.innerWidth > 800,
      busy: false,
      items: [],
      itemimages: [],
      product: {}
    }
  },

firebase () {
   let productid =  this.$props.productid;
  //  if (productid == null) {
  //     var index = window.location.hash.indexOf("=");
  //     if(index >= 0)
  //     {
  //         productid =  window.location.hash.substring(index+1,window.location.hash.length) ;
  //     }
  //  }
    
    return {
      items: db.ref('items').orderByChild("productid").equalTo(productid) ,
      itemimages: db.ref('itemimages').orderByChild("productid").equalTo(productid),  
       products:  db.ref('products').orderByChild("id").equalTo(productid)
    }
},

 computed: {
 
    isMobile: function()
    {
      return !this.greaterThan800 ||
      (navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)) ;
    }
  },

methods: 
{ 
  media800Enter(mediaQueryString) {
    this.greaterThan800 = false
  },
  media800Leave(mediaQueryString) {
    this.greaterThan800 = true
  },

  itemsSelected: function( item, add) {
   if(item.number == 0 && !add)return;
    if(item.selected > item.number)
    {
      alert("no more items");
      return;
    }
     if(add ){
       item.selected += 1
     }
     else {
       item.selected -= 1
     }
   },

           
  total : function(item) {
      if(this.isAvailable(item))
      {
         if( item.selected == 0) return  "";
          let total = Number(item.selected) * Number(item.price);
          return 'You will purchase  ' +  item.selected + ' at R' + item.price + ' each. The total is ' + String('R ' + total + '.00');
      }
    },

   isAvailable : function(item) {
   
        return true;
     
     },

    // totalTicketValueForPriceBreak: function(pricebreak){
    //   var value = Number(pricebreak.tickets * pricebreak.price);
    //   return value == 0? "R 0.00": String('R ' + value + '.00');
    // },

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

 created () {
      const pid = this.$route.params.productid;
     this.$rtdbBind('products', productsRef.orderByChild("id").equalTo(pid)).then(products => {
      this.product = products[0];
     });

    //  this.$rtdbBind('items', itemsRef.orderByChild("productid").equalTo(productid)).then(items => {
    //   debugger
    //    this.items.forEach((item) => {
    //        item.itemsselected = 0;
    //     });
    //  });
    
  },


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>

