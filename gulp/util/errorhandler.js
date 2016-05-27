var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

module.exports = function () {
  return plumber({
    errorHandler: function (err) {
      notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
      })(err);

      this.emit('end');
    }
  });
};
