var gulp = require('gulp');
var pug = require('gulp-pug');
var merge = require('merge-stream');
var errorHandler = require('../util/errorHandler');
var config = require('./../config');
var config_pug = config.pug;


var src = config.src + config_pug.src_paths;
var dist = config.dist + config_pug.dest_paths;


var options = {
  pretty: true
};



function runPug() {
  var template = gulp.src()
    .pipe(errorHandler())
    .pipe(pug(options))
    .pipe(gulp.dest(dist));
  return merge(template);
}

module.exports = runPug;