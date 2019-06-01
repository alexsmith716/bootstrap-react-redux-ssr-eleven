import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import clientMiddleware from './clientMiddleware';
import { reduxBatch } from '@manaflair/redux-batch';
import createRootReducer from './reducers';
// import notify from 'redux-notify';
// import events from './events';

// ----------------------------------------------------------------------

function combine(reducers) {
  return combineReducers(reducers);
};

// ----------------------------------------------------------------------

// Custom Logger Middleware
function customLogger({ getState }) {
  return next => action => {
    console.log('>>>>>>>>>>>>>>>>> configureStore > customLogger() > will dispatch', action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log('>>>>>>>>>>>>>>>>> configureStore > customLogger() > state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  }
};

// encapsulate all state mutations in the store

export default function configureStore({history, helpers, preloadedState}) {

  // const middleware = [clientMiddleware(helpers)];
  const middleware = [clientMiddleware(helpers)];

  if (__CLIENT__ && __DEVELOPMENT__) {
    middleware.push(customLogger);
  }

  // ----------------------------------------------------------------------
  // middleware.push(notify(events));

  // logger must be the last middleware in chain
  // collapsed: (takes a Boolean or optionally a Function that receives 'getState' 
  //             function for accessing current store state and 'action' object as parameters. 
  //             Returns 'true' if the log group should be collapsed, 'false' otherwise.)
  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({collapsed: true}); // custom options
    middleware.push(logger);
  }

  const enhancers = [applyMiddleware(...middleware)];

  // ----------------------------------------------------------------------

  if (__CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools').default;

    Array.prototype.push.apply(enhancers, [
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  const finalEnhancer = compose(...enhancers);

  // ----------------------------------------------------------------------

  const store = createStore(
    combine(createRootReducer(history)),
    preloadedState,
    // reduxBatch,
    finalEnhancer
  )

  // ----------------------------------------------------------------------

  if (__DEVELOPMENT__ && module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > YES MODULE.HOT <<<<<<<<<<<<<<<<<');
    module.hot.accept('./reducers', () => {
      let reducer = require('./reducers').default;
      reducer = combine(reducer(history));
      store.replaceReducer(reducer);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > NO MODULE.HOT <<<<<<<<<<<<<<');
  }

  // ----------------------------------------------------------------------

  return store;
};
