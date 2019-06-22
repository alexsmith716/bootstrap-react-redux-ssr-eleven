
// global.__CLIENT__ = true;
// global.__SERVER__ = false;

const path = require('path');
const webpack = require('webpack');
// const config = require('../config/config');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');
const assetsPath = path.resolve(rootPath, './build/static/dist');

const generatedIdent = (name, localName, lr) => {
  const r = Buffer.from(lr).toString('base64');
  return name + '__' + localName + '--' + r.substring( r.length-12, r.length-3 );
};

const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

// ==============================================================================================

// https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#configure-webpack
// source-maps required for loaders preceding resolve-url-loader (regardless of devtool)

// ==============================================================================================

module.exports = {

  context: path.resolve(__dirname, '..'),
  // the home directory for webpack
  // the entry and module.rules.loader option is resolved relative to this directory

  name: 'client',
  target: 'web',
  mode: 'production',
  devtool: 'hidden-source-map', // SourceMap without reference in original file
  // devtool: 'source-map', // most detailed at the expense of build speed
  // enhance debugging by adding meta info for the browser devtools

  entry: {
    main: [
      './src/theme/scss/bootstrap/bootstrap.global.scss',
      'bootstrap',
      './src/client.js',
    ]
  },

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../build/static/dist'),
    publicPath: '/dist/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader:ExtractCssChunks.loader,
            options: {
              modules: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (path.basename(loaderContext.resourcePath).indexOf('global.scss') !== -1) {
                    return localName;
                  } else {
                    return generatedIdent(path.basename(loaderContext.resourcePath).replace(/\.[^/.]+$/, ""), localName, loaderContext.resourcePath);
                  }
                },
                mode: 'local',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              // sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false,
              outputStyle: 'expanded'
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: [
                path.resolve(rootPath, 'src/theme/scss/app/functions.scss'),
                path.resolve(rootPath, 'src/theme/scss/app/variables.scss'),
                path.resolve(rootPath, 'src/theme/scss/app/mixins.scss')
              ],
            },
          },
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader:ExtractCssChunks.loader,
            options: {
              modules: true
            }
          },
          {
            loader : 'css-loader',
            options: {
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (path.basename(loaderContext.resourcePath).indexOf('global.scss') !== -1) {
                    return localName;
                  } else {
                    return generatedIdent(path.basename(loaderContext.resourcePath).replace(/\.[^/.]+$/, ""), localName, loaderContext.resourcePath);
                  }
                },
                mode: 'local',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              // sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
        },
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      },
    ]
  },

  performance: {
    hints: false
  },

  optimization: {
    minimizer: [
      // minify javascript 
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // minify css (default: cssnano)
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: { 
            inline: false, 
            annotation: true
          }
        }
      })
    ],
    // Code Splitting: Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
    splitChunks: {
      // 'splitChunks.cacheGroups' inherits and/or overrides any options from splitChunks
      // 'test', 'priority' and 'reuseExistingChunk' can only be configured on 'splitChunks.cacheGroups'
      // following config objects to 'name' are defaults
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '.',
      name: true,
      cacheGroups: {
        // no difference between the builds of below 'optimization.splitChunks.cacheGroups' objects
        // going with the default for now and moving on
        // ------------------------------------
        // "modified config":
        // vendors: {
        //   name: 'vendors',
        //   reuseExistingChunk: true,
        //   chunks: chunk => ['main',].includes(chunk.name),
        //   test: module => /[\\/]node_modules[\\/]/.test(module.context),
        //   chunks: 'async',
        //   // chunks: 'initial',
        //   // chunks: 'all',
        //   // minSize: 0,
        //   minSize: 30000,
        //   maxSize: 0,
        //   minChunks: 1,
        //   maxAsyncRequests: 5,
        //   maxInitialRequests: 3,
        //   // priority: -10
        //   // priority: 10,
        // }
        // ------------------------------------
        // "webpack's default config":
        // default config loads all css on SSR
        // that's a main difference compared to 'faceyspacey/universal-demo'
        // 'faceyspacey/universal-demo' loads css on-demand
        // tried many configs but so far default config works
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        // vendor: {
        //   test: /(node_modules|vendors).+(?<!css)$/,
        //   name: 'vendor',
        //   chunks: 'all',
        // },
        // Extracting CSS based on entry (builds a global && local css file)
        // >>>>>>>> GOOD TO KNOW NOT TO NAME A 'cacheGroups' AFTER A ENTRY POINT <<<<<<<<
        // builds a 'main.css' for all the globals and a 'mainStyles.css' for all locals
        // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-css-based-on-entry
        // mainStyles: {
        //   name: 'mainStyles',
        //   test: (m,c,entry = 'main') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
        //   chunks: 'async',
        //   // chunks: 'all',
        //   // chunks: 'initial',
        //   enforce: true
        // },
        // Extracting all CSS in a single file
        // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file
        // 'cacheGroups' could be named:
        //    * following 'routes.js' component names 
        //       * ("/" route exact >>>>>>> container/component 'Home.js')
        //    * following the container/component where they are referenced
        //       * ('App.js')
        //    * following CSS Modules global/local scoping 
        // scopedLocal: {
        //   name: 'scopedLocal',
        //   test: /\.(css|scss)$/,
        //   // chunks: 'all',
        //   chunks: 'async',
        //   // chunks: 'initial',
        //   enforce: true
        // }
        // ------------------------------------
      }
    },
    // adds an additional chunk to each entrypoint containing only the runtime
    // runtimeChunk: true
    // creates a runtime file to be shared for all generated chunks
    // runtimeChunk: {
    //   name: 'bootstrap'
    // }
  },

  resolve: {
    modules: [ 'client', 'node_modules' ],
    extensions: ['.json', '.js', '.jsx'],
  },

  plugins: [

    // new webpack.ProgressPlugin(handler),

    new ExtractCssChunks({
      filename: '[name].[contenthash].css',
      // chunkFilename: '[name].[contenthash].chunk.css',
      // hot: false,
      // orderWarning: true,
      // reloadAll: true,
      // cssModules: true
    }),

    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),

    // '__DLLS__: false' : needed for SWPrecacheWebpackPlugin
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pwa.js'
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'bootstrap-react-redux-ssr-eleven',
      filename: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 8388608,

      staticFileGlobs: [`${path.dirname(assetsPath)}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}`],
      stripPrefix: path.dirname(assetsPath),

      directoryIndex: '/dist/',
      verbose: true,
      // clientsClaim: true,
      // skipWaiting: false,
      navigateFallback: '/dist/index.html'
    }),

    // new GenerateSW({
    //   exclude: [/\.(?:png|jpg|jpeg|svg)$/],
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [],
    //   navigateFallback: '/dist/index.html',
    //   navigateFallbackWhitelist: [/^(?!\/__).*/],
    //   cacheId: ,
    // }),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: '../../analyzers/bundleAnalyzer/client-production.html',
    //   // analyzerMode: 'server',
    //   // analyzerPort: 8888,
    //   // defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: false
    // }),

    // https://webpack.js.org/plugins/provide-plugin/
    // Use modules without having to use import/require
    // ProvidePlugin: Whenever the identifier is encountered as free variable in a module, 
    //    the module is loaded automatically and the identifier is filled with the exports of 
    //    the loaded module (of property in order to support named exports).

    // To automatically load jquery point variables it exposes to the corresponding node module
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      Popper: ['popper.js', 'default'],
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
};
