// Actions
// -------------------
const LOAD = 'redux-example/filterableTable/LOAD';
const LOAD_SUCCESS = 'redux-example/filterableTable/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/filterableTable/LOAD_FAIL';

const SELECTED_OPTION = 'redux-example/filterableTable/SELECTED_OPTION';

const HANDLE_FILTER_TEXT_CHANGE = 'redux-example/filterableTable/HANDLE_FILTER_TEXT_CHANGE';
const HANDLE_IN_STOCK_CHANGE = 'redux-example/filterableTable/HANDLE_IN_STOCK_CHANGE';
const HANDLE_DROPDOWN_CHANGE = 'redux-example/filterableTable/HANDLE_DROPDOWN_CHANGE';

import initialState from '../initial-state';

// Reducer
// -------------------
export default function reducer(state = initialState.filterableTable, action = {}) {

  switch (action.type) {

    case SELECTED_OPTION:
      console.log('3333333333333333333 ####################################### 3333333333333333333a');
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > SELECTED_OPTION > state: ', state);
      return {
        ...state,
        filterText: '',
        inStockOnly: false,
        error: false,
        errorResponse: {message:'', documentation_url:''},
        isLoading: true,
        fetchedData: null,
        dropDownOptionSelected: action.option,
      };

    case LOAD:
      console.log('3333333333333333333 ####################################### 3333333333333333333b');
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD > state: ', state);
      return {
        ...state,
        isLoading: true,
      };

    case LOAD_SUCCESS:
      console.log('3333333333333333333 ####################################### 3333333333333333333bb');
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD_SUCCESS > state: ', state);
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD_SUCCESS > action: ', action);
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD_SUCCESS > action.result: ', action.result);
      return {
        ...state,
        error: false,
        errorResponse: {message:'', documentation_url:''},
        isLoading: false,
        fetchedData: action.result,
      };

    case LOAD_FAIL:
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD_FAIL > state: ', state);
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > LOAD_FAIL > action.result: ', action.result);
      return {
        ...state,
        error: true,
        errorResponse: action.result,
        isLoading: false,
        fetchedData: null,
      };

    default:
      console.log('3333333333333333333 ####################################### 33333333333333333330000000');
      console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > SWITCH > action.type > default > state: ', state);
      return state;
  }
};

// Actions (action creators)
// an action is a JavaScript object that has a 'type' and an optional 'payload' (data)
// -------------------
export function selectedOption(value) {
  return {
    type: SELECTED_OPTION,
    option: value.selected
  };
};

export function load(value) {
  console.log('222222222222222222222 ####################################### 22222222222222222222');
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ client }) => client.get(value.request)
  };
};

// export function loadAction() {
//   return {
//     type: LOAD
//   }
// };

// export function loadSuccess(fetchedData) {
//   return {
//     type: LOAD_SUCCESS,
//     result: fetchedData
//   }
// };

// export function loadFailure(error) {
//   return {
//     type: LOAD_FAIL,
//     result: error
//   }
// };

// export function load(value) {
//   return dispatch => {
//     dispatch(loadAction());
// 
//     return axios.get(value.request)
//       .then(response => {
//         console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > axios > load() > typeof  RESPONSE.data: ', typeof response.data)
//         console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > axios > load() > RESPONSE.data: ', response.data)
//         // console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > axios > load() > RESPONSE > JSON.stringify: ', JSON.stringify(response.data))
//         dispatch(loadSuccess(response.data))
//       })
//       .catch(error => {
//         console.log('>>>>>>>>>>>>>>>> filterableTable > reducer > axios > load() > ERROR.data: ', error.response ? error.response.data : error)
//         dispatch(loadFailure(error.response ? error.response.data : error))
//       })
//   }
// }
