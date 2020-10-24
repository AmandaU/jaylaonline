import axios from "axios";

var isFetched = false;
var shoppingcart = null;
let baseUrl = 'https://rush.test.jini.guru/api/v2/';  //https://www.rush.co.za/api/v2/
let auth = {
  headers: {'X-Auth-Token': 'a0a06d61fe7ff9f06235476a1af267f6311e6d8d239ba6c95565502ebf29ad04',  'Content-Type': 'application/json'} 
};

export  default  {

 
  async getCostComparison(shoppingcart){
    if (this.Couriers && this.Couriers.length > 0) return this.Couriers;
     this.shoppingcart = shoppingcart;  
      await this.fetch(); 
   },

   async fetch() {
        let self = this;
        let data = this.shippingParameters() ;
        // const auth = {
        //       headers: {'X-Auth-Token': this.authToken,  'Content-Type': 'application/json'} 
        //   };
         const url = baseUrl + 'costComparison';
         await axios.post(url, data, auth)
         .then(result => {
            if(result.statusText == "OK") {
                let allcouriers = result.data.data.CostComparisonResult.CostComparisonResults.ResultSet.Result
               if(allcouriers && allcouriers.length > 0) {
                  let c =  self.getCouriers(allcouriers);  
                  self.Couriers = c;           
                  }
            }
          })
          .catch(e => {
            let c = [];
            c[0] = {
              CarrierName: "COD, pickup or by arrangement",
              CarrierAccount: "COD",
              DeliveryTimeHours: '',
              TotalCostPlusMarkup: "TBA",
              isSelected: false
            };
            c[1] = {
              CarrierName: "Flat fee",
              CarrierAccount: "Flat",
              DeliveryTimeHours: '48',
              grandtotmrkup: '150',
              isSelected: false
            };

            self.Couriers = c;  
          // self.$swal('O no..', 'There was a problem calculating the delivery fee', 'error')
          });
    },
   
      
   shippingParameters: function() {
    let weight = {} ;   
    let length = {};
    let width = {};
    let height = {};
    let amount = {};
    let ind = 0;
    this.shoppingcart.items.forEach(item => {
      weight[ind] = item.weight;
      length[ind] = item.length;
      width[ind] = item.width;
      height[ind] = item.height;
      amount[ind] = item.number;
      ind += 1;
    });
        let data = {   "insurance":false,
           "weight": weight,
            "length": length,
            "width": width,
            "height": height,
            "amount": amount,
            "pick_up": this.shippingFromAddress(),//"test,test2|| ||ALBERT LUTHULI||BLOEMFONTEIN||9323",
            "sender_name":"JadeAyla",
            "sender_email":"info@ifinyela.com",
            "sender_tel":"",
            "sender_mob":"0828391629",
            "receiver_contact":"testege",
            "receiver_name": this.shoppingcart.user.firstname,
            "receiver_phone":"",
            "receiver_mobile": this.shoppingcart.user.cellphone,
            "receiver_email": this.shoppingcart.user.email,
            "drop_off":  this.shippingToAddress()//"2 ,road||reter||ACTON CABA||TSOMO||5401"
      };
    //    let data2 = {   "insurance":false,
          
    //         "weight":{
    //           "0":2,
    //           "1":2
    //           },
    //         "length":{
    //           "0":5,
    //           "1":5
    //           },
    //         "width":{
    //           "0":5,
    //           "1":19
    //           },
    //         "height":{
    //           "0":5,
    //           "1":67
    //           },
    //         "amount":{
    //           "0":1,
    //           "1":1
    //           },
    //         "pick_up": this.shippingFromAddress(),//"test,test2|| ||ALBERT LUTHULI||BLOEMFONTEIN||9323",
    //         "sender_name":"JadeAyla",
    //         "sender_email":"info@jadeayla.com",
    //         "sender_tel":"",
    //         "sender_mob":"0828391629",
    //         "receiver_contact":"testege",
    //         "receiver_name": this.shoppingcart.user.firstname,
    //         "receiver_phone":"",
    //         "receiver_mobile": this.shoppingcart.user.cellphone,
    //         "receiver_email": this.shoppingcart.user.email,
    //         "drop_off":  this.shippingToAddress()//"2 ,road||reter||ACTON CABA||TSOMO||5401"
    //   }
      
      return data;
  },

  getCouriers(allcouriers) {
     let c = [];
          //cheapest
          c[0] = allcouriers[0];
           allcouriers.forEach(courier => {
             if(courier.CarrierService == "Locker") return;
              if(Number(courier.grandtotmrkup.replace(',','')) < Number(  c[0].grandtotmrkup.replace(',',''))) {
                c[0] = courier;
                c[0].isSelected = false;
             }
            });

          //fastest
          c[1] = allcouriers[1];
          allcouriers.forEach(courier => {
               if(courier.CarrierService == "Locker") return;
              if(Number(courier.DeliveryTimeHours) < Number(  c[1].DeliveryTimeHours)) {
                c[1] = courier;
                c[1].isSelected = false;
            }
           });

          //COD
          c[2] = {
              CarrierName: "COD, pickup or by arrangement",
              CarrierAccount: "COD",
              DeliveryTimeHours: '',
              TotalCostPlusMarkup: "TBA",
              isSelected: false
            };

            return c
  },

   shippingToAddress: function() {
        if(!this.shoppingcart || !this.shoppingcart.user) return "";
        let shipaddress = this.shoppingcart.user.address.addressline1 + '||'
        shipaddress += this.shoppingcart.user.address.addressline2 == '' ? ' ||' : this.shoppingcart.user.address.addressline2 + '||'
        shipaddress += this.shoppingcart.user.address.suburb + '||' 
        + this.shoppingcart.user.address.region + '||'
          + this.shoppingcart.user.address.postalcode;
        return shipaddress;
    },

  shippingFromAddress: function() {
      return '18 Belper Road|| || Wynberg||Western Province||7800';
  },

 }