<template>

  <div class="checkoutblock">
              <h2>Shopping cart:</h2>
              <div  v-for="item in shoppingcart.items" :key="item['.key'] ">
                <div  class="checkoutrow ">
                  <div  class="checkouttickets ">
                    <small>{{item.productname}}, size {{item.size}}</small>
                    <small>{{item.selected}} @ R{{item.price}} each</small>
                  </div>

                  <div  class="checkouttickettotal ">
                    <small>{{totalValueForItem(item)}}</small>
                  </div> 
                </div>  
              </div>
              <br>

              <div  class="checkoutrow ">
                  <div  class="checkouttickets "> </div>
                  <div  class="checkouttickettotal "> 
                    <div class="thinline"></div>  
                  </div> 
              </div> 

               <div  v-visible="this.shoppingcart.deliveryfee > 0" class="checkoutrow ">
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
              </div> 

              <div  class="checkoutrow ">
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
        }
    },

    mounted() {
      let self = this;
      this.$eventHub.$on('shoppingcart', (shoppingcart)=> {
        self.shoppingcart = shoppingcart
    });
    
  },

    created() {
        let self = this
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
              theTotal += item.selected * Number(item.price);
          });
          theTotal += this.shoppingcart.deliveryfee
          return theTotal.toFixed(2)
        },

        shippingFee: function()
        {
          return 'R ' + String(this.shoppingcart.shipping.toFixed(2))
        },
    },

    methods: {

        totalValueForItem: function(item){
        var value = Number(item.selected * item.price);
        return value == 0? "R 0.00": String('R ' + value + '.00');
        },
    }
    }

</script>

<style lang="scss" scoped>
  @import "~@/styles/checkoutstyles.scss";
 </style>

