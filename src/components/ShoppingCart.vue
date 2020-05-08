<template>

  <div class="cartcontainer" :key="componentKey">
    <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> -->

      <div class="shoppingcartblock">
         <div v-bind:class="[showCheckout ? 'headingcenter' : 'headingleft']"><h3>SHOPPING CART</h3></div>
      <div v-bind:class="[isCartColumn ? 'cartcolumn' : 'cartrow']" :key="cartKey">
         <div v-if="showCloseButton"  @click="hide()" class="closebutton"><a>X</a></div>
        <div v-bind:class="[isCartColumn ? 'checkoutblockcolumn' : 'checkoutblockrow']">
   
          <p  v-show="this.shoppingcart.totalitems == 0">There are no items in your cart,<span @click="goToShop" style="color:blue;cursor:pointer"> shop </span>some more ;)</p>
                  
              <div  class="checkoutrow" v-for="item in shoppingcart.items" :key="item.key ">
                  <div  v-visible="canRemoveItem" @click="removeItem(item)" class="removebutton"><a>X</a></div>

                  <div  class="itemthumbnailimage">
                     <img v-bind:src="item.thumburl" v-bind:alt="item.productname" >
                     </div>
              
                  <div  class="rowlabel item">
                    <small>{{item.productname}}</small>
                    <small>SIZE {{item.size}}</small>
                    <small>{{item.number}} X R{{item.price}}</small>
                  </div>

                  <div  class="rowvalue item" >
                    <small>{{totalValueForItem(item)}}</small>
                  </div> 
                
              </div>
                  
        </div>  
 
        <div  v-bind:class="[isCartColumn ? 'totalblockcolumn' : 'totalblockrow']">
       
            <div class="totalinner">
              <div  class="totalrow">
                  
                  <div  class="rowlabel total">
                      <h4>Delivery</h4>
                  </div> 

                  <div  class="rowvalue total"> 
                    <h4>{{shippingFee}}</h4>
                  </div> 

              </div> 

              <div  class="totalrow">
                
                  <div  class="rowlabel total">
                    <h4>Total: </h4>
                  </div>

                  <div  class="rowvalue total"> 
                    <h4>R {{total}}</h4>
                  </div>

              </div> 
               </div> 
              <button v-if="showCheckoutButton" @click="gotoCheckout" class="buttonstyle">CHECK OUT</button>
             
        </div> 
         
    </div>  
    </div>  
  </div>  

</template>

<script>
 import firebase from '../firebase-config';
//import Media from 'vue-media'
 
