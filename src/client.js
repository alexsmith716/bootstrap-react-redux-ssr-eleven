import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import { AppContainer as HotEnabler } from 'react-hot-loader';
import { AppContainer  } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';
import {createBrowserHistory} from 'history';
import localForage from 'localforage';
import { getStoredState } from 'redux-persist';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import { ReduxAsyncConnect } from './components';
import routes from './routes';
import apiClient from './helpers/apiClient';
import configureStore from './redux/configureStore';
import isOnline from './utils/isOnline';
import './js/app';

// =====================================================================

const persistConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler(inboundState, originalState) {
    return originalState;
  },
  // whitelist: ['info']
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

  const preloadedState = await getStoredState(persistConfig);

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > preloadedState: ', preloadedState);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > window.__PRELOADED__: ', window.__PRELOADED__);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > window.__data: ', window.__data);

  // const preloadedState = window.__data;
  // const preloadedState = await getStoredState(persistConfig);

  const online = window.__data ? true : await isOnline();

  const history = createBrowserHistory();

  const store = configureStore({
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  //console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > history: ', history);

  const hydrate = async _routes => {
  
    ReactDOM.hydrate(
      <AppContainer>
        <Provider store={store} >
          <Router history={history}>
            <ReduxAsyncConnect routes={_routes}>
              {renderRoutes(_routes)}
            </ReduxAsyncConnect>
          </Router>
        </Provider>
      </AppContainer>,
      dest
    )
  };

  await hydrate(routes);

  // ==============================================================================================

  if (module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! <<<<<<<<<<<<<<<<<');
    module.hot.accept('./routes', () => {
      // const nextRoutes = require('./routes').default;
      const nextRoutes = require('./routes');
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! > nextRoutes: ', nextRoutes);
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes).catch(err => {
      // hydrate(nextRoutes).catch(err => {
        console.error('>>>>>>>>>>>>>>>>>>> Error on routes reload:', err);
      });
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  }

  // ==============================================================================================

  if (process.env.NODE_ENV !== 'production') {
    window.React = React;
    // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > Server-side rendering check <<<<<<<<<<<<<<<<<<<<<< dest1: ', dest);
    // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > Server-side rendering check <<<<<<<<<<<<<<<<<<<<<< dest2: ', dest.firstChild);
    // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > Server-side rendering check <<<<<<<<<<<<<<<<<<<<<< dest3: ', dest.firstChild.attributes);
    // console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > Server-side rendering check <<<<<<<<<<<<<<<<<<<<<< dest4: ', dest.firstChild.attributes['data-reactroot']);

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-reactroot']) {
      // console.error('Server-side React render was discarded.' + 'Make sure that your initial render does not contain any client-side code.');
    }
  }

  // ==============================================================================================

  if (__DEVTOOLS__ && !window.devToolsExtension) {
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
