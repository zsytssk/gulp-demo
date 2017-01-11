let gulp = require('gulp');
let errorHandler = require('../util/errorHandler');
let merge = require('merge-stream');
let path = require('path');
let config = require('./../config');
let config_postcss = config.postcss;

let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let utilities = require('postcss-utilities');
let animation = require('postcss-animation');
let postcss_url = require('postcss-url');
let precss = require('precss');
let stylefmt = require('stylefmt');

let src = config.src + config_postcss.src_paths;
let dist = config.dist + config_postcss.dest_paths;

let processors = [
  precss(),
  utilities(),
  postcss_url({
    url: 'inline',
    maxSize: 10,
    fallback: function (url, x1, x2, dir, to) {
      let project_path = process.cwd();
      let img_ab_path = path.resolve(dir, url);
      let des_path = path.resolve(project_path, to);
      let result_path = path.relative(des_path, img_ab_path);
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

let processors2 = [
  postcss_url({
    url: 'inline',
    maxSize: 10,
    fallback: function (url, x1, x2, dir, to) {
      let result_path = config.biaoji.imgPathInsideCss + url.replace('../images/', '');
      return result_path;
    }
  })
];

function runPostcss() {
  let style = gulp.src(src)
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