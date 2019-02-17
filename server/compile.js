require('../globals');

const debug = require('debug')('app:build:webpack-compiler');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

// 编译
function webpackCompiler() {
    return new Promise((reolve, reject) => {
        const compiler = webpack(webpackConfig);
        complier.run((err, stats) => {
            if (err) {
                debug('Webpack compiler encountered a fatal error', err);
                return reject(err)
            }

            const jsonStats = stats.toJson();
            
            debug('Webpack compliation is completed')
            resolve(jsonStats)
        })
    })
}

// 编译函数
const compile = () => {
    debug('Starting compiler.');
   
    return Promise.resolve()
      .then(() => webpackCompiler())
      .then(() => {
        debug('Compilation completed successfully.');
      })
      .catch(err => {
        debug('Compiler encountered an error.', err);
   
        process.exit(1);
      });
   };
   
   compile();