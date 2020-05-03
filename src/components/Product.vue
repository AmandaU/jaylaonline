<template>
   
   <div class="productcontainer" >
     <media :query="{maxWidth: 600}" @media-enter="media600Enter" @media-leave="media600Leave"> </Media>
   
         <div v-if="!isLoading" class="left" >
           
            <div class="priceblock"  :key="componentKey">
               <h3>{{ product.name }}</h3> 
              <div>{{ product.description }}</div>
              <br>
               <div class="pricerow">
                <div>R {{ product.price }}</div>
                <div v-if="USDRate > 0">$ {{dollarPrice}}</div>
                <div v-if="EURRate > 0">&#163; {{ euroPrice }}</div>
              </div>
              <small>Dollar and euro price at today's rates</small>
              <br><br>
              <div  class="itemcol" v-for="item in product.items" :key="item['.key']" >
                  <div class="itemrow">
                      <div class="itemcolumn1">
                        <!-- <h5>Size {{item.size}},  R{{item.price}}</h5> -->
                        <h5>Size {{item.size}}</h5>
                      </div>  

                      <div  class="itemcolumn2">
                          
                           <h5 v-show="!isAvailable(item)" class="numberrow">SOLD OUT</h5>
                          <div v-show="isAvailable(item)" class="numberrow" >
                              
                              <div  class="itemselection ">
                                <div  v-show="item.number > 0" class="itemdetail"> {{item.selected}}</div>
                              </div>  
                              <br>

                              <div  class="addminusboxcontainer">
                                 <div :disabled="item.selected == 0" v-bind:class="[item.selected > 0 ? 'enabled' : 'disabled']"    @click="itemsSelected(item, false)" class=" addminusbox minus" >-</div><br>
                                  <div :disabled="item.number <= item.selected" v-bind:class="[item.number > item.selected ? 'enabled' : 'disabled']"    @click="itemsSelected(item,true)" class=" addminusbox plus">+</div>
                               </div>   
                        
                          </div> 
                      </div> 
                  </div> 
                  <div class="thinline"></div> 
              </div>
                 <br>
               <button   @click="continueShopping" class="buttonstyle">MORE SHOPPPING</button>
               <button   v-visible="showCheckoutButton" @click="gotoShipping" class="buttonstyle">CHECK OUT</button>
                <br>
            </div>   
           
        </div> 


        <div class="right">
                <div v-if="!isLoading" class="imageblock">  
                    <div  class="imgContainer" v-for="image in product.images" v-bind:key="image.productid"  >
                      <img v-bind:src="image.url" v-bind:alt="image.alt"  class="mainimage" v-bind:style='{ backgroundImage: imageThumbUrl(image) }' >
                    </div>  
                </div>
        </div>
    </div>
  
</template>

<script>
import { RepositoryFactory } from '../RepositoryFactory'
import Media from 'vue-media'
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let productsRef = db.ref('products');
let artistsRef = db.ref('artists');

const ExchangeRates = RepositoryFactory.get('rates')

export default {
  name: 'product',

   components: {
     Media
   },

  props: {
     productid: String,
   },

  data() {
    return {
      lessThan600: window.innerWidth < 600,
      componentKey: 0,
      haveArtist: false,
      product: {},
      artists: [],
      artist: {},
      shoppingcart: {},
      products:[],
      currentuser: null,
      showCheckout: false,
      USDRate: 0,
      EURRate: 0
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
       artists:  db.ref('artists')
    }
},

mounted() {
    let self = this;

    this.$eventHub.$on('showCheckout', ()=> {
        self.showCheckout = !self.showCheckout;
    });

    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       if(sessionStorage.getItem('jaylashop'))
      {
        self.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
      }
   });

   this.$eventHub.$on('removeitem', (item)=> {
       var productItem = self.product.items.find(pi => pi.key == item.key)
        if(productItem)
        {
          productItem.selected = 0;
        }
        self.componentKey += 1
      });
},

created () {
   this.fetchRates()
   this.showCheckout = false
   if(sessionStorage.getItem('jaylashop'))
    {
      this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
    }
    else {
       this.initialiseShoppingCart()
     }
    let self = this
    this.$rtdbBind('products', productsRef.orderByChild("id").equalTo(this.productid).limitToFirst(1)).then(products => {
      for(var key in products.val()){
          console.log("snapshot.val" + products.val()[key]);
          self.product = products.val()[key];
       }
      
      const imageArray = Object.keys(self.product.images).map(imagekey => {
          return self.product.images[imagekey]
      });
       self.product.images = imageArray

       const itemArray = Object.keys(self.product.items).map(itemkey => {
         let item = self.product.items[itemkey]
         item.key = itemkey
          return item
      });
       
       self.product.items = itemArray
       self.product.items.forEach(pi => {
            var shoppingCartItem = self.shoppingcart.items.find(si => si.key == pi.key)
            if(shoppingCartItem)
            {
              pi.selected = shoppingCartItem.number;
            }
        })
     
       self.loader.hide()
       self.isLoading = false
     });

    this.isLoading = false
        this.loader = this.$loading.show({
                  loader: 'dots',
                  color: 'grey'
    });
},

 computed: {

   dollarPrice: function() {
      return Math.round(this.product.price * this.USDRate)
   },
   euroPrice: function () {
      return Math.round(this.product.price * this.EURRate)
   },

   showCheckoutButton: function () {
     if (this.shoppingcart) {
       return this.shoppingcart.totalitems > 0
     } else return false
   },

    isMobile: function()
    {
      return this.lessThan600 ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i);
    },
 
  },

