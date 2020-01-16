import ExchangeRates from "./exchangerates";


const repositories = {
  rates: ExchangeRates,
}

export const RepositoryFactory = {
  get: name => repositories[name]
}