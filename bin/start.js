const fs = require('fs');
require('colors');
// const helmet = require('helmet');
const path = require('path');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
// const httpProxy = require('http-proxy');
// const https = require('https');
const favicon = require('serve-favicon');
// const mongoose = require('mongoose');
const webpack = require('webpack');
// express-style dev middleware for use with webpack bundles
// allows for serving of the files emitted from webpack
const webpackDevMiddleware = require('webpack-dev-middleware');
// connect a browser client to a webpack server & receive updates
const webpackHotMiddleware = require('webpack-hot-middleware');
// hot update Webpack bundles on the server
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

console.log('>>>>>>>>>>>>>>>>> START > __CLIENT__ ?: ', __CLIENT__);
console.log('>>>>>>>>>>>>>>>>> START > __SERVER__ ?: ', __SERVER__);
console.log('>>>>>>>>>>>>>>>>> START > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
console.log('>>>>>>>>>>>>>>>>> START > __DISABLE_SSR__ ?: ', __DISABLE_SSR__);
console.log('>>>>>>>>>>>>>>>>> START > __DLLS__ ?: ', __DLLS__);

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT
};

const clientConfigDev = require('../webpack/dev.client');
const serverConfigDev = require('../webpack/dev.server');

const clientConfigProd = require('../webpack/prod.client');
const serverConfigProd = require('../webpack/prod.server');

// const outputPath = clientConfigDev.output.path;

// Map will grow and shrink over time,
// reflecting rejections that start unhandled and then become handled
const unhandledRejections = new Map();

process.on('unhandledRejection', (reason, promise) => {
  console.error('>>>>>>>> BIN > START > process > Unhandled Rejection at promise:', promise);
  console.error('>>>>>>>> BIN > START > process > Unhandled Rejection reason:', reason);
  unhandledRejections.set(promise, reason);
});

process.on('rejectionHandled', promise => {
  console.error('>>>>>>>> BIN > START > process > rejectionHandled > promise:', promise);
  unhandledRejections.delete(promise);
});

// const dbURL = config.mongoDBmongooseURL;
//
// const mongooseOptions = {
//   autoReconnect: true,
//   keepAlive: true,
//   connectTimeoutMS: 30000,
//   useNewUrlParser: true
// };

// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, '../ssl/.key')),
//   cert: fs.readFileSync(path.join(__dirname, '../ssl/.crt'))
// }

const app = express();
const server = http.createServer(app);
// const server = https.createServer(httpsOptions, app);

// app.set('port', port);
app.use(morgan('dev'));

// app.use(helmet());
// app.use(helmet.contentSecurityPolicy(config.app.csp));
// app.use(helmet.xssFilter());
// app.use(headers);

app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'build', 'static', 'favicon.ico')));

// ---------------------------------------------------------------------

// const targetUrl = `http://${config.apiHost}:${config.apiPort}`;

// const proxy = httpProxy.createProxyServer({
//   target: targetUrl,
//   ws: true
// });

// ---------------------------------------------------------------------

app.use((req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> START > REQUEST IN <<<<<<<<<<<<<<<<<<<<<<<');
  // console.log('>>>>>>>>>>>>>>>>> START > REQ.ip +++++++++++++: ', req.ip);
  console.log('>>>>>>>>>>>>>>>>> START > REQ.method +++++++++++++++: ', req.method);
  console.log('>>>>>>>>>>>>>>>>> START > REQ.url ++++++++++++++++++: ', req.url);
  console.log('>>>>>>>>>>>>>>>>> START > REQ.path ++++++++++++++++++: ', req.path);
  // console.log('>>>>>>>>>>>>>>>>> START > REQ.headers ++++++++++++++: ', req.headers);
  // console.log('>>>>>>>>>>>>>>>>> START > REQ.cookies ++++++++++++++: ', req.cookies);
  // console.log('>>>>>>>>>>>>>>>>> START > REQ.session ++++++++: ', req.session);
  // console.log('>>>>>>>>>>>>>>>>> START > REQ.params +++++++++: ', req.params);
  console.log('>>>>>>>>>>>>>>>>> START > REQ.originalUrl ++++: ', req.originalUrl);
  console.log('>>>>>>>>>>>>>>>>> START > REQUEST OUT <<<<<<<<<<<<<<<<<<<<<<<');
  return next();
});

app.use('/manifest.json', (req, res) => {
  console.log('>>>>>>>>>>>>>>>>> START > app.use > manifest.json <<<<<<<<<<<<<<<<<<<<<<<');
  res.sendFile(path.join(__dirname, '..', 'build', 'static', 'manifest.json'));
});

