<template>
 <div class="pagecontainer"> 

   
     <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>
     <div class="pricecolumn">
       <div>
                <h1>{{ product.name }}</h1> 
                 <h2>{{ product.description }}</h2>
                  <br><br>
        
            <div class="priceblock">
               <div  v-for="item in items" :key="item['.key']">
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
              <button  v-visible="totalItems > 0" @click="goToShipping" class="buybutton">Checkout</button>

          </div> 
   </div> 
  
   
            <div class="imageblock">  
           
           <div  v-for="image in itemimages" v-bind:key="image.productd">
             
                  <img v-bind:src="image.url" v-bind:alt="image.alt" >
              </div>  
           
             </div> 
 
 
  </div> 
</template>

<script>
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let productsRef = db.ref('products');

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
      isMobile: false,
      shoppingcart: null,
      products:[]
     }
  },

firebase () {
   let pid =  this.$props.productid;
   if (pid == null) {
      var index = window.location.hash.indexOf("=");
      if(index >= 0)
      {
          this.productid =  window.location.hash.substring(index+1,window.location.hash.length) ;
      }
   }
    
    return {
      items: db.ref('items').orderByChild("productid").equalTo(this.productid) ,
      itemimages: db.ref('itemimages').orderByChild("productid").equalTo(this.productid),  
     // products:  db.ref('products').orderByChild("id").equalTo(productid).limitToFirst(0)
    }
},

  mounted() {
      this.initialiseShoppingCart();
  },

  created () {
    let self = this
    this.$rtdbBind('products', productsRef.orderByChild("id").equalTo(this.productid).limitToFirst(1)).then(products => {
      for(var key in products.val()){
          console.log("snapshot.val" + products.val()[key]);
        self.product = products.val()[key];
      }
    });
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
    
    if(add && item.selected > item.number)
    {
      alert("no more items");
      return;
    }
     var existingitem = this.shoppingcart.items.find(existing => {
        if (existing.key == item['.key']) {
            return existing;
         }
     });

     if(add ){
       item.selected += 1
       this.shoppingcart.totalitems +=1

        if(existingitem) {
          existingitem.number += item.selected
        } else {
          this.createOrderItem(item)
        }
     }
     else {
       item.selected -= 1
       this.shoppingcart.totalitems -=1
       
        if(existingitem) {
          if (item.selected == 0) {
            this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(existingitem), 1);
          } else {
            existingitem.number -= item.selected
          }
        } else {
          this.createOrderItem(item)
        }
     }
     this.$eventHub.$emit('shoppingcart', this.shoppingcart);
     localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
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

  createOrderItem(item) {
    let orderitem = {
      key: item['.key'],
      productid: item.productid,
      price: item.price,
      size: item.size,
      number: item.selected,
      productname: this.product.name,
      isSelected: false
  }
     this.shoppingcart.items.push(orderitem)
  },
 
  goToShipping: function() {
      localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      if (this.shoppingcart.userid == "")
      {
        this.$router.replace({ name: 'Login', params: {goToCheckout: true}});
      } 
      else
      {
        this.$router.replace({ name: 'Shipping'});
      }
  },

  initialiseShoppingCart() {
      const currentUser = firebase.auth().currentUser;
      let cartref = 'jaylashop'
      if(localStorage.getItem(cartref))
      {
          this.shoppingcart = JSON.parse(localStorage.getItem(cartref));
      }

      if(!this.shoppingcart) {
        this.shoppingcart = {
          email: currentUser? currentUser.email: "",
          name: "",
          userid: currentUser? currentUser.uid: "",
          reference: 'JaylaShop' + Math.random().toString(36).substr(2, 9),
          purchasevalue: 0,
          totalPaid: 0,
          totalitems: 0,
          items: [],
          deliveryfee: 0,
          zapperPaymentMethod: false,
          zapperPaymentId: 0,
          zapperReference: ""
        };
      }
    }
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
</script>

<style lang="scss" scoped>
  @import "~@/styles/productstyles.scss";
  </style>

