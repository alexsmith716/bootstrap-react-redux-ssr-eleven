const path = require('path');
const webpack = require('webpack');
const projectRootPath = path.resolve(__dirname, '../');

// The DllPlugin and DllReferencePlugin provide means to split bundles in a way that can drastically improve build time performance
// This plugin can be used in two different modes, scoped and mapped.
// https://webpack.js.org/plugins/dll-plugin/#modes

module.exports = {

  mode: 'development',
  // devtool: 'inline-source-map', // A SourceMap is added as a DataUrl to the bundle
  devtool: 'eval',

  output: {
    // dll bundle build
    path: path.join(projectRootPath, 'build/static/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },

  performance: {
    hints: false
  },

  entry: {
    vendor: [
      'core-js/stable',
      'regenerator-runtime/runtime',

      '@babel/runtime-corejs3/core-js/array/from.js',
      '@babel/runtime-corejs3/core-js/array/is-array.js',
      '@babel/runtime-corejs3/core-js/get-iterator.js',
      '@babel/runtime-corejs3/core-js/instance/bind.js',
      '@babel/runtime-corejs3/core-js/instance/concat.js',
      '@babel/runtime-corejs3/core-js/instance/fill.js',
      '@babel/runtime-corejs3/core-js/instance/filter.js',
      '@babel/runtime-corejs3/core-js/instance/for-each.js',
      '@babel/runtime-corejs3/core-js/instance/includes.js',
      '@babel/runtime-corejs3/core-js/instance/index-of.js',
      '@babel/runtime-corejs3/core-js/instance/map.js',
      '@babel/runtime-corejs3/core-js/instance/reduce.js',
      '@babel/runtime-corejs3/core-js/instance/slice.js',
      '@babel/runtime-corejs3/core-js/instance/values.js',
      '@babel/runtime-corejs3/core-js/is-iterable.js',
      '@babel/runtime-corejs3/core-js/number/is-integer.js',
      '@babel/runtime-corejs3/core-js/number/is-nan.js',
      '@babel/runtime-corejs3/core-js/object/assign.js',
      '@babel/runtime-corejs3/core-js/object/create.js',
      '@babel/runtime-corejs3/core-js/object/define-property.js',
      '@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js',
      '@babel/runtime-corejs3/core-js/object/get-own-property-symbols.js',
      '@babel/runtime-corejs3/core-js/object/get-prototype-of.js',
      '@babel/runtime-corejs3/core-js/object/keys.js',
      '@babel/runtime-corejs3/core-js/object/set-prototype-of.js',
      '@babel/runtime-corejs3/core-js/object/values.js',
      '@babel/runtime-corejs3/core-js/parse-float.js',
      '@babel/runtime-corejs3/core-js/parse-int.js',
      '@babel/runtime-corejs3/core-js/promise.js',
      '@babel/runtime-corejs3/core-js/set-immediate.js',
      '@babel/runtime-corejs3/core-js/set-interval.js',
      '@babel/runtime-corejs3/core-js/set-timeout.js',
      '@babel/runtime-corejs3/core-js/symbol.js',
      '@babel/runtime-corejs3/core-js/symbol/iterator.js',
      '@babel/runtime-corejs3/helpers/arrayWithHoles.js',
      '@babel/runtime-corejs3/helpers/arrayWithoutHoles.js',
      '@babel/runtime-corejs3/helpers/assertThisInitialized.js',
      '@babel/runtime-corejs3/helpers/asyncToGenerator.js',
      '@babel/runtime-corejs3/helpers/classCallCheck.js',
      '@babel/runtime-corejs3/helpers/createClass.js',
      '@babel/runtime-corejs3/helpers/defineProperty.js',
      '@babel/runtime-corejs3/helpers/extends.js',
      '@babel/runtime-corejs3/helpers/getPrototypeOf.js',
      '@babel/runtime-corejs3/helpers/inherits.js',
      '@babel/runtime-corejs3/helpers/iterableToArray.js',
      '@babel/runtime-corejs3/helpers/iterableToArrayLimit.js',
      '@babel/runtime-corejs3/helpers/nonIterableRest.js',
      '@babel/runtime-corejs3/helpers/nonIterableSpread.js',
      '@babel/runtime-corejs3/helpers/objectSpread.js',
      '@babel/runtime-corejs3/helpers/objectWithoutProperties.js',
      '@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose.js',
      '@babel/runtime-corejs3/helpers/possibleConstructorReturn.js',
      '@babel/runtime-corejs3/helpers/setPrototypeOf.js',
      '@babel/runtime-corejs3/helpers/slicedToArray.js',
      '@babel/runtime-corejs3/helpers/toConsumableArray.js',
      '@babel/runtime-corejs3/helpers/typeof.js',
      '@babel/runtime-corejs3/regenerator/index.js',

      'react-hot-loader',
      'jquery',
      'react',
      'react-dom',
      'react-helmet',
      'react-redux',
      'react-router',
      'redux',
    ]
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // create the dll-only-bundle
    // create webpack/dlls/vendor.json file which is used by the DllReferencePlugin to map dependencies
    // https://webpack.js.org/plugins/dll-plugin/#dllplugin
    new webpack.DllPlugin({
      // dll bundle reference path file (.json)
      path: path.join(projectRootPath, 'webpack/dlls/[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ]
};
