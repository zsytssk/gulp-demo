var gulp = require('gulp');
var activeTask = ['postcss', 'pug'];

global.config = {
  src: './src',
  dist: './dist',
  tasks: {
    'concatjs': './gulp/tasks/concatjs',
    'postcss': './gulp/tasks/postcss',
    'pug': './gulp/tasks/pug'
  },
  watch_paths: {
    concatjs: '/**/*.js',
    postcss: '/**/*.css',
    pug: '/**/*.pug'
  },
  src_paths: {
    concatjs: '/js/*.*',
    postcss: '/postcss/*.*',
    pug: '/pug/*.*'
  },
  dest_paths: {
    concatjs: '/js',
    postcss: '/css',
    pug: ''
  },
  git_paths: {
    concatjs: '/js',
    postcss: '/css',
    pug: ''
  },
  biaoji: { // 标记中的配置
    imgPathInsideCss: '../../../images/game/fish/',
    cssPath: 'D:\\zsytssk\\job\\git\\gamehall\\www\\files\\css\\game\\fish\\',
    cssRename: 'fish.v2.css'
  },
  isInBiaoji: function () {
    // 判断是否在标记中
    // 除了c d e 全是外接盘 就是在标记电脑上面
    var pathArr = process.cwd().split(':');
    if (pathArr.length == 1) {
      // 没有c:\\,  eg://192.1.1.1 这种格式
      return true;
    }
    if (pathArr[0] != 'C' && pathArr[0] != 'D' && pathArr[0] != 'E') {
      // 没有c:/ d:/ 这种格式的
      return true;
    }
    return false;
  },
};

for (var i = 0; i < activeTask.length; i++) {
  gulp.task(activeTask[i], require(config.tasks[activeTask[i]]));
}
gulp.task('watch', function () {
  for (var i = 0; i < activeTask.length; i++) {
    gulp.watch(config.src + config.watch_paths[activeTask[i]], gulp.parallel(activeTask[i]));
  }
});
activeTask.push('watch');

gulp.task('default', gulp.parallel.apply(this, activeTask));
