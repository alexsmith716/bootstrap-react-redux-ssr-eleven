// isolate concerns within a Redux application (modules)
// https://github.com/erikras/ducks-modular-redux

// Actions


// Reducer
import initialState from '../initial-state';


export default function reducer(state = initialState.device, action) {

  switch (action.type) {

    default:
      console.log('>>>>>>>>>>>>>>>> device > reducer > SWITCH > action.type > default > state: ', state);
      return state;
  }
}

// Action Creators
