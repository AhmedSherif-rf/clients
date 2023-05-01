import gulp from 'gulp';

const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
import args from './lib/args';

if(args.production){
  gulp.task('hash', () => {

    const jsFilter = filter('**/*.js', { restore: true });
    const cssFilter = filter('**/*.css', { restore: true });
    const indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });
    
    // return gulp.src('public/assets/**/*', {base: "public/assets"})
    //   .pipe(rev())
    //   .pipe(gulp.dest('public/assets'))
    //   .pipe(rev.manifest())
    //   .pipe(gulp.dest('public/assets'))

    return gulp.src(['public/**/*', '!public/**/*.png', '!public/**/*.woff', '!public/**/*.woff2', '!public/**/*.ttf', '!public/**/*.eot'])
     .pipe(useref()) // Concatenate with gulp-useref
      .pipe(jsFilter)
      // .pipe(uglify()) // Minify any javascript sources
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      // .pipe(csso()) // Minify any CSS sources
      .pipe(cssFilter.restore)
      .pipe(indexHtmlFilter)
      .pipe(rev()) // Rename the concatenated files (but not index.html)
      .pipe(indexHtmlFilter.restore)
      .pipe(revRewrite()) // Substitute in new filenames
      .pipe(gulp.dest('public'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('public'));
  });
}