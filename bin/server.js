// @flow

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DISABLE_SSR__ = false;
global.__DLLS__ = process.env.WEBPACK_DLLS;

require('./start');
