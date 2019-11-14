<template>

  <div class="container">

      <h2>Shopping cart:</h2> 
      <div class="shoppingcartblock">

          <div class="checkoutblock" :key="componentKey">

            <!-- <center>Center this text!</center> -->
              <p  v-show="showNoItemsMessage">There are no items in your cart,<span @click="goToShop" style="color:blue;cursor:pointer"> shop </span>some more ;)</p>
                    
                      <div  class="checkoutrow" v-for="item in shoppingcart.items" :key="item.key ">
                        <div  @click="removeItem(item)" class="closebutton"><h1>X</h1></div>
                        
                          <div  class="checkouttickets ">
                            <small>{{item.productname}}, size {{item.size}}</small>
                            <small>{{item.number}} @ R{{item.price}} each</small>
                          </div>

                          <div  class="checkouttickettotal ">
                            <small>{{totalValueForItem(item)}}</small>
                          </div> 
                        
                      </div>
                    

                      <!-- <div  v-visible="this.shoppingcart.deliveryfee > 0" class="checkoutrow ">
                        
                          <div  class="checkouttickets ">
                            <small>Delivery fee</small>
                          </div> 
                          <div  class="checkouttickettotal "> 
                            <small>{{shippingFee}}</small>
                          </div> 
                      </div> 

                      <div  class="checkoutrow ">
                        
                        <div  class="checkouttickets ">
                          <small>Total: {{shoppingcart.totalitems}}</small>
                        </div>
                        <div  class="checkouttickettotal "> 
                          <small>R {{total}}</small>
                        </div>
                      </div>  -->
                  
          </div>  

          <div style=" flex: 0.05;"/>

          <div class="totalblock">

                <div  class="totalrow">
                    
                    <div  class="checkouttickets ">
                        <h4>Delivery fee</h4>
                    </div> 

                    <div  class="checkouttickettotal "> 
                      <h4>{{shippingFee}}</h4>
                    </div> 

                </div> 

                <div  class="totalrow">
                  
                    <div  class="checkouttickets ">
                      <h4>Total: </h4>
                    </div>

                    <div  class="checkouttickettotal "> 
                      <h4>R {{total}}</h4>
                    </div>

                </div> 

          </div> 

      </div>   
  
  </div>  

</template>

<script>
 
export default {
  
    name: 'ShoppingCart',
    
    data() {
        return {
        greaterThan800: window.innerWidth > 800,
        shoppingcart: {},
        canRemoveItems: false,
        showNoItemsMessage: false,
         componentKey: 0,
        }
    },

    mounted() {
      let self = this;
      this.$eventHub.$on('fee', (fee)=> {
        self.shoppingcart.deliveryfee = fee
      });
    },

    created() {
     if(localStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
        if (this.shoppingcart.items.count == 0) {
            this.hideAll = true
        }
      }
    },

    computed: {

      isMobile: function()
      {
          return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
      },
      
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
      },
    },

    methods: {

      shouldRemoveItems(item) {
        item.isSelected = !item.isSelected
        this.shoppingcart.items.find(existing => {
            if (existing.isSelected) {
               this.canRemoveItems = true;
            }
        });
      },

      removeItem (item) {
        this.componentKey += 1
        //    this.canRemoveItems = false
        //   this.shoppingcart.items.forEach(element => {
        //     if (element.isSelected)
        //     {
        //       this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(element), 1);
        //     }
        //  });
        debugger
        this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(item), 1);
        
        var total = 0;
        this.shoppingcart.items.forEach(item => {
            total += item.number;
        });
        this.shoppingcart.totalitems = total 
        this.showNoItemsMessage = this.shoppingcart.totalitems == 0
        this.$eventHub.$emit('shoppingcarttotal', this.shoppingcart.totalitems);
        localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      },

      totalValueForItem: function(item){
        var value = Number(item.number * item.price);
        return value == 0? "R 0.00": String('R ' + value + '.00');
      },

      select(item) {

      }
    },

    goToShop() {
      this.$router.replace('Shop')
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

</script>

<style lang="scss" scoped>
  @import "~@/styles/shoppingcartstyle.scss";
 </style>

