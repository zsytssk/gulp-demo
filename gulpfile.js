var gulp = require('gulp');
var runPostcss = require('./gulp/tasks/postcss');
var runPug = require('./gulp/tasks/pug');
var concatjs = require('./gulp/tasks/concatjs');

global.dirs = {
  src: './src',
  dist: './dist',
};

gulp.task('concatjs', concatjs);
gulp.task('css', runPostcss);
gulp.task('pug', runPug);

var keyArr = [];
var activeTask = {
  'concatjs': '/**/*.js',
  'css': '/**/*.css',
  'pug': '/**/*.pug'
};

gulp.task('watch', function () {
  for (var key in activeTask) {
    gulp.watch(dirs.src + activeTask[key], gulp.parallel(key));
  }
});

for (var key in activeTask) {
  keyArr.push(key);
}
gulp.task('default', gulp.parallel('pug', 'css', 'watch'));
