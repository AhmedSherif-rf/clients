import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpSequence from 'gulp-sequence';
import livereload from 'gulp-livereload';
import args from './lib/args';

// In order to make chromereload work you'll need to include
// the following line in your `scipts/background.js` file.
//
//    import 'chromereload/devonly';
//
// This will reload your extension everytime a file changes.
// If you just want to reload a specific context of your extension
// (e.g. `pages/options.html`) include the script in that context
// (e.g. `scripts/options.js`).
//
// Please note that you'll have to restart the gulp task if you
// create new file. We'll fix that when gulp 4 comes out.

livereload({ start: true })

gulp.task('chromereload', (cb) => {

  // This task runs only if the
  // watch argument is present!
  if (!args.watch) return cb();

  // // Start livereload server
  livereload.listen({
    reloadPage: 'Extension',
    quiet:false //!args.verbose
  });

  // livereload({start: true})

  gutil.log('Starting', gutil.colors.cyan('\'livereload-server\''));

  // The watching for javascript files is done by webpack
  // Check out ./tasks/scripts.js for further info.
  gulp.watch('client/*',['root']);
  gulp.watch('client/components/**/*.vue',['pages','scripts']);
  gulp.watch('client/assets/css/**/*.css', ['styles:css']);
  gulp.watch('client/assets/css/**/*.scss', ['styles:sass']);
  gulp.watch('client/assets/images/**/*', ['images']);
});
