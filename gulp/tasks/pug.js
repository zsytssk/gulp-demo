var gulp = require('gulp');
var pug = require('gulp-pug');
var merge = require('merge-stream');
var errorHandler = require('../util/errorHandler');

var options = {
  pretty: true
};

function runPug() {
  var pugPc = gulp.src(dirs.src + '/pc/pug/questionnaire.pug')
    .pipe(errorHandler())
    .pipe(pug(options))
    .pipe(gulp.dest(dirs.dist + '/pc'));
  var pugMobile = gulp.src(dirs.src + '/mobile/pug/questionnaire.pug')
    .pipe(errorHandler())
    .pipe(pug(options))
    .pipe(gulp.dest(dirs.dist + '/mobile'));
  return merge(pugPc, pugMobile);
}

module.exports = runPug;
