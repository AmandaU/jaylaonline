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
            
              <button   @click="continueShopping" class="buybutton">continue shopping</button><br/>
              <button  v-visible="totalItems > 0" @click="addToShoppingCart" class="buybutton">add to shopping cart</button><br/>
              <button   v-visible="totalItems > 0" @click="goToShipping" class="buybutton">check out</button>

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
     currentPage: String,
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
  if (this.$props.productid == null) {
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
      if (this.$props.currentPage) {
        this.addToShoppingCart()
      }
  },

  created () {
    let self = this
    this.$rtdbBind('products', productsRef.orderByChild("id").equalTo(this.productid).limitToFirst(1)).then(products => {
      for(var key in products.val()){
          console.log("snapshot.val" + products.val()[key]);
        self.product = products.val()[key];
      }
    });

    //  this.$rtdbBind('items', itemsRef.orderByChild("productid").equalTo(this.productid).limitToFirst(1)).then(items => {
    //    debugger
    //   self.items = items
    // });
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

  itemsSelected( item, add) {
    if(item.number == 0 && !add)return;
    
    if(add && item.selected > item.number) {
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

  createOrderItem (item) {
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

  continueShopping () {
      this.$router.replace({ name: 'Shop'});
  },
 
  goToShipping () {
     let currentuser = firebase.auth().currentUser;
      if (!currentuser){
         this.$router.replace({ name: 'Login', params: {currentPage: 'Product'}});
      }  else {
        this.$router.replace({ name: 'Shipping'});
      }
  },

  addToShoppingCart () {
debugger
     let currentuser = firebase.auth().currentUser;
     if(!currentuser){
        this.$router.replace({ name: 'Login', params: {currentPage: 'Product'}});
        return
     }

     this.isLoggedin = true
    
    if(localStorage.getItem(currentuser.uid)) {
        this.shoppingcart = JSON.parse(localStorage.getItem(currentuser.uid));
     } else {
       this.initialiseShoppingCart()
     }

    var totalItems = 0
    this.items.forEach(item => {
        var existingitem = this.shoppingcart.items.find(existing => {
        if (existing.key == item['.key']) {
            return existing;
         }
        });

         totalItems += item.selected
        
        if(existingitem) {
          existingitem.number += item.selected
        } else {
          this.createOrderItem(item)
        }
     });
      this.shoppingcart.totalitems = totalItems
      this.$eventHub.$emit('shoppingcarttotal', totalItems);
      localStorage.setItem(currentuser.uid, JSON.stringify(this.shoppingcart));
  },

  initialiseShoppingCart() {
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
  @import "~@/styles/productstyles.scss";
</style>