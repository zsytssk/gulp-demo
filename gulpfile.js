let gulp = require('gulp');
let config = require('./gulp/config');
let config_activeTasks = config.activeTasks;

let task_list = [];
for (let i = 0; i < config_activeTasks.length; i++) {
  let task_name = config_activeTasks[i];
  let task_model = config[config_activeTasks[i]].model;
  gulp.task(task_name, require(task_model));
  task_list.push(task_name);
}

gulp.task('watch', function () {
  for (let i = 0; i < config_activeTasks.length; i++) {
    let task_name = config_activeTasks[i];
    let task_watch_paths = config[config_activeTasks[i]].watch_paths;
    gulp.watch(config.src + task_watch_paths, gulp.parallel(task_name));
  }
});
task_list.push('watch');

gulp.task('default', gulp.parallel.apply(this, task_list));