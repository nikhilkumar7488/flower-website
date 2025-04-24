import gulp from 'gulp';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';

const server = browserSync.create();

export const copySW = () =>
  gulp.src('sw.js').pipe(gulp.dest('dist'));

export const styles = () =>
  gulp.src(['style.css', 'cart.css'])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.stream());

export const scripts = () =>
  gulp.src(['script.js', 'cart.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(server.stream());

export const serve = () => {
  server.init({ server: { baseDir: './' } });

  gulp.watch(['*.css'], styles);
  gulp.watch(['*.js'], gulp.series(scripts, (done) => {
    server.reload();
    done();
  }));
  gulp.watch(['*.html']).on('change', server.reload);
};

export default gulp.series(gulp.parallel(styles, scripts, copySW), serve);
