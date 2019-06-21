import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import {createBrowserHistory} from 'history';
import { Provider } from 'react-redux';
import { trigger } from 'redial';

// asynchronous offline local storage
import localForage from 'localforage';
import { getStoredState } from 'redux-persist';
// make app capable of using hot reloading to make seamless changes
import { AppContainer as HotEnabler } from 'react-hot-loader';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import { RouterTrigger } from './components';
import routes from './routes';
import apiClient from './helpers/apiClient';
import configureStore from './redux/configureStore';
import isOnline from './utils/isOnline';
// import NProgress from 'nprogress';
import './js/app';

// =====================================================================

// Local Storage > http://localhost:3000
// localforage/persist:root: "{\"counter\":\"{\\\"countPreloadedState\\\":42,\\\"countMultireducer\\\":0}\",\"device\":\"{\\\"isMobile\\\":false}\",\"info\":\"{\\\"notifs\\\":{},\\\"device\\\":{\\\"isMobile\\\":null},\\\"info\\\":{\\\"loaded\\\":false},\\\"counter\\\":{\\\"countPreloadedState\\\":null,\\\"countMultireducer\\\":0},\\\"filterableTable\\\":{\\\"filterText\\\":\\\"\\\",\\\"inStockOnly\\\":false,\\\"loaded\\\":false,\\\"dropDownOptionSelected\\\":\\\"\\\",\\\"error\\\":false,\\\"errorResponse\\\":{\\\"message\\\":\\\"\\\",\\\"documentation_url\\\":\\\"\\\"},\\\"isLoading\\\":false,\\\"fetchedData\\\":null,\\\"didInvalidate\\\":false},\\\"temperatureCalculator\\\":{\\\"temperature\\\":\\\"\\\",\\\"scale\\\":\\\"c\\\"},\\\"isLoading\\\":false,\\\"loaded\\\":true,\\\"data\\\":1561053136395}\"}"
const persistConfig = {
  key: 'root',
  storage: localForage,
  // redux-persist:
  // inboundState:  the state being rehydrated from storage
  // originalState: the state before the REHYDRATE action
  stateReconciler(inboundState, originalState) {
    // preloadedState from window object
    return originalState;
  },
  // redux-persist:
  // blacklist what state will not be persisted
  // blacklist: ['notifs'],
  // whitelist what state will be persisted
  whitelist: ['device', 'info', 'counter', 'filterableTable', 'temperatureCalculator']
};

const dest = document.getElementById('content');
// const dest = document.querySelector('#content');
// const dest = document.querySelector('.react-container');

// =====================================================================

// const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });

const client = apiClient();

const providers = {
  client
};

(async () => {

  // redux-persist:
  // delays rendering of app UI until persisted state has been retrieved and saved to redux
  const preloadedState = await getStoredState(persistConfig);

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > preloadedState: ', preloadedState);
  // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > window.__PRELOADED__: ', window.__PRELOADED__);
  // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > window.__data: ', window.__data);

  // const preloadedState = window.__data;
  // const preloadedState = await getStoredState(persistConfig);

  const online = window.__data ? true : await isOnline();

  const history = createBrowserHistory();

  const store = configureStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > HISTORY: ', history);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > STORE: ', store);

  // ======================================================================================

  const triggerHooks = async (_routes, pathname) => {
    // NProgress.start();

    const { components, match, params } = await asyncMatchRoutes(_routes, pathname);
    
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    // window.__PRELOADED__=true;
    // window.__data=${serialize(store.getState())};

    // Don't fetch data for initial route, server has already done the work:
    if (window.__PRELOADED__) {
      // Delete initial data so that subsequent data fetches can occur:
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > triggerHooks > window.__PRELOADED__ 11: ', window.__PRELOADED__);
      delete window.__PRELOADED__;
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > triggerHooks > window.__PRELOADED__ 22: ', window.__PRELOADED__);
      await trigger('fetch', components, triggerLocals);
    }
    // Fetch deferred, client-only data dependencies
    await trigger('defer', components, triggerLocals);

    // NProgress.done();
  };

  // ======================================================================================

  const hydrate = _routes => {
    const element = (
      <HotEnabler>
        <Provider store={store} {...providers}>
          <Router history={history}>
            <RouterTrigger trigger={pathname => triggerHooks(_routes, pathname)}>{renderRoutes(_routes)}</RouterTrigger>
          </Router>
        </Provider>
      </HotEnabler>
    );

    if (dest.hasChildNodes()) {
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > dest.hasChildNodes() > ReactDOM.hydrate()');
      ReactDOM.hydrate(element, dest);
    } else {
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > !dest.hasChildNodes() > ReactDOM.render()');
      ReactDOM.render(element, dest);
    }
  };

  hydrate(routes);

  // ==============================================================================================

  // https://webpack.js.org/concepts/hot-module-replacement/
  // https://webpack.js.org/api/hot-module-replacement/
  // https://webpack.js.org/guides/hot-module-replacement/
  // https://webpack.js.org/plugins/hot-module-replacement-plugin/
  // https://webpack.js.org/guides/development/#using-webpack-dev-middleware
  // https://github.com/webpack-contrib/webpack-hot-middleware

  if (module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! <<<<<<<<<<<<<<<<<');
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  }

  // ==============================================================================================

  if (process.env.NODE_ENV !== 'production') {
    window.React = React;
  }

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > process.env.NODE_ENV: ', process.env.NODE_ENV);

  // ==============================================================================================

  if (__DEVTOOLS__ && !window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ <<<<<<<<<<<<<<<<<<<<<<');
    const devToolsDest = document.createElement('div');
    window.document.body.insertBefore(devToolsDest, null);
    const DevTools = require('./containers/DevTools/DevTools').default;

    ReactDOM.hydrate(
      <Provider store={store}>
        <DevTools />
      </Provider>,
      devToolsDest
    );
  }

  if (!__DEVELOPMENT__) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ NO <<<<<<<<<<<<<');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ YES <<<<<<<<<<<<<');
  }
  if ('serviceWorker' in navigator) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker in navigator YES <<<<<<<<<<<<<');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker in navigator NO <<<<<<<<<<<<<');
  }

  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/dist/' });
      console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator YES!! <<<<<<<<<<<<<');
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available.');
              } else {
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
            default:
          }
        };
      };
    } catch (error) {
      console.log('Error registering service worker: ', error);
    }
    await navigator.serviceWorker.ready;
    console.log('Service Worker Ready');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator NO!! <<<<<<<<<<<<<');
  }

})();
