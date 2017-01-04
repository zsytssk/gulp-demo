let concat = require('gulp-concat');
let gulp = require('gulp');
let minify = require('gulp-minify');
let rename = require('gulp-rename');
let config = require('./../config');
let concatjs_config = config.concatjs;

let dist = config.dist + concatjs_config.dest_paths;
let output_name = concatjs_config.output_name;

let src = [];

let config_files_list = concatjs_config.files_list;
let config_minify = concatjs_configonfig.minify;
if (config_files_list) {
  for (let i = 0; i < config_files_list.length; i++) {
    src.push(config_files_list[i]);
  }
}

function runConcat() {
  let pipe = gulp.src(src);
  pipe = pipe.pipe(concat(output_name));
  if (config_minify) {
    pipe = pipe.pipe(minify({
      ext: {
        min: '.js',
      },
      noSource: true
    }));
  }
  return pipe.pipe(rename({
    suffix: '.min'
  })).pipe(gulp.dest(dist));
}

module.exports = runConcat;