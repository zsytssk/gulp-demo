var config = {
  src: './src',
  dist: './dist',
  activeTasks: ['pug', 'postcss'],
  postcss: {
    model: './gulp/tasks/postcss',
    src_paths: '/postcss/*.*',
    dest_paths: '/css',
    watch_paths: '/**/*.css',
  },
  pug: {
    model: './gulp/tasks/pug',
    src_paths: '/pug/*.*',
    dest_paths: '',
    watch_paths: '/**/*.pug',
  },
  concatjs: {
    model: './gulp/tasks/concatjs',
    src_paths: '/js/*.*',
    dest_paths: '/js',
    watch_paths: '/**/*.js',
    output_name: 'niuking.js',
    minify: true,
    files_list: []
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
  }
};

module.exports = config;