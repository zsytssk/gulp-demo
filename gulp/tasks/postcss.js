var gulp = require('gulp');
var errorHandler = require('../util/errorHandler');
var merge = require('merge-stream');
var path = require('path');
var config = require('./../config');
var config_postcss = require('./../config');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var utilities = require('postcss-utilities');
var animation = require('postcss-animation');
var postcss_url = require('postcss-url');
var precss = require('precss');
var stylefmt = require('stylefmt');

var src = config.src + config_postcss.src_paths;
var dist = config.src + config_postcss.dest_paths;

var processors = [
  precss(),
  utilities(),
  postcss_url({
    url: 'inline',
    maxSize: 10,
    fallback: function (url, x1, x2, dir, to) {
      var project_path = process.cwd();
      var img_ab_path = path.resolve(dir, url);
      var des_path = path.resolve(project_path, to);
      var result_path = path.relative(des_path, img_ab_path);
      return result_path;
    }
  }),
  animation(),
  autoprefixer({
    browsers: ['> 0%']
  }),
  cssnano({
    discardComments: false
  }),
  stylefmt()
];

var processors2 = [
  postcss_url({
    url: 'inline',
    maxSize: 10,
    fallback: function (url, x1, x2, dir, to) {
      var result_path = config.biaoji.imgPathInsideCss + url.replace('../images/', '');
      return result_path;
    }
  })
];

function runPostcss() {
  var style = gulp.src(src)
    .pipe(errorHandler())
    .pipe(postcss(processors, {
      to: dist + '/images'
    }))
    .pipe(gulp.dest(dist));

  // if (config.isInBiaoji()) {
  //   // 在标记中要做的
  //   style1 = style1.pipe(postcss(processors2, {
  //       to: config.dist + config.dest_paths.postcss + '/images'
  //     }))
  //     .pipe(gulp.dest(config.biaoji.cssPath));
  // }
  return merge(style);
}

module.exports = runPostcss;