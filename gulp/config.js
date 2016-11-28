var config = {
  src: './src',
  dist: './dist',
  activeTask: ['concatjs'],
  tasks: {
    'concatjs': './gulp/tasks/concatjs',
    // 'postcss': './gulp/tasks/postcss',
    // 'pug': './gulp/tasks/pug'
  },
  watch_paths: {
    concatjs: '/**/*.js',
    postcss: '/**/*.css',
    pug: '/**/*.pug',
  },
  src_paths: {
    concatjs: '/js/*.*',
    postcss: '/postcss/*.*',
    pug: '/pug/*.*',
  },
  dest_paths: {
    concatjs: '/../../src',
    postcss: '/css',
    pug: '',
    minify: '/js',
  },
  concatjs: {
    name: 'niuking.js',
    mini_name: 'niuking.min.js',
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
  js_order: [
    './src/js/res.js',
    './src/js/config.js',
    './src/js/lib/underscore-min.js',
    './src/js/lib/zutil.js',
    './src/js/lib/base64.js',
    './src/js/lib/director.min.js',
    './src/js/lib/zsy.observer.js',
    './src/js/common/animate.js',
    './src/js/models/socket.js',
    './src/js/models/ajax.js',
    './src/js/models/audio.js',
    './src/js/router.js',
    './src/js/controllers/common/common.js',
    './src/js/controllers/popUp.js',
    './src/js/controllers/load.js',
    './src/js/controllers/home.js',
    './src/js/controllers/home/notify.js',
    './src/js/controllers/home/homeDetail.js',
    './src/js/controllers/home/homePublic.js',
    './src/js/controllers/room/roomDetail.js',
    './src/js/controllers/room/header.js',
    './src/js/controllers/room/animateBox.js',
    './src/js/controllers/room/bigSign.js',
    './src/js/controllers/room/middleBoxDetail.js',
    './src/js/controllers/room/seat.js',
    './src/js/controllers/room/seatDetail.js',
    './src/js/controllers/room/headerDetail.js',
    './src/js/controllers/room.js',
    './src/js/app.js'
  ],
};

module.exports = config;