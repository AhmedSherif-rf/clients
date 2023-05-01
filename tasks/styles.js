import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import livereload from 'gulp-livereload';
import args from './lib/args';

var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');

const _ = require('lodash');

var entries = _.map(require("../client/assets/entries.json")["css"], function(e){ return `client/assets/css/${e}`; });

gulp.task('styles:css', function() {
  return gulp.src(_.filter(entries, function(e){ return e.match(/\.css$/)}))
    // .pipe(gulpif(args.watch, watch('app/assets/css/**/*')))
    .pipe(gulpif(args.sourcemaps, sourcemaps.init()))
    .pipe(gulpif(args.production, cleanCSS()))
    .pipe(gulpif(args.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(`${dist_folder}/assets/css`))
    .pipe(gulpif(args.watch, livereload()));
});

gulp.task('styles:sass', function() {
  return gulp.src(_.filter(entries, function(e){ return e.match(/\.scss$/)}))
    // .pipe(gulpif(args.watch, watch('app/assets/css/**/*')))
    .pipe(gulpif(args.sourcemaps, sourcemaps.init()))
    .pipe(sass({ includePaths: ['./app']}).on('error', function(error) {
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      this.emit('end');
    }))
    .pipe(gulpif(args.production, cleanCSS()))
    .pipe(postcss([ autoprefixer({browsers: [
      "last 1 version",
      "> 1%",
      "ie >= 10",
      "firefox >= 20"
     ]}) ]))
    .pipe(gulpif(args.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(`${dist_folder}/assets/css`))
    .pipe(gulpif(args.watch, livereload()));
});

gulp.task('styles', [
  'styles:css',
  'styles:sass'
]);

