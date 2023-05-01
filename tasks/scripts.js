import gulp from 'gulp';
import gulpif from 'gulp-if';
import { log, colors} from 'gulp-util';
import named from 'vinyl-named';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import plumber from 'gulp-plumber';
import livereload from 'gulp-livereload';
import args from './lib/args';

const _ = require('lodash');

const Dotenv = require('dotenv-webpack');
const ENV = args.production ? 'production' : 'development';

var entries = _.map(require("../client/assets/entries.json")["js"], function(e){ return `client/assets/js/${e}`; });

gulp.task('scripts', (cb) => {
  return gulp.src(entries)
    .pipe(plumber({
      errorHandler: function() {
        // Webpack will log the errors
      }
    }))
    .pipe(named())
    .pipe(gulpWebpack({
      devtool: args.sourcemaps ? 'inline-source-map': false,
      watch: args.watch,
      plugins: [ 
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify(ENV)
          },
          '__ENV__': JSON.stringify(ENV),
          '__VENDOR__': JSON.stringify(args.vendor)
        }),
        new Dotenv({
          path: `./${args.production ? '.empty' : '.env'}`, 
          systemvars: true
        })
      ].concat(args.production ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : []),
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /underscore/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },{
          test: /\.vue$/,
          loader: 'vue-loader'
        },{
          test: /\.json$/, loader: "json-loader"
        },{ test: /\.csl$/, loader: 'raw-loader'
        }]
      },
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
      }
    }, null, (err, stats) => {
      log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
        chunks: false,
        colors: true,
        cached: false,
        children: false
      }));
    }))
    .pipe(gulp.dest(`${dist_folder}/assets/js`))
    .pipe(gulpif(args.watch, livereload()));
});
