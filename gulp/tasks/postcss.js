var gulp = require('gulp');
var errorHandler = require('../util/errorHandler');
var merge = require('merge-stream');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var simpleVars = require('postcss-simple-vars');
var cssImport = require('postcss-import');
var postcss_url = require('postcss-url');
var path = require('path');
var postcss_nested = require('postcss-nested');
var postcss_extend = require('postcss-extend');

var csscomb = require('gulp-csscomb');

var processors = [
  cssImport(),
  postcss_nested(),
  postcss_extend(),
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
  simpleVars(),
  autoprefixer({
    browsers: ['> 0%']
  }),
  cssnano({
    core: false
  })
];
var processors2 = [
  postcss_url({
    url: 'inline',
    maxSize: 10,
    fallback: function (url, x1, x2, dir, to) {
      var result_path = '../../../images/game/fish/' + url.replace('../images/', '');
      return result_path;
    }
  })
];
function runPostcss() {
  var files = [
    dirs.src + '/postcss/*.*'
  ]

  var style = gulp.src(files[0])
    .pipe(errorHandler())
    .pipe(postcss(processors, {
      to: dirs.dist + '/css/images'
    }))
    .pipe(csscomb())
    .pipe(gulp.dest(dirs.dist + '/css'))
    .pipe(postcss(processors2, {
      to: 'dist/style/images'
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('../git/gameHall/www/files/css/game/fish/'));

  return merge(style);
}

module.exports = runPostcss;
