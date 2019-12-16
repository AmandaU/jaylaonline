<template>

<div :style="getContainerStyle()" :key="componentKey">
   
   <div class="productcontainer">
     <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media>
   
         <div v-if="!isLoading" class="pricecolumn" >
        
            <div  v-if="haveArtist" class="artistblock"  @click="gotoArtist(artist)" >
              <h1> {{ artist.name }} </h1> 
               <img v-bind:src="artist.logo" v-bind:alt="artist.name" style="height: 50px; width: auto; padding-left:20px;vertical-align:center;">
                <img v-bind:src="artist.photourl" v-bind:alt="artist.name" style="height: 100px; width: auto; padding-left:20px;">
            </div> 
             <br>
            
            <h1>{{ product.name }}</h1> 
            <h2>{{ product.description }}</h2>
            <br>
              
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
                                <div  v-show="item.number > 0" class="itemdetail"> {{item.selected}}</div>
                              </div>  
                              <br>

                              <div  class="addminusbox">
                                  <img :disabled="item.selected == 0" v-bind:class="[item.selected > 0 ? 'enabled' : 'disabled']"   src="../assets/minus.png"  alt="minus"  @click="itemsSelected(item, false)" class="addminusimage"/><br>
                                  <img :disabled="item.number <= item.selected" v-bind:class="[item.number > item.selected ? 'enabled' : 'disabled']"  src="../assets/plus.jpg"  alt="plus"  @click="itemsSelected(item,true)" class="addminusimage"/>
                                </div>   
                        
                          </div> 
                      </div> 
                
                  </div> 
                    <div class="thinline"></div>  
              </div>
            </div>   
            
            <button   @click="continueShopping" class="buttonstyle">more shopping</button>
            <button   v-visible="showCheckoutButton" @click="gotoShipping" class="buttonstyle">check out</button>
        </div> 

        <!-- <div v-if="!isLoading" class="imageblock">  
            <div class="imagecontainer" v-for="image in product.images" v-bind:key="image.productid">
              <img v-bind:src="image.thumbUrl" v-bind:alt="image.alt"  class="thumbimage">
                <img v-bind:src="image.url" v-bind:alt="image.alt"  class="mainimage">
                
            </div>  
        </div>  -->

        <div v-if="!isLoading" class="imageblock">  
            <div  :style="getImageStyle(image)"  v-for="image in product.images" v-bind:key="image.productid"  >
              
              <img v-bind:src="image.thumbUrl" v-bind:alt="image.alt"  class="thumbimage" >
                <img v-bind:src="image.url" v-bind:alt="image.alt"  class="mainimage"  >
               
            </div>  
        </div>

        
  
    </div>
   </div>
  
</template>

<script>
import Media from 'vue-media'
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
let productsRef = db.ref('products');
let artistsRef = db.ref('artists');

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
      greaterThan600: window.innerWidth > 600,
      componentKey: 0,
      isLoading: true,
      haveArtist: false,
      items: [],
      itemimages: [],
      product: {},
      artists: [],
      artist: {},
      isMobile: false,
      shoppingcart: {},
      products:[],
      currentuser: null,
      showCheckout: false
     }
  },

firebase () {
  //this.currentuser = firebase.auth().currentUser;
  if (this.$props.productid == null) {
      var index = window.location.hash.indexOf("=");
      if(index >= 0)
      {
          this.productid =  window.location.hash.substring(index+1,window.location.hash.length) ;
      }
   } 
    return {
      items: db.ref('items').orderByChild("productid").equalTo(this.productid) ,
      artists:  db.ref('artists')
    }
},

mounted() {
   //this.getArtist('artist1')
   let self = this;
  this.$eventHub.$on('showCheckout', ()=> {
       self.showCheckout = !self.showCheckout;
  });
    this.$eventHub.$on('shoppingcarttotal', (total)=> {
       if(localStorage.getItem('jaylashop'))
      {
        self.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
      }
   });
},

created () {
  this.showCheckout = false
   if(localStorage.getItem('jaylashop'))
    {
      this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
    }
    let self = this
    this.$rtdbBind('products', productsRef.orderByChild("id").equalTo(this.productid).limitToFirst(1)).then(products => {
      for(var key in products.val()){
          console.log("snapshot.val" + products.val()[key]);
          self.product = products.val()[key];
       }
      
      const arrayResult = Object.keys(self.product.images).map(imagekey => {
          return self.product.images[imagekey]
      });
       self.product.images = arrayResult
       self.loader.hide()
       self.isLoading = false
    });

    this.loader = this.$loading.show({
              loader: 'dots',
              color: 'blue'
      });
},

 computed: {

   showCheckoutButton: function () {
     if (this.shoppingcart) {
       return this.shoppingcart.totalitems > 0
     } else return false
   },
 
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

   getImageStyle: function (image) { 
         let randomTransitionTime =  Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
         let w = 400
         let h = image.ratio * w;
              return  {
              'width': h + 'px',
              'height': w + 'px',
              'position': 'relative',
               'margin': '20px',
              'transition': 'all ' + randomTransitionTime + 'ms',
                //'transition-delay': randomTransitionTime + 'ms'
              }
      
    },
  
  getContainerStyle: function () { 
     let h = String(window.innerHeight - 120) + 'px'
        return  {
        'max-width': '100vw',
        'min-height' : h,
        'width':'100%',
        'float':'left',
        'display': 'flex',
        'flex-direction': 'column',
        'overflow-x': 'hidden',
        'align-self': 'center',
        'justify-content': 'center',
        'align-items': 'center',
        'padding-top': 'auto',//this.showCheckout ? '2px' : '7%',
        'padding-bottom': 'auto',
        'transition': 'padding-top 500ms ease-in-out',
      }
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

  media800Enter(mediaQueryString) {
    this.greaterThan800 = false
  },
   
  media800Leave(mediaQueryString) {
    this.greaterThan800 = true
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
          let total = item.selected * item.price;
          return 'You will purchase  ' +  item.selected + ' at R' + item.price + ' each. The total is ' + String('R ' + total + '.00');
      }
    },

  isAvailable : function(item) {
     return item.number > 0
   },

  createOrderItem (item) {
    let orderitem = {
      key: item['.key'],
      productid: item.productid,
      price: item.price,
      size: item.size,
      number: item.selected,
      productname: this.product.name,
      isSelected: false,
      thumburl: this.product.images.images[0].thumburl,
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
   if(localStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
     } else {
       this.initialiseShoppingCart()
     }
    var existingitem = this.shoppingcart.items.find(existing => {
      if (existing.key == item['.key']) {
        return existing.key;
      }
    });
    if(existingitem) {
      if (add) {
        existingitem.number += 1
      } else {
       existingitem.number -= 1
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
    localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
    this.$eventHub.$emit('shoppingcarttotal', total);
     this.$eventHub.$emit('refreshshoppingcart', '');
  },

  initialiseShoppingCart() {
      this.shoppingcart = {
          reference: 'JaylaShop' + Math.random().toString(36).substr(2, 9),
          purchasevalue: '',
          totalPaid: 0,
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
  @import "~@/styles/productstyle.scss";
    @import "~@/styles/commonstyle.scss";
</style>