watch: {
    'product.artistid': {
      // call it upon creation too
      deep: true,
      handler(artistid) {
        this.getArtist(artistid)
      },
    },
  },

methods: {

  async  fetchRates() {
    await ExchangeRates.getRates()
    // debugger
    this.USDRate = ExchangeRates.USDRate
    this.EURRate = ExchangeRates.EURRate
  },

    imageThumbUrl: function(image) {
         return 'url('+ image.thumburl + ')';
     },

 
 getArtist(artistid) {
   let self = this
      this.$rtdbBind('artists', artistsRef.orderByChild("id").equalTo(artistid).limitToFirst(1)).then(artists => {
      for(var key in artists.val()){
           console.log("snapshot.val" + artists.val()[key]);
          self.artist = artists.val()[key];
          self.haveArtist = true
          self.componentKey += 1;
        }
    });
  },
  
  gotoArtist(artist) {
    this.$router.push({ name: 'Artist', params: {artistid: artist.id}});
  },

  media600Enter(mediaQueryString) {
    this.lessThan600 = true
  },
   
  media600Leave(mediaQueryString) {
    this.lessThan600 = false
  },

  itemsSelected( item, add) {
    if(item.selected <= 0 && !add)return;
    if(item.number <= item.selected && add) return;
  
    if(add ){
      item.selected += 1
    } else {
      item.selected -= 1
    }
    this.selecteditemkey = item['.key']
    
    this.addItem(item, add)
  },

          
  total : function(item) {
      if(this.isAvailable(item))
      {
         if( item.selected == 0) return  "";
          let total = item.selected * this.product.price;
          return 'You will purchase  ' +  item.selected + ' at R' + this.product.price + ' each. The total is ' + String('R ' + total + '.00');
      }
    },

  isAvailable : function(item) {
     return item.number > 0
   },

  createOrderItem (item) {
     let orderitem = {
      key: item.key,
      productid: item.productid,
      price: this.product.price,
      size: item.size,
      number: item.selected,
      productname: this.product.name,
      sku: item.sku,
      dimensions: item.dimensions,
      weight: item.weight,
      height: this.product.height,
      width: this.product.width,
      length: this.product.length,
      isSelected: false,
      thumburl: this.product.images[0].thumbUrl,
      selecteditemkey: ''
  }
     this.shoppingcart.items.push(orderitem)
  },

  continueShopping () {
      this.$router.replace({ name: 'Shop'});
  },
 
  gotoShipping () {
    let currentuser = firebase.auth().currentUser;
      if (!currentuser){
         this.$router.push({ name: 'Login', params: {goto: 'Information'}});
      } else{
         this.$router.push({ name: 'Information'});
      }
  },

  addItem(item, add) {
       if(sessionStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
     } 
    var existingitem = this.shoppingcart.items.find(existing => {
      if (existing.key == item.key) {
        return existing.key;
      }
    });
    if(existingitem) {
      if (add) {
        existingitem.number += 1
      } else {
       existingitem.number -= 1
       if(existingitem.number == 0)
       {
          this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(item), 1);
       }
      }
    } else {
      if(item.selected > 0) {
        this.createOrderItem(item)
      }
    }
   
    var total = 0;
    this.shoppingcart.items.forEach(item => {
      total += item.number;
    });
    this.shoppingcart.totalitems = total 
    sessionStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
    this.$eventHub.$emit('shoppingcarttotal', total);
     this.$eventHub.$emit('refreshshoppingcart', false);
  },

  initialiseShoppingCart() {
      this.shoppingcart = {
          reference: 'JaylaShop' + Math.random().toString(36).substr(2, 9),
          purchasevalue: '',
          totalpaid: 0,
          totalitems: 0,
          items: [],
          deliveryfee: 0,
          zapperPaymentMethod: false,
          zapperPaymentId: 0,
          zapperReference: "",
           user: {
            firstname: '',
            surname: '',
            email: '',
            cellphone: '',
            address: {
              addressline1: '',
              addressline2: '',
              suburb: '',
              city: '',
              region: '',
              country: '',
              postalcode: ''
              }
             },
          };
   },
}
}
</script>

<style lang="scss" scoped>
   @import "~@/styles/commonstyle.scss";
  @import "~@/styles/productstyle.scss";
 </style>