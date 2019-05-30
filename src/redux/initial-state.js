// import { List } from 'immutable';

export default {

  device: {
    isMobile: null,
  },

  counter: {
    countPreloadedState: null,
    countMultireducer: 0,
  },

  filterableTable: {
    filterText: '',
    inStockOnly: false,
    loaded: false,
    dropDownOptionSelected: '',
    error: false,
    errorResponse: {
      message: '',
      documentation_url: '',
    },
    isLoading: false,
    fetchedData: null,
    didInvalidate: false,
  },

  temperatureCalculator: {
    temperature: '',
    scale: 'c',
  },

};
