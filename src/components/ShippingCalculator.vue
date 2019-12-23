<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'ShippingCalculator',

  data() {
    return {
      isLoggedin: false,
      shoppingcart: {},
      user: {},
      authToken: 'lijhuygtkuygyujf',
      baseUrl: 'https://rush.test.jini.guru/api/v2/'  //https://www.rush.co.za/api/v2/
      
    }
},

created() {
    if(localStorage.getItem('jaylashop')) {
        this.shoppingcart = JSON.parse(localStorage.getItem('jaylashop'));
    }

    this.axios.defaults.headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.authToken
    }
    this.getCostComparison()
},

 computed: {

      shippingToAddress: function()
      {
          if(!this.shoppingcart || !this.shoppingcart.user) return ""
          let shipaddress = this.shoppingcart.user.address.addressline1 + '||'
          shipaddress += this.shoppingcart.user.address.addressline2 == '' ? ' ||' : this.shoppingcart.user.address.addressline2 + '||'
          shipaddress += this.shoppingcart.user.address.suburb + '||' 
          + this.shoppingcart.user.address.region + '||'
           + this.shoppingcart.user.address.postalcode
          return shipaddress
      },

      shippingFromAddress: function()
      {
         
          return '18 Belper Road|| || Wynberg||Western Province||7800'
      },
   },

  methods: {

 getCostComparison() {
    var params = {
        weight: {
            "0": "2",
        },
        length: {
            "0": "10"
            },
        width: {
            "0": "20"
        },
        height: {
            "0": "5"
        },
        amount: {
            "0": "1"
        },
        pick_up: this.shippingFromAddress,
        sender_name: 'Amanda Baret',
        sender_email: 'ursling@gmail.com',
        sender_tel: '0825778770',
        receiver_contact: this.shoppingcart.user.cellphone,
        receiver_name: this.shoppingcart.user.firstname + ' ' + this.shoppingcart.user.surname,
        drop_off: this.shippingToAddress
     }

      let self = this;
      const url = this.baseUrl + 'costComparison';
         this.axios.post(url, params)
        .then(response => {
            console.log('Response', response.data)
             if(response.data.statusId == 1)
              {
                var data = response.data.data[0];
              }
        })
        .catch(e => {
            console.log('Error: ', e.response.data)
        })
    },

  },
};

</script>

<style> 

</style> 


