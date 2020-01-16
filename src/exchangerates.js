export default {

  data() {
    return {
      isFetched: false,
      USD: 0,
      EUR: 0
    }
}, 

  methods: {
      getUSDPrice(item){
   debugger
    // if (!this.isFetched) {
    //   await this.fetchExchangeRates();
    // }
      return price * this.USD;

    },

    async  getEURPrice(price) {
      if (!this.isFetched) {
        await this.fetchExchangeRates();
      }
        return price * this.EUR;
    },

   async fetchExchangeRates() {
      debugger
      const URL_API = "https://api.exchangeratesapi.io/latest?base=ZAR" //?symbols=USD,GBP,ZAR"
   // const URL_API = "https://my-backend-application.herokuapp.com/currency/latest?symbols=USD,GBP";
      let self = this
     this.axios.get(URL_API)
      .then(result => {
       data = JSON.parse(result.data);
        data = data["quotes"];
        if (data.hasOwnProperty("USD")) {
          self.USD = data["USD"]
        }

        if (data.hasOwnProperty("EUR")) {
          self.USD = data["EUR"]
        }
        self.isFetched = true;
    
    }).catch((error) => {
        console.log(">>> Updating rate failed \n" + error);
        alert("We could not fetch the exchange rates at this time");
    });
    }
  },

  mounted() {
   
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }

}