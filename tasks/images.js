import gulp from 'gulp';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('images', () => {
  return gulp.src('client/assets/images/**/*')
    .pipe(gulpif(args.production, imagemin()))
    .pipe(gulp.dest(`${dist_folder}/assets/images`))
    .pipe(gulpif(args.watch, livereload()));
});
