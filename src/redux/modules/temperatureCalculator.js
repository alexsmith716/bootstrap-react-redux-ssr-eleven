// isolate concerns within a Redux application (modules)
// https://github.com/erikras/ducks-modular-redux

// Actions
const CELSIUS_CHANGE = 'redux-example/temperatureCalculator/CELSIUS_CHANGE';
const FAHRENHEIT_CHANGE = 'redux-example/temperatureCalculator/FAHRENHEIT_CHANGE';

import initialState from '../initial-state';


// Reducer
export default function reducer(state = initialState.temperatureCalculator, action) {

  switch (action.type) {

    case CELSIUS_CHANGE: {
      return {
        ...state,
        scale: 'c',
        temperature: action.temperature
      };
    }

    case FAHRENHEIT_CHANGE: {
      return {
        ...state,
        scale: 'f',
        temperature: action.temperature
      };
    }

    default:
      console.log('>>>>>>>>>>>>>>>> temperatureCalculator > reducer > SWITCH > action.type > default > state: ', state);
      return state;
  }
}

// Action Creators
export function celsiusChange(temperature) {
  return {
    type: CELSIUS_CHANGE,
    temperature
  };
}

export function fahrenheitChange(temperature) {
  return {
    type: FAHRENHEIT_CHANGE,
    temperature
  };
}


// side effects, only as applicable (e.g. thunks, epics, etc)
// export function getWidget () {
//   return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
// }
