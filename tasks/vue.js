import gulp from 'gulp';
import vueify from 'gulp-vueify';

gulp.task('vue', function () {
  return gulp.src('client/components/**/*.vue')
    .pipe(vueify())
    .pipe(gulp.dest('client/components/'));
});
