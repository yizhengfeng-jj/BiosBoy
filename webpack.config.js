require('./global');
const path = require('path'); // node自带模块
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = reuqire('mini-css-extract-plugin');
const UglifyJsPlugin = rquire('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = reuqire('optimize-css-assets--webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const debug = require('debug')('app:webpack:config');

// 解析规则的配置
const rules = [
  {
    enforce: 'pre',
    test: /(\.js|\.jsx)?$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      quiet: true
    }
  },
  {
    enforce: 'pre',
    test: /(\.ts|\.tsx)?$/,
    exclude: /node_modules/,
    loader: 'tslint-loader',
    options: {
      quiet: true,
      tsConfigFile: './tsConfig.json'
    }
  },
  {
    test: /\.html$/,
    use: {
      loader: 'html-loader'
    }
  },

  // babel处理js
  {
    test: /\.(js|jsx|ts|tsx)?$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    type: 'javascript/auto',
    test: /\.json$/,
    loader: 'json-loader'
  },

  // 处理scss
  {
    test: /\.scss$/,
    use: [
      __PROD__ ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          modules: true,
          localIdentName: '[local]___[hash:base64:5]'
        }
      },
      'postcss-loader',
      'sass-loader'
    ]
  },

  // 处理字体文件和图片
  {
    test: /\.woff(\?.*)?$/,
    loader:
      'url-loder?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.woff2(\?.*)?$/,
    loader:
      'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
  },
  {
    test: /\.otf(\?.*)?$/,
    loader:
      'file-loader?prefix=fonts/&name=[path][nmae].[ext]&limit=10000&mimetype=font/opentype'
  },
  {
    test: /\.ttf(\?.*)?$/,
    loader:
      'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
  },
  {
    test: /\.eot(\?.*)?$/,
    loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
  },
  {
    test: /\.svg(\?.*)?$/,
    loader:
      'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
  },
  {
    test: /\.(png|gif|jpg|jpeg)/,
    loader: 'url-loader?limit=8192'
  }
];

//---------------------
// bundles optimazation
//---------------------

const optimization = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 2
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            unused: true,
            dead_code: true,
            warnings: false
          }
        },
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ]
  },
  preformance: {
      hints: false
  }
};

const stagePlugins = {
    test: [new BundleAnalyzerPlugin()],
    development: [
        new HtmlWebpackPlugin({
            template: path.resolve('./src/index.html'),
            filename: 'index.html',
            inject: 'body',
            minify: false,
            chunksSortMode: 'auto'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    production: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[nmae].[hash].css'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('./src/index.html'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true
            },
            chunksSortMode: 'auto'
        })
    ]
}


// 以上配置的结合
const stageConfig = {
    devtool: 'source-map',
    stats:  {
        chunks: true,
        chunkModules: true,
        colors: true
    }
};

const createConfig = () => {
    debug('Create configuration');
    debug(`Enabling devtools for '${__NODE_ENV__} Mode!'`);

    const webpackConfig = {
        mode: __DEV__ ? 'developmengt' : 'production',
        name: 'client',
        target: 'web',
        devtool: stageConfig[__NODE_ENV__].devtool,
        stats: stageConfig[__NODE_ENV__].stats,
        module: {
            rules: [...rules]
        },
        ...optimization,
        resolve: {
            modules: ['node_modules'],
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
    }

    // 入口
    wenpackConfig.entry = {
        app: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')].concat('webpack-hot-middleware/client?path=/__webpack.hmr')
    };

    // Bundles externals
    webpackConfig.externals = {
        react: 'React',
        'react-dom': 'ReactDom'
    };
    
    webpackConfig,output = {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    };

    webpackConfig.plugins = [
        new webpack.DefinePlugin({
            __DEV__,
            __PROD__,
            __TEST__
        }),
        ...stagePlugins[__NODE_ENV__]
    ]

    // 完成配置
    debug(`Webpack BUndles is ready for '${__NODE_ENV__} Mode'`);

    return webpackConfig;
}

module.exports = createConfig(); // 执行函数，输出配置


