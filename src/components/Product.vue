<template>
 <div class="pagecontainer"> 
    <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>
     <div class="pricecolumn">
          <div  v-for="product in products" v-bind:key="product.id">
                <h1>{{ product.name }}</h1> 
                 <h2>{{ product.description }}</h2>
                 <br><br>
            <div class="priceblock">
               <div  v-for="item in items" :key="item['.key'] ">
                    <div class="itemrow">
                  
                        <div class="itemcolumn1">
                          <strong>Size {{item.size}},  R{{item.price}} each </strong>
                         
                        </div>  
    
                        <div  class="itemcolumn2">
                            <div v-show="!isAvailable(item)" class="itemdetail">SOLD OUT !! </div>
                        
                            <div v-show="isAvailable(item)" class="numberrow" >
                                
                                <div  class="itemselection ">
                                  <div  v-show="item.number> 0" class="itemdetail"> {{item.selected}}</div>
                                </div>  
                                <br>

                                <div  class="addminusbox">
                                  <img src="../assets/plus.jpg"  alt="plus"  @click="itemsSelected(item,true)" class="addminusimage"/>
                                  <img v-visible="item.selected > 0"  src="../assets/minus.png"  alt="minus"  @click="itemsSelected(item, false)" class="addminusimage"/><br>
                                </div>   
                          
                            </div> 
                        </div> 
                  
                    </div> 
                     <div class="thinline"></div>  
                  </div>
               </div>  
               <button  v-visible="totalItems > 0" @click="goToCheckout" class="buybutton">Go to checkout</button>
          </div> 

    </div> 
  
    <div class="productblock"> 
          
           <div  class="imagebox" v-for="image in itemimages" v-bind:key="image.productd">
                  <img v-bind:src="image.url" v-bind:alt="image.alt" >
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
      greaterThan600: window.innerWidth > 600,
      busy: false,
      items: [],
      itemimages: [],
      product: {},
      isMobile: false
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
 
    isMobileDevice: function()
    {
      return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i);
    },

     totalItems: function()
    {
      var total = 0;
      this.items.forEach(element => {
          total += element.selected;
       });
      return total ; 
   },
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

    goToCheckout: function() {
       var filteredData =   this.items.filter(function(pb) {
            return pb.selected > 0;
          });
        this.shoppingcart.pricebreaks = filteredData;
        const currentUser = firebase.auth().currentUser;
        localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
        if (!currentUser)
        {
          this.$router.replace({ name: 'Login', params: {shopref: this.shoppingcart.reference}});
        } 
        else
        {
           this.$router.replace({ name: 'Checkout', query: {shopref: this.shoppingcart.reference}});
        }
      },

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
  @import "~@/styles/productstyles.scss";
  </style>

