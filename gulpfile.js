var gulp = require('gulp');
var activeTask = ['postcss', 'pug'];

global.dirs = {
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
  }
};

for (var i = 0; i < activeTask.length; i++) {
  gulp.task(activeTask[i], require(dirs.tasks[activeTask[i]]));
}
gulp.task('watch', function () {
  for (var i = 0; i < activeTask.length; i++) {
    gulp.watch(dirs.src + dirs.watch_paths[activeTask[i]], gulp.parallel(activeTask[i]));
  }
});
activeTask.push('watch');

gulp.task('default', gulp.parallel.apply(this, activeTask));
