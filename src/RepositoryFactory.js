import ExchangeRates from "./exchangerates";
import CourierService from "./courierservice";


const repositories = {
  rates: ExchangeRates,
  couriers: CourierService
};

export const RepositoryFactory = {
  get: name => repositories[name],
};