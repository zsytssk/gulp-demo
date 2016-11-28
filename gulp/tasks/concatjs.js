var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var config = require('./../config');

function runConcat() {
  return gulp.src(config.js_order)
    .pipe(concat(config.concatjs.name))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist + config.dest_paths.concatjs));
}

module.exports = runConcat;