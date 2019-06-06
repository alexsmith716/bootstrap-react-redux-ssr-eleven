// Actions
// -------------------
const LOAD = 'redux-example/info/LOAD';
const LOAD_SUCCESS = 'redux-example/info/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/info/LOAD_FAIL';

import initialState from '../initial-state';

// Reducer
// -------------------
export default function info(state = initialState, action = {}) {

  switch (action.type) {

    case LOAD:
      return {
        ...state,
        isLoading: true
      };

    case LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loaded: true,
        data: action.result
      };

    case LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
        loaded: false,
        error: action.error
      };

    default:
      return state;
  }
}

// Actions (action creators)
// -------------------
export function isLoaded(globalState) {
  return globalState.info && globalState.info.loaded;
}

export function load(value) {
  console.log('>>>>>>>>>>>>>>>> info > reducer > Action > load()> value: ', value);
  let v = 'https://www.metaweather.com/api/location/2459115/';
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ client }) => client.get(v)
  };
};
