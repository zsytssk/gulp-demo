var config = {
  src: './src',
  dist: './dist',
  activeTask: ['concatjs'],
  postcss: {
    model: './gulp/tasks/postcss',
    src_paths: '/postcss/*.*',
    dest_paths: '/css',
    watch_paths: '/**/*.pug',
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
    files_list: [
      './dev/config/res.js',
      './dev/config/config.js',
      './dev/util/underscore-min.js',
      './dev/util/zutil.js',
      './dev/util/deferred.js',
      './dev/util/base64.js',
      './dev/util/director.js',
      './dev/util/zsy.observer.js',
      './dev/util/countDown.js',
      './dev/ctrl/network/socket.js',
      './dev/ctrl/network/ajax.js',
      './dev/ctrl/network/router.js',
      './dev/ctrl/audio.js',
      './dev/scence/common/common.js',
      './dev/scence/common/animate.js',
      './dev/scence/pop/common.js',
      './dev/scence/pop/popAlert.js',
      './dev/scence/pop/popTakeInAlert.js',
      './dev/scence/pop/popCharge.js',
      './dev/scence/pop/popChargeOut.js',
      './dev/scence/pop/popChat.js',
      './dev/scence/pop/popGiveGift.js',
      './dev/scence/pop/popHelp.js',
      './dev/scence/pop/popRank.js',
      './dev/scence/pop/popTip.js',
      './dev/scence/popUp.js',
      './dev/scence/load.js',
      './dev/scence/GM/notify.js',
      './dev/scence/GM/home.js',
      './dev/scence/GM.js',
      './dev/scence/home/homeDetail.js',
      './dev/scence/home.js',
      './dev/scence/room/roomDetail.js',
      './dev/scence/room/header.js',
      './dev/scence/room/animateBox.js',
      './dev/scence/room/bigSign.js',
      './dev/scence/room/middleBoxDetail.js',
      './dev/scence/room/seat.js',
      './dev/scence/room/seatDetail.js',
      './dev/scence/room/headerDetail.js',
      './dev/scence/room.js',
      './dev/app.js'
    ]
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