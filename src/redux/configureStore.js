import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// persisted state saved to redux / persisted state retrieved from redux
 import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './clientMiddleware';
import createRootReducer from './reducers';
// import notify from 'redux-notify';

// 'reduceRight()' works just like 'reduce()', 
// except that it processes the array from highest index to lowest (right-to-left), 
// rather than from lowest to highest. 
// You might want to do this if the reduction operation has right-to-left precedence

// ----------------------------------------------------------------------

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

// ----------------------------------------------------------------------

// * https://redux.js.org/recipes/code-splitting
// * split up the app code into multiple JS bundles that can be loaded on-demand
// * 'code splitting', helps to increase app performance by reducing 
//    the size of the initial JS payload that must be fetched
// * to code split, reducers are dynamically add to the store
// * Redux store exposes a 'replaceReducer' function, 
//    which replaces the current active root reducer function with a new root reducer function
// * 'replaceReducer': swaps the internal reducer function reference, 
//    and dispatchs an action to help any newly-added slice reducers initialize themselves

// *  on-demand, add the reducer for a websocket connected chat component to the store 

// inject reducer function
// This function adds the async reducer, and creates a new combined reducer
// ----------------------------------------------------------------------
// export function inject(store, reducers, persistConfig) {
//   Object.keys(reducers).forEach(name => {
//     const reducer = reducers[name];
// 
//     if (!store.asyncReducers[name]) {
//       store.asyncReducers[name] = reducer.__esModule ? reducer.default : reducer;
//     }
//   });
// 
//   store.replaceReducer(combine(createReducers(store.asyncReducers), persistConfig));
// }

// ----------------------------------------------------------------------

function customLogger({ getState }) {
  return next => action => {
    console.log('>>>>>>>>>>>>>>>>> configureStore > customLogger() > will dispatch', action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log('>>>>>>>>>>>>>>>>> configureStore > customLogger() > state after dispatch', getState());

    return returnValue;
  }
};

// ----------------------------------------------------------------------

// if code requires some function passed to it, otherwise it will toss an error:

// ( () => {}; )                            // empty arrow function
// var noop = function () {};
// const noop = () => {};
// setTimeout(noop, 10000);
// setTimeout(function () {} , 10000);
// setTimeout(() => {} , 10000);
// setTimeout(Function(), 10000);
// setTimeout(Function.prototype, 10000);

function getNoOperationReducers(reducers, array) {
  if (!array) {
    return {};
  }

  // array.reduce( (accumulator, element) => cb, initAccumulator )
  return Object.keys(array).reduce((accu, element) => {
    if (reducers[element]) {
      return accu;
    }

    return {
      ...accu,
      [element]: (state = array[element]) => state
    };
  }, {});
}

// ----------------------------------------------------------------------

export default function configureStore({ data, helpers, persistConfig }) {

  const middleware = [clientMiddleware(helpers)];

  if (__CLIENT__ && __DEVELOPMENT__) {
    middleware.push(customLogger);
  }

  // ----------------------------------------------------------------------

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
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  // const r = __CLIENT__ && __DEVTOOLS__ && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : v => v;

  // >>>>>>>>>>>>>>>> COMPOSES functions from right to left <<<<<<<<<<<<<<<
  // >>>>>>>>>>>>>>>> apply several store enhancers in a row <<<<<<<<<<<<<<<
  // store enhancer is a higher-order function that composes a store creator to return a new, enhanced store creator
  // a store is not an instance, it's a plain-object collection of functions
  // a store is not an instance, so copies can be easily created and modified without mutating the original store

  const finalEnhancer = compose(...enhancers)(createStore);
  const reducers = createRootReducer();
  const noopReducers = getNoOperationReducers(reducers, data);
  const store = finalEnhancer(combine({ ...noopReducers, ...reducers }, persistConfig), data);

  // ----------------------------------------------------------------------

  // const middleware = [ clientMiddleware(axios), customLogger, logger ];

  // createStore( 
  //   combine(createRootReducer()),
  //   preloadedState (persistConfig),
  //   compose(applyMiddleware(...middleware))
  // )

  // const finalCreateStore = compose( applyMiddleware(clientMiddleware(axios), customLogger, logger))(createStore)
  // const store = finalCreateStore( combine(createRootReducer()) );

  // const store = applyMiddleware(clientMiddleware(axios), customLogger, logger)(createStore)(rootReducer)

  // ----------------------------------------------------------------------

  store.asyncReducers = {};
  // store.inject = _reducers => inject(store, _reducers, persistConfig);

  if (persistConfig) {
    const persistoid = createPersistoid(persistConfig);
    store.subscribe(() => {
      persistoid.update(store.getState());
    });
    store.dispatch({ type: REGISTER });
  }

  // ----------------------------------------------------------------------

  if (__DEVELOPMENT__ && module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > YES MODULE.HOT <<<<<<<<<<<<<<<<<');
    module.hot.accept('./reducers', () => {
      let reducer = require('./reducers');
      reducer = combine((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers), persistConfig);
      store.replaceReducer(reducer);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > NO MODULE.HOT <<<<<<<<<<<<<<');
  }

  // ----------------------------------------------------------------------

  return store;
};