app.use('/dist/service-worker.js', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> START > app.use > service-worker <<<<<<<<<<<<<<<<<<<<<<<');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-store');
  return next();
});

app.use('/dlls/:dllName.js', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> START > app.use > DLLs <<<<<<<<<<<<<<<<<<<<<<<');
  /* eslint-disable max-len */
  fs.access(path.join(__dirname, '..', 'build', 'static', 'dlls', `${req.params.dllName}.js`), fs.constants.R_OK, err => err ? res.send(`################## NO DLL !!! (${req.originalUrl})') ##################`) : next());
});

// app.use((req, res, next) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(res.setHeader(X-Forwarded-For) <<<<<<<<<<<<<<<<<<<<<<<');
//   res.setHeader('X-Forwarded-For', req.ip);
//   return next();
// });

// // Proxy to API server
// app.use('/api', (req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(/api) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.web(req, res, { target: targetUrl });
// });
//
// app.use('/ws', (req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(/ws) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.web(req, res, { target: `${targetUrl}/ws` });
// });
//
// server.on('upgrade', (req, socket, head) => {
//   console.log('>>>>>>>>>>>>>>>>> START > proxy.on(error) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.ws(req, socket, head);
// });
//
// proxy.on('error', (error, req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > proxy.on(error) <<<<<<<<<<<<<<<<<<<<<<<');
//   if (error.code !== 'ECONNRESET') {
//     console.error('proxy error', error);
//   }
//   if (!res.headersSent) {
//     res.writeHead(500, { 'content-type': 'application/json' });
//   }
//
//   const json = {
//     error: 'proxy_error',
//     reason: error.message
//   };
//   res.end(JSON.stringify(json));
// });

// ---------------------------------------------------------------------

const normalizePort = val => {
  const parseIntPort = parseInt(val, 10);
  if (Number.isNaN(parseIntPort)) {
    // named pipe
    return val;
  }
  if (parseIntPort >= 0) {
    // port number
    return parseIntPort;
  }
  return false;
};

console.log('>>>>>>>> BIN > START > COMMON > CONFIG >>>>>>>>>>>>>>>>>>>>>>>>: ', config);
const portNum = Number(config.port);
const port = normalizePort(__DEVELOPMENT__ ? portNum : portNum);

// https://github.com/webpack/webpack.js.org/blob/master/src/content/configuration/dev-server.md
// https://github.com/webpack/webpack-dev-middleware
// https://webpack.js.org/configuration/stats/#stats
// https://webpack.js.org/concepts/hot-module-replacement/
// https://github.com/gaearon/react-hot-loader
// https://github.com/webpack/webpack-dev-server
// https://github.com/webpack-contrib/webpack-hot-middleware

// logLevel: 'silent',
// watchOptions: {
//   aggregateTimeout: 300,
//   ignored: /node_modules/,
//   poll: false
// },
// hot: true,

const { publicPath } = clientConfigDev.output;

const serverOptions = {
  lazy: false,
  stats: { colors: true },
  serverSideRender: true,
  publicPath
};

// #########################################################################

let isBuilt = false;

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    console.error('>>>>>>>> BIN > START > ERROR > Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(port, config.host);
    }, 1000);
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log('>>>>>>>> BIN > START > Express server Listening on: ', bind);
  // mongoose.Promise = global.Promise;
  // mongoose.connect(
  //   dbURL,
  //   mongooseOptions,
  //   err => {
  //     if (err) {
  //       console.error('>>>>>>>> BIN > START > Please make sure Mongodb is installed and running!');
  //     } else {
  //       console.error('>>>>>>>> BIN > START > Mongodb is installed and running!');
  //     }
  //   }
  // );
});

// https://webpack.js.org/api/node/
// https://webpack.js.org/configuration/stats/
// https://webpack.js.org/api/node/#multicompiler

// start socket and 'listen' for connections (requests)
// method: 'app.listen(path, [callback])' <<< is identical to Node's 'http.Server.listen()'
const done = () => !isBuilt
  && server.listen(port, config.host, err => {
    isBuilt = true;
    console.log('>>>>>>>> BIN > START > STATS COMPILER HAS COMPLETED BUILD !! WAIT IS OVER !');
    if (err) {
      console.error('>>>>>>>> BIN > START > ERROR:', err);
    }
    console.info('>>>>>>>> BIN > START > Express server Running on Host:', config.host);
    console.info('>>>>>>>> BIN > START > Express server Running on Port:', port);
  });

