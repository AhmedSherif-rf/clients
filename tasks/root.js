import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('root', () => {
  return gulp.src('client/*')
    .pipe(gulp.dest(`${dist_folder}`))
    .pipe(gulpif(args.watch, livereload()));
});