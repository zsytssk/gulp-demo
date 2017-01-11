let gulp = require('gulp');
let pug = require('gulp-pug');
let merge = require('merge-stream');
let errorHandler = require('../util/errorHandler');
let config = require('./../config');
let config_pug = config.pug;


let src = config.src + config_pug.src_paths;
let dist = config.dist + config_pug.dest_paths;

let options = {
  pretty: true
};

function runPug() {
  let template = gulp.src(src)
    .pipe(errorHandler())
    .pipe(pug(options))
    .pipe(gulp.dest(dist));
  return merge(template);
}

module.exports = runPug;