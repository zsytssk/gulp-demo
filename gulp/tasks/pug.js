var gulp = require('gulp');
var pug = require('gulp-pug');
var merge = require('merge-stream');
var errorHandler = require('../util/errorHandler');

var options = {
  pretty: true
};

function runPug() {
  var template = gulp.src(dirs.src + dirs.src_paths.pug)
    .pipe(errorHandler())
    .pipe(pug(options))
    .pipe(gulp.dest(dirs.dist));
  return merge(template);
}

module.exports = runPug;
