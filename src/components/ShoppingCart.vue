<template>

  <div class="cartcontainer" :key="componentKey">
    <!-- <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> -->

    <h2>Shopping cart:</h2> 
     <div :style="getCartStyle()" :key="cartKey">
    <!-- <div class="shoppingcartblock"> -->

        <div class="checkoutblock" >

          <!-- <center>Center this text!</center> -->
              <p  v-show="showNoItemsMessage">There are no items in your cart,<span @click="goToShop" style="color:blue;cursor:pointer"> shop </span>some more ;)</p>
                  
              <div  class="checkoutrow" v-for="item in shoppingcart.items" :key="item.key ">
                  <div  @click="removeItem(item)" class="closebutton"><h1>X</h1></div>

                  <div  class="itemthumbnailimage">
                     <img v-bind:src="item.thumburl" v-bind:alt="item.productname" >
                     </div>
                
                  <div  class="rowlabel item">
                    <small>{{item.productname}}, size {{item.size}}</small>
                    <small>{{item.number}} @ R{{item.price}} each</small>
                  </div>

                  <div  class="rowvalue item">
                    <small>{{totalValueForItem(item)}}</small>
                  </div> 
              </div>
                  
        </div>  

        <div class="space"/>

        <div class="totalblock">

              <div  class="totalrow">
                  
                  <div  class="rowlabel total">
                      <h4>Delivery fee</h4>
                  </div> 

                  <div  class="rowvalue total"> 
                    <h4>{{shippingFee}}</h4>
                  </div> 

              </div> 

              <div  class="totalrow">
                
                  <div  class="rowlabel item">
                    <h4>Total: </h4>
                  </div>

                  <div  class="rowvalue total"> 
                    <h4>R {{total}}</h4>
                  </div>

              </div> 
        </div> 
    </div>   
  </div>  

</template>

<script>

import Media from 'vue-media'
 
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
          showNoItemsMessage: false,
          componentKey: 0,
          cartKey: 0,
        }
    },

    mounted() {
      let self = this;

       this.$eventHub.$on('showCheckout', (show)=> {
      if (self.$route.name == 'Information'
        || self.$route.name == 'Shipping'
        || self.$route.name == 'Checkout') {
       self.showCheckout =  self.isMobile() ? show : false
       } else {
           self.showCheckout = show ;
        }
      });

      this.$eventHub.$on('fee', (fee)=> {
         self.shoppingcart.deliveryfee = fee
      });

      this.$eventHub.$on('refreshshoppingcart', ()=> {
        self.getShoppingCart()
        this.componentKey += 1
      });
    },

    created() {
      window.addEventListener("resize", this.redrawComponent);
       this.getShoppingCart()
     },

     destroyed() {
      window.removeEventListener("resize", this.redrawComponent);
     },

    computed: {

      total: function() {
         var theTotal = 0;
        this.shoppingcart.items.forEach(item => {
            theTotal += item.number * Number(item.price);
        });
        theTotal += this.shoppingcart.deliveryfee
        return theTotal.toFixed(2)
      },

       shippingFee: function() {
          return 'R ' + String(this.shoppingcart.deliveryfee.toFixed(2))
      }
    },

    methods: {

       goWide: function () {
          if (this.isMobile()) return true
          return !this.showCheckout
      },
 

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

      // media800Enter(mediaQueryString) {
      //   this.greaterThan800 = false
      // },
      
      // media800Leave(mediaQueryString) {
      //   this.greaterThan800 = true
      // },

      redrawComponent() {
        this.cartKey += 1
      },

      getCartStyle: function () {
          return  {
         //'background-color':'rgb(147, 253, 40)',
          'flex': '1',
          'min-width':   this.goWide() ? '90%' : this.showCheckout ? '700px' : '90%' ,
          'max-width': this.goWide() ? '90%' :this.showCheckout ? '700px' : '90%' ,
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'flex-direction': this.isMobile() ? 'column' : 'row',
          'align-self': 'center',
          'margin-bottom': '5px'
        }
     },

      getShoppingCart() {
        if(localStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
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
        this.showNoItemsMessage = this.shoppingcart.totalitems == 0
        this.$eventHub.$emit('shoppingcarttotal', this.shoppingcart.totalitems);
        localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
        this.componentKey += 1
        
      },

      totalValueForItem: function(item){
        var value = Number(item.number * item.price);
        return value == 0? "R 0.00": String('R ' + value + '.00');
      },
  
      goToShop() {
        this.$router.replace('Shop')
      },

      itemsSelected: function( item, add) {
        if(item.number == 0 && !add)return;
        if(add && item.selected > item.number) {
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
        localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
     },
  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/shoppingcartstyle.scss";
</style>