if (portNum) {
  console.log('>>>>>>>> BIN > START > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  console.log('>>>>>>>> BIN > START > STATS COMPILER ATTEMPTING BUILD ! PLEASE WAIT ! ...');

  app.use(express.static(path.join(__dirname, '..', 'build', 'static')));

  if (__DEVELOPMENT__) {
    const compiler = webpack([clientConfigDev, serverConfigDev]);

    const clientCompiler = compiler.compilers[0];
    // const serverCompiler = compiler.compilers[1];

    const devMiddleware = webpackDevMiddleware(compiler, serverOptions);

    // // console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > DEV > compiler: ', compiler);
    // // console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > DEV > devMiddleware: ', devMiddleware);
    // // compiler: 'MultiCompiler {}'
    // // devMiddleware: 'function middleware(req, res, next) {}'

    app.use(devMiddleware);
    app.use(webpackHotMiddleware(clientCompiler));
    app.use(webpackHotServerMiddleware(compiler));
    devMiddleware.waitUntilValid(done);
  } else {
    // webpack provides a Node.js API which can be used directly in Node.js runtime
    // the Node.js API is useful in scenarios in which you need to customize the build or development process
    // all the reporting and error handling must be done manually and webpack only does the compiling part
    // For this reason the stats configuration options will not have any effect (no stats about module builds)
    webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
      if (err) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err: ', err.stack || err);
        if (err.details) {
          console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err.details: ', err.details);
        }
        return;
      }

      const clientStats = stats.toJson().children[0];

      // console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > clientStats: ', clientStats);

      if (stats.hasErrors()) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasErrors: ', clientStats.errors);
      }
      if (stats.hasWarnings()) {
        console.warn('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasWarnings: ', clientStats.warnings);
      }

      // Done processing ---------------------------------------------------------------------
      const render = require('../build/server/server.js').default;

      // app.use(express.static(outputPath));

      app.use(render({ clientStats }));

      done();
    });
  }
} else {
  console.error('>>>>>>>> BIN > START > Missing config.port <<<<<<<<<<<<<');
}

// MONGOOSE CONNECTION EVENTS

// mongoose.connection.on('connected', () => {
//   console.log(`>>>>>>>> BIN > START > Mongoose Connection: ${dbURL}`);
// });
//
// mongoose.connection.on('error', err => {
//   console.log(`>>>>>>>> BIN > START > Mongoose Connection error: ${err}`);
// });
//
// mongoose.connection.on('disconnected', () => {
//   console.log('>>>>>>>> BIN > START > Mongoose Connection disconnected');
// });
//
// // CLOSE MONGOOSE CONNECTION
//
// const gracefulShutdown = (msg, cb) => {
//   mongoose.connection.close(() => {
//     console.log(`>>>>>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
//     cb();
//   });
// };

// #########################################################################

// https://nodejs.org/api/process.html#process_process_nexttick_callback_args
// process.nextTick(callback[, ...args])
// 'process.nextTick()' adds callback to the "next tick queue"
// queue is fully drained after the current operation on the JavaScript stack runs to completion
//  and before the event loop is allowed to continue

console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > START <<<<<<<<<<<<<<<<');

process.nextTick(() => {
  console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > nextTick CALLBACK <<<<<<<<<<<<<<<<<<<');
});

console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > SCHEDULED <<<<<<<<<<<<');
// Output:
// start
// scheduled
// nextTick callback

// #########################################################################

const gracefulShutdown = (msg, cb) => {
  console.log(`>>>>>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
  cb();
};

// listen for Node processes / events
// https://nodejs.org/api/process.html

// Node process is about to exit (called explicitly OR event loop has no additional work to perform)
process.on('exit', code => {
  console.log(`>>>>>>>> BIN > START > About to exit with code: ${code}`);
});

// exceptional conditions that are brought to user attention
process.on('warning', warning => {
  console.warn('>>>>>>>> BIN > START > Node process warning.name:', warning.name);
  console.warn('>>>>>>>> BIN > START > Node process warning.message:', warning.message);
  console.warn('>>>>>>>> BIN > START > Node process warning.stack:', warning.stack);
});

// listen to Node process for Signal Events

// Monitor App termination
process.on('SIGINT', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGINT message:', m);
  gracefulShutdown('app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

// For nodemon restarts
process.once('SIGUSR2', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGUSR2 message:', m);
  gracefulShutdown('nodemon restart', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For Heroku app termination
process.on('SIGTERM', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGTERM message:', m);
  gracefulShutdown('Heroku app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});
