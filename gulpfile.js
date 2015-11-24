// gulpfile.js
//

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var spawn       = require('child_process').spawn;
var ghPages     = require('gulp-gh-pages');


// JEKYLL
//

gulp.task('jekyll-build', function( done ) {
  return spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('jekyll-reload', ['jekyll-build'], function() {
  browserSync.reload();
});


// BROWSER SYNC
//

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {

  browserSync({
    ui: false,
    server: { baseDir: '_site' },
    ghostMode: false,
    // tunnel: true,
    online: false,
    notify: false,
    // scrollThrottle: 100
  });

});


// SASS
//

gulp.task('sass', function() {

  return gulp
    .src( 'sass/main.scss')
    .pipe(
      sass({ outputStyle: 'compressed' })
        .on('error', sass.logError)
    )
    .pipe( prefix() )
    .pipe( gulp.dest( '_site/css' ) )
    .pipe( browserSync.reload({ stream: true }) )
    .pipe( gulp.dest( 'css' ) );

});

// WATCH
//

gulp.task('watch', function() {

  gulp.watch('sass/*.scss', ['sass']);
  gulp.watch([
    '*.html',
    '_includes/*.html',
    '_layouts/*.html',
    'img/**/*',
    'js/main.js'
  ], ['jekyll-reload']);

});

// DEPLOY
//

gulp.task('deploy', function() {

  return gulp
    .src('./_site/**/*')
    .pipe( ghPages() );

});


// DEFAULT
// - `gulp`

gulp.task('default', ['browser-sync', 'watch']);