export default {

    name: 'ShoppingCart',

    // components: {
    //  Media
    // },

    props: {
     showCheckout: Boolean,
    },
    
    data() {
        return {
          shoppingcart: {},
          canRemoveItems: false,
          componentKey: 0,
          cartKey: 0,
          isCartColumn: false,
          isCartContainerColumn: false,
        }
    },

    mounted() {
      let self = this;

       this.$eventHub.$on('showCheckout', (show)=> {
       if (self.$route.name == 'Information'
        || self.$route.name == 'Shipping'
        || self.$route.name == 'Checkout'
        || self.$route.name == 'Login'
        || self.$route.name == 'SignUp') {
       self.showCheckout =  self.isMobile ? show : false
       } else {
           self.showCheckout = show ;
        }
      });

      this.$eventHub.$on('fee', (fee)=> {
         self.shoppingcart.deliveryfee = fee
      });

      this.$eventHub.$on('refreshshoppingcart', (success)=> {
        self.getShoppingCart()
        if(success)
        {
          this.shoppingcart.items.splice(0,this.shoppingcart.items.length)
          this.shoppingcart.totalitems = 0
        }
        this.componentKey += 1
      });

      this.redrawComponent()
    },

    created() {
      window.addEventListener("resize", this.redrawComponent);
       this.getShoppingCart()
     },

     destroyed() {
      window.removeEventListener("resize", this.redrawComponent);
     },

    computed: {

       isMobile: function() {
          return window.innerWidth < 800 ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
      },

      showCloseButton: function () {
        if (this.isMobile) return true

        if (this.$route.name == "Information" ||
        this.$route.name == "Shipping" ||
        this.$route.name == "Checkout") return false
        return true
      },

      showCheckoutButton: function () {
        if (this.$route.name == "Information" ||
        this.$route.name == "Shipping" ||
        this.$route.name == "Checkout") return false
        return true
      },

      canRemoveItem: function () {
        return this.$route.name != 'Checkout'
      },

      total: function() {
         var theTotal = 0;
        this.shoppingcart.items.forEach(item => {
            theTotal += item.number * item.price;
        });
        theTotal += this.shoppingcart.deliveryfee
        return theTotal.toFixed(2)
      },

       shippingFee: function() {
          return 'R ' + String(this.shoppingcart.deliveryfee.toFixed(2))
      }
    },

    methods: {

      hide() {
        this.showCheckout = false
         this.$eventHub.$emit('showCheckout', false);
      },

       // media800Enter(mediaQueryString) {
      //   this.greaterThan800 = false
      // },
      
      // media800Leave(mediaQueryString) {
      //   this.greaterThan800 = true
      // },

      gotoCheckout () {
        this.hide()
        let currentuser = firebase.auth().currentUser;
        if (!currentuser){
        this.$router.push({ name: 'Login', params: {goto: 'Information'}});
        } else{
          this.$router.push({ name: 'Information'});
        }
      },

      redrawComponent() {
        if (this.isMobile) {
          this.isCartColumn = true
        } else {
           if (!this.showCheckout) {
            this.isCartColumn = window.innerWidth < 1400
          } else {
            this.isCartColumn = false
          }
        }
         this.cartKey += 1
      },

      getCartStyle: function () {

        if (this.showCheckout) {
            return  {
          //'background-color':'rgb(147, 253, 40)',
           'position': 'relative',
            'flex': '1',
            'min-width':  window.innerWidth < 1000 ? '80%' :  '700px' ,
            'max-width':  window.innerWidth < 1000 ? '80%' :  '700px' ,
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'flex-direction': window.innerWidth < 800? 'column' : 'row',
            'align-self': 'center',
            'margin-bottom': '5px'
          }
        }
          return  {
         //'background-color':'rgb(147, 253, 40)',
          'position': 'relative',
          'flex': '1',
          'min-width':   window.innerWidth < 1000 ? '80%' :  '600px',
          'max-width':  window.innerWidth < 1000 ? '80%' :  '600px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'flex-direction': window.innerWidth < 1400? 'column' : 'row',
          'align-self': 'center',
          'margin-bottom': '5px'
        }
     },

      getShoppingCart() {
        if(sessionStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(sessionStorage.getItem('jaylashop'));
        if (this.shoppingcart.items.count == 0) {
            this.hideAll = true
        }
       }
      },

      shouldRemoveItems(item) {
        item.isSelected = !item.isSelected
        this.shoppingcart.items.find(existing => {
            if (existing.isSelected) {
               this.canRemoveItems = true;
            }
        });
      },

      removeItem (item) {
        this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(item), 1);
        
        var total = 0;
        this.shoppingcart.items.forEach(item => {
            total += item.number;
        });
        this.shoppingcart.totalitems = total 
        this.shoppingcart.deliveryfee = 0
        sessionStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
        this.$eventHub.$emit('shoppingcarttotal', this.shoppingcart.totalitems);
        this.$eventHub.$emit('removeitem', item);

        this.componentKey += 1
      },

      totalValueForItem: function(item){
        var value = item.number * item.price;
        return value == 0? "R 0.00": String('R ' + value + '.00');
      },
  
      goToShop() {
        this.$router.replace('Shop')
      },

      itemsSelected: function( item, add) {
        if(item.number == 0 && !add)return;
        if(add && item.selected > item.number) {
          this.$swal('No more available stock', 'Please email info@ifinyela.com to pre-order more items', 'warning') 
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
            } 
        }
        this.$eventHub.$emit('shoppingcarttotal', this.shoppingcart.totalitems);
        sessionStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
     },
  }
}

</script>

<style lang="scss" scoped>
 @import "~@/styles/commonstyle.scss";
  @import "~@/styles/shoppingcartstyle.scss";
 </style>

