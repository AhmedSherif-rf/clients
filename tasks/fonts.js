import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('fonts', () => {
  return gulp.src('client/assets/fonts/**/*.{woff,woff2,ttf,eot,svg}')
    .pipe(gulp.dest(`${dist_folder}/assets/fonts`))
    .pipe(gulpif(args.watch, livereload()));
});
