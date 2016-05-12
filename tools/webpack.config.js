import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

let babelLoaderPlugins = [
  'transform-runtime',
];

if (!DEBUG) {
  babelLoaderPlugins = [
    ...babelLoaderPlugins,
    'transform-react-remove-prop-types',
    'transform-react-constant-elements',
    'transform-react-inline-elements',
  ];
}

const config = {
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../build/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        query: {
          cacheDirectory: (DEBUG ? '/tmp' : false),
          babelrc: false,
          presets: [
            'react',
            'es2015',
            'stage-0',
          ],
          plugins: babelLoaderPlugins
        }
      },
      {
        test: /\.(scss|css)$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            // CSS Nano http://cssnano.co/options/
            minimize: !DEBUG,
          })}`,
          'postcss-loader?parser=postcss-scss',
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?.+)?$/,
        loader: 'url-loader',
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)(\?.+)?$/,
        loader: 'file-loader',
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
        },
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader',
      }
    ],
  },

  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('postcss-url')({copy: 'rebase'}),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = extend(true, {}, config, {
  entry: './client/client.js',

  output: {
    filename: DEBUG ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
    chunkFilename: DEBUG ? '[name].[id].js?[chunkhash]' : '[name].[id].[chunkhash].js',
  },

  target: 'web',

  plugins: [
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),

    new webpack.optimize.OccurenceOrderPlugin(true),

    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
          warnings: VERBOSE,
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin()
    ])
  ],
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = extend(true, {}, config, {
  entry: './server/server.js',

  output: {
    filename: '../../server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^\.\/assets$/,
    function filter(context, request, cb) {
      const isExternal = request.match(/^[@a-z][a-z\/\.\-0-9]*$/i);
      cb(null, Boolean(isExternal));
    },
  ],

  plugins: [
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': false }),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: 'source-map',
});

export default [clientConfig, serverConfig];
