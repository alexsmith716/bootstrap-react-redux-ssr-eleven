import fs from 'fs';
import path from 'path';
// import httpProxy from 'http-proxy';

import config from '../config/config';

import Cookies from 'cookies';
import { getStoredState } from 'redux-persist'; 

import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage'; 

import { trigger } from 'redial';

import React from 'react';
import { Provider } from 'react-redux';

import asyncMatchRoutes from './utils/asyncMatchRoutes';

import { Router, StaticRouter } from 'react-router';

import { renderRoutes } from 'react-router-config';

import ReactDOM from 'react-dom/server';

import configureStore from './redux/configureStore';

import initialStatePreloaded from './redux/initial-preloaded-state';

import { isDesktop, isMobile, isBot } from './utils/device';

import {createMemoryHistory} from 'history';

import routes from './routes';

import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { flushFiles } from 'webpack-flush-chunks';

import Html from './helpers/Html';

// import actions from './redux/actions';
// import {message} from './shared/constants';

// ----------------------------------

import apiClient from './helpers/apiClient';
// import { createApp } from './app';

console.log('>>>>>>>>>>>>>>>>> SERVER > ES > CONFIG >>>>>>>>>>>>>>>>>>>>>>>>: ', config);

const getRandomInt = (min, max) => (
  Math.floor(Math.random() * (max - min)) + min
)

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

// HOF is a function which returns a function
// ---------------------------------------------------------------
// const render = require('../build/server/SERVER').default;
// app.use(render({ clientStats }));
// ---------------------------------------------------------------
// app.use(function render({ clientStats }) {
//   return function async (req, res) {
//     return ...;
//   }
// })

export default ({ clientStats }) => async (req, res) => {

  console.log('>>>>>>>>>>>>>>>>> SERVER > __CLIENT__ ?: ', __CLIENT__);
  console.log('>>>>>>>>>>>>>>>>> SERVER > __SERVER__ ?: ', __SERVER__);

  req.counter = getRandomInt(1, 100);
  req.isMobile = isMobile(req.headers['user-agent']);
  req.isBot = isBot(req.headers['user-agent']);
  req.isDesktop = isDesktop(req.headers['user-agent']);

  console.log('>>>>>>>>>>>>>>>>> SERVER > req.counter ?: ', req.counter);
  console.log('>>>>>>>>>>>>>>>>> SERVER > req.isMobile ?: ', req.isMobile);
  console.log('>>>>>>>>>>>>>>>>> SERVER > req.isBot ?: ', req.isBot);
  console.log('>>>>>>>>>>>>>>>>> SERVER > req.isDesktop ?: ', req.isDesktop);

  // ----------------------------------

  console.log('>>>>>>>>>>>>>>>>> SERVER > REQUEST IN <<<<<<<<<<<<<<<<<<<<<<<');
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++++++++: ', req.method);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++++++++: ', req.url);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.path ++++++++++++++++++: ', req.path);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++++++++: ', req.headers);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.cookies ++++++++++++++: ', req.cookies);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQUEST OUT <<<<<<<<<<<<<<<<<<<<<<<');

  // ----------------------------------

  console.log('>>>>>>>>>>>>>>>>>>> SERVER > APP LOADER > SetUpComponent !! START !! <<<<<<<<<<<<<<<<<<<<<<<');

  // 'initialEntries': The initial URLs in the history stack
  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

  console.log('>>>>>>>>>>>>>>>>>>> SERVER > APP LOADER > history: ', history)

  const preloadedState = initialStatePreloaded(req);

  console.log('>>>>>>>>>>>>>>>> SERVER > preloadedState: ', preloadedState);

  const providers = {
    client: apiClient(req)
  };

  const store = configureStore({
    history,
    data: preloadedState,
    helpers: providers
  });

  console.log('>>>>>>>>>>>>>>>> SERVER > store: ', store);

  function hydrate(a) {
    console.log('>>>>>>>>>>>>>>>>>>> SERVER > function hydrate(a) !!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<');
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={a} store={store} />).pipe(res);
  }

  // store.dispatch(actions.notifs.send({ text: 'Dispatched Message action from server...', type: message.types.success }));

  try {

    const { components, match, params } = await asyncMatchRoutes(routes, req.path);

    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > components: ', components);
    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > match: ', match);
    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > params: ', params);

    // prefetch all data for set of routes on server before render
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    // define and trigger your own custom route-level lifecycle hooks
    // '@provideHooks' decorator allows defining hooks for custom lifecycle events, 
    //      returning promises if any asynchronous operations need to be performed
    // ensure that all data for a set of routes is prefetched on the server before attempting to render
    // trigger function: initiate an event for an arbitrary array of components
    // Wait for async data fetching to complete, then render
    // returns a promise
    await trigger('fetch', components, triggerLocals);

    const context = {};

    const component = (
      <Provider store={store} {...providers}>
        <Router history={history}>
          <StaticRouter location={req.originalUrl} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Router>
      </Provider>
    );

    const content = ReactDOM.renderToString(component);

    // ------------------------------------------------------------------------------------------------------

    // 'flushChunks' and 'flushFiles' called immediately after ReactDOMServer.renderToString
    const assets = flushChunks(clientStats, { chunkNames: flushChunkNames() });

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > JS: ', assets.Js);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > STYLES: ', assets.Styles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CSS: ', assets.Css);

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > .js: ', assets.js);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > styles: ', assets.styles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > .css: ', assets.css);

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > scripts: ', assets.scripts);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > stylesheets: ', assets.stylesheets);

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHashRaw: ', assets.cssHashRaw);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHash: ', assets.cssHash);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CssHash: ', assets.CssHash);

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > publicPath: ', assets.publicPath);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > outputPath: ', assets.outputPath);

    // ===============================================================================
    // ===============================================================================

    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++++++++: ', req.url);

    // It offers 2 functions flushChunks and flushFiles, which you call immediately after ReactDOMServer.renderToString. 
    // They are used in server-rendering to extract the minimal amount of chunks to send to the client, 
    // thereby solving a missing piece for code-splitting: server-side rendering.

    // console.log('>>>>>>>>>>>>>>>>> SERVER > __DISABLE_SSR__:', __DISABLE_SSR__);

    if (__DISABLE_SSR__) {
      return hydrate(assets);
    }

    // ===============================================================================
    // ===============================================================================

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > context: ', context);

    if (context.url) {
      return res.redirect(301, context.url);
    }

    const { location } = history;

    if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(location.pathname + location.search)) {
      return res.redirect(301, location.pathname);
    }

    // ------------------------------------------------------------------------------------------------------

    // console.log('>>>>>>>>>>>>>>>> SERVER > SSR ==================== content: ', content);
    // console.log('>>>>>>>>>>>>>>>> SERVER > SSR ==================== STORE!!: ', store);

    const html = <Html assets={assets} store={store} content={content} />;
    const ssrHtml = `<!doctype html>${ReactDOM.renderToString(html)}`;

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > renderToString(html):', ssrHtml);

    res.status(200).send(ssrHtml);
    // res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500);
    hydrate(flushChunks(clientStats, { chunkNames: flushChunkNames() }));
  }
};
