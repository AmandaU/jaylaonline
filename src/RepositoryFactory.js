import ExchangeRates from "./exchangerates";
import ShippingCalculator from "./components/ShippingCalculator.vue";


const repositories = {
  rates: ExchangeRates,
  couriers: ShippingCalculator
};

export const RepositoryFactory = {
  get: name => repositories[name],
};