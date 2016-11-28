var gulp = require('gulp');
var config = require('./gulp/config');
activeTask = config.activeTask;

for (var i = 0; i < activeTask.length; i++) {
  console.log(activeTask[i]);
  gulp.task(activeTask[i], require(config.tasks[activeTask[i]]));
}
gulp.task('watch', function () {
  for (var i = 0; i < activeTask.length; i++) {
    gulp.watch(config.src + config.watch_paths[activeTask[i]], gulp.parallel(activeTask[i]));
  }
});
activeTask.push('watch');

gulp.task('default', gulp.parallel.apply(this, activeTask));
