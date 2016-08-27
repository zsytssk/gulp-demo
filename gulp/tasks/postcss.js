var gulp = require('gulp');
var errorHandler = require('../util/errorHandler');
var merge = require('merge-stream');
var path = require('path');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var utilities = require('postcss-utilities');
var postcss_url = require('postcss-url');
var precss = require('precss');
var stylefmt = require('stylefmt');

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
  autoprefixer({
    browsers: ['> 0%']
  }),
  cssnano({
    discardComments: false
  }),
  stylefmt()
];

function runPostcss() {
  var files = [
    dirs.src + dirs.src_paths.postcss
  ];

  var style = gulp.src(files[0])
    .pipe(errorHandler())
    .pipe(postcss(processors, {
      to: dirs.dist + dirs.dest_paths.postcss + '/images'
    }))
    .pipe(gulp.dest(dirs.dist + dirs.dest_paths.postcss));

  return merge(style);
}

module.exports = runPostcss;
