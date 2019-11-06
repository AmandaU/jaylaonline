<template>

  <div class="checkoutblock">
              <h2>Shopping cart:</h2>
              <div  v-for="item in shoppingcart.items" :key="item.key ">
                <div  class="checkoutrow">
                  <div class="selectimage">
                    <input  type="checkbox"   @click="shouldRemoveItems(item)" true-value=""  false-value="" >
                  </div>
                  <div  class="checkouttickets ">
                    <small>{{item.productname}}, size {{item.size}}</small>
                    <small>{{item.number}} @ R{{item.price}} each</small>
                  </div>

                  <div  class="checkouttickettotal ">
                    <small>{{totalValueForItem(item)}}</small>
                  </div> 
                </div>  
              </div>
            
              <p v-visible="canRemoveItems">Would you like to  <span @click="removeItems()" style="color:red;cursor:pointer">delete the selected items?</span></p>

              <br>

              <div  class="checkoutrow ">
                  <div class="selectimage"> </div>
                  <div  class="checkouttickets "> </div>
                  <div  class="checkouttickettotal "> 
                    <div class="thinline"></div>  
                  </div> 
              </div> 

               <div  v-visible="this.shoppingcart.shipping > 0" class="checkoutrow ">
                  <div class="selectimage"> </div>
                  <div  class="checkouttickets ">
                     <small>Delivery fee</small>
                  </div> 
                  <div  class="checkouttickettotal "> 
                    <small>{{shippingFee}}</small>
                  </div> 
              </div> 

              <div  class="checkoutrow ">
                 <div class="selectimage"> </div>
                 <div  class="checkouttickets ">
                   <small>Total: {{shoppingcart.totalitems}}</small>
                 </div>
                 <div  class="checkouttickettotal "> 
                  <small>R {{total}}</small>
                 </div>
              </div> 

              <div  class="checkoutrow ">
                 <div class="selectimage"> </div>
                  <div  class="checkouttickets "> </div>
                  <div  class="checkouttickettotal "> 
                    <div class="thinline"></div>  
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
        canRemoveItems: false
        }
    },

    mounted() {
    let self = this;
    this.$eventHub.$on('shoppingcart', (shoppingcart)=> {
       self.shoppingcart = shoppingcart
    });
    
  },

    created() {
      debugger
       let cartref = 'jaylashop'
      if(localStorage.getItem(cartref))
      {
          this.shoppingcart = JSON.parse(localStorage.getItem(cartref));
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
        
        total: function()
        {
          var theTotal = 0;
          this.shoppingcart.items.forEach(item => {
              theTotal += item.number * Number(item.price);
          });
          theTotal += this.shoppingcart.deliveryfee
          return theTotal.toFixed(2)
        },

        shippingFee: function()
        {
              return 'R ' + String(this.shoppingcart.deliveryfee.toFixed(2))
        },
    },

    methods: {

      shouldRemoveItems(item) {
        item.isSelected = !item.isSelected
        this.canRemoveItems =  this.shoppingcart.items.find(existing => {
           
            if (existing.isSelected) {
                return true;
            }
        });
      },

      removeItems() {
        canRemoveItems = false
        this.shoppingcart.items.forEach(element => {
          if (element.isSelected)
          {
            this.shoppingcart.items.splice(this.shoppingcart.items.indexOf(element), 1);
          }
       });
      this.$eventHub.$emit('shoppingcart', this.shoppingcart);
       localStorage.setItem('jaylashop', JSON.stringify(this.shoppingcart));
      },

      totalValueForItem: function(item){
        var value = Number(item.number * item.price);
        return value == 0? "R 0.00": String('R ' + value + '.00');
      },

      select(item) {

      }
    }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/shoppingcartstyle.scss";
 </style>

