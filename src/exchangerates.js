import axios from "axios";
let USDRate = 1;
let EURRate = 1;
let isFetched = false;
export  default  {
 
  async getRates(){
    if (!this.isFetched) {
      await this.fetchExchangeRates();
    }
  },

   async fetchExchangeRates() {
      const URL_API = "https://api.exchangeratesapi.io/latest?base=ZAR" //?symbols=USD,GBP,ZAR"
   // const URL_API = "https://my-backend-application.herokuapp.com/currency/latest?symbols=USD,GBP";
      let self = this
      await axios.get(URL_API)
        .then(result => {
       // let rates = JSON.parse(result.data.rates);
        let rates = result.data.rates;
         // data = data["rates"];
          if (rates.hasOwnProperty("USD")) {
            self.USDRate = rates["USD"]
          }

          if (rates.hasOwnProperty("EUR")) {
            self.EURRate = rates["EUR"]
          }
          self.isFetched = true;
      
      }).catch((error) => {
        console.log(">>> Updating rate failed \n" + error);
    })
    }
 }