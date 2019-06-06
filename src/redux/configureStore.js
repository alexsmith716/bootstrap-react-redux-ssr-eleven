import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
 import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './clientMiddleware';
import createRootReducer from './reducers';
// import notify from 'redux-notify';

// ----------------------------------------------------------------------

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

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

function getNoopReducers(reducers, data) {
  if (!data) {
    return {};
  }

  return Object.keys(data).reduce((accu, key) => {
    if (reducers[key]) {
      return accu;
    }

    return {
      ...accu,
      [key]: (state = data[key]) => state
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
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  // const r = __CLIENT__ && __DEVTOOLS__ && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : v => v;

  const finalCreateStore = compose(...enhancers)(createStore);

  const reducers = createRootReducer();

  const noopReducers = getNoopReducers(reducers, data);

  const store = finalCreateStore(combine({ ...noopReducers, ...reducers }, persistConfig), data);

  // ----------------------------------------------------------------------

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
      let reducer = require('./reducers').default;
      reducer = combine((reducer.__esModule ? reducer.default : reducer), persistConfig);
      store.replaceReducer(reducer);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > NO MODULE.HOT <<<<<<<<<<<<<<');
  }

  // ----------------------------------------------------------------------

  return store;
};
