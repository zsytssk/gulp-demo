var gulp = require('gulp');
var runPostcss = require('./gulp/tasks/postcss');
var runPug = require('./gulp/tasks/pug');

global.dirs = {
  src: './src',
  dist: './dist',
};

gulp.task('css', runPostcss);
gulp.task('pug', runPug);

gulp.task('watch', function () {
  gulp.watch(dirs.src + '/**/*.css', gulp.parallel('css'));
  gulp.watch(dirs.src + '/**/*.pug', gulp.parallel('pug'));
});

gulp.task('default', gulp.parallel('pug', 'css', 'watch'));
