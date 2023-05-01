import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
import args from './lib/args';

// global.dist_folder = args.production ? 'dist/prod' : 'dist/dev';
global.dist_folder = 'public'

gulp.task('build', gulpSequence(
  'clean', [
    'scripts',
    'styles',
    'images',
    'fonts',
    'root',
    'chromereload'
  ], 'hash'
));

gulp.on('stop', function() { setTimeout(()=>{process.exit(0)}, 2000) })