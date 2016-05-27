/* LightboxV2 */

/* extend */
;
(function (global) {
  function extend(subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    superClass.prototype.constructor = superClass;
  }

  global.PA || (global.PA = {});
  global.PA.ui || (global.PA.ui = {});
  global.PA.ui.extend = extend;
}(this));

/* Observer */
;
(function (global) {
  var onceName = 'Observer_EXCUTED_ONCE_GM';

  function Observer() {
    this.fns = [];
  }

  Observer.prototype = {
    constructor: Observer,
    subscribe: function (fn) {
      if (typeof fn === 'function') {
        this.fns.push(fn);
      }

      return this;
    },
    subscribeOnce: function (fn) {
      if (typeof fn === 'function') {
        fn[onceName] = true;
        this.fns.push(fn);
      }

      return this;
    },
    unsubscribe: function (fn) {
      if (arguments.length === 0) {
        this.fns = [];
        return this;
      }

      if (typeof fn !== 'function') {
        return this;
      }

      var fns = this.fns;
      for (var i = 0, len = fns.length; i < len; i++) {
        if (fns[i] === fn) {
          fns.splice(i, 1);
          i--;
          len--;
        }
      }

      return this;
    },
    fire: function () {
      var fns = this.fns;
      var item;
      for (var i = 0, len = fns.length; i < len; i++) {
        item = fns[i];
        item.apply(null, arguments);
        if (item[onceName] === true) {
          this.unsubscribe(item);
          i--;
          len--;
        }
      }

      return this;
    }
  }

  global.PA || (global.PA = {});
  global.PA.ui || (global.PA.ui = {});
  global.PA.ui.Observer = Observer;
}(this));
/* throttle */
;
(function (global) {
  function throttle(func, time, context, callback) {
    if (typeof func !== 'function') {
      return;
    }

    var length = arguments.length;
    switch (length) {
    case 2:
      if (typeof time === 'function') {
        callback = time;
        time = undefined;
      }
      break;

    case 3:
      if (typeof context === 'function') {
        callback = context;
        context = undefined;
      }
      break;
    default:
      break;
    }

    clearTimeout(func.timeId);
    func.timeId = setTimeout(function () {
      func.call(context || window);
      if (typeof callback === 'function') {
        callback();
      }
    }, time || 25);
    return this;
  }

  global.PA || (global.PA = {});
  global.PA.ui || (global.PA.ui = {});
  global.PA.ui.throttle = throttle;
}(this));

// LightboxV2
(function (global, $) {
  if (!$) {
    return;
  }
  var Observer = PA.ui.Observer;
  var throttle = PA.ui.throttle;

  var zDom = 9999;
  var zMask = zDom - 1;
  var isHandDevice = 'ontouchend' in document; // 判断是否手持设备

  var userAgent = navigator.userAgent.toLowerCase();
  var isIE6 = userAgent.indexOf('msie 6') > -1;

  function LightboxV2(option) {
    /* 调用方法是 new PA.ui.LightboxV2 */
    if (!(this instanceof LightboxV2)) {
      // console.log("Should use 'NEW' to init LightboxV2");
      console.log("LightboxV2 错误: 初始化弹层的时候需要用new");
      return;
    }
    var defaultOption = {
      cssMask: { // 阴影的默认 CSS
        position: 'fixed',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        opacity: '0.5',
        backgroundColor: '#000'
      },
      cssTarget: { // dom的默认 CSS
        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
      },
      target: null, // 弹窗 $dom 元素
      hideDelayTime: -1, // 延迟时间, 默认是不会有延迟时间的
      maskShow: true, // 是否显示阴影，默认true
      isFixed: false, // 弹窗是否 fixed, 默认为 absolute
      clickMask: true, // 点击阴影是否关闭，默认true
      targetClass: null, // target 的 class
      maskClass: null, // mask 的 class
      addEvent: true, // 是否增加事件对象, 目前只用来跟option的值来操作
      position: true, // 是否需要用自动定位
      positionCenter: true, // 左右是否需要自动定位
      positionMiddle: true // 上下是否需要自动定位
    }
    this._option = $.extend(true, {}, defaultOption, option);

    var $domTemp = this._$dom = this._option.target;
    if ($.type($domTemp) === 'string') {
      this._option.target = this._$dom = $($domTemp);
    }

    if (!this.isExitDom()) {
      //console.log("Can't find the target element when init");
      console.log("LightboxV2 错误: 初始化时找不到target元素");
      return;
    }

    // 若是 IE6, 则都没有 fixed 属性
    if (isIE6) {
      $.extend(true, this._option, {
        cssMask: {
          position: 'absolute',
          height: this._getDocHeight()
        },
        isFixed: false
      });
    }
    this._$mask = $('<div></div>');
    this._store.push(this);

    this._domHeight = null; // target 高度
    this._domWidth = null; // target 宽度
    this._oParentLeft = 0; // target 的 offsetParent().left
    this._oParentTop = 0; // target 的 offsetParent().top
    this._eventObj = null; // 创建绑定 resize 事件的object
    this._isInit = false; // 是否初始化过
    this._isDisposed = false; // 是否已经销毁了
    this._isRecaSize = true; // show 方法时 是否计算元素的尺寸, 默认是需要

    this._hideDelayTimeout = null;
    // 先存储下 hideDelayTime, 然后隐藏的时候再恢复
    this._hideDelayTimeStore = this._option.hideDelayTime;
    this._hideDelayFunc = function () {
      clearTimeout(this._hideDelayTimeout);
      this._option.hideDelayTime = this._hideDelayTimeStore;
    }

    this._shown = new Observer();
    this._hidden = new Observer();
    this._disposed = new Observer();
    this._showing = new Observer();
    this._showingAfter = new Observer();
    this._hiding = new Observer();
    this._hidingAfter = new Observer();
  }

  LightboxV2.prototype = {
    constructor: LightboxV2,
    _store: [], // 存储所有弹窗的 this
    _page: {
      $body: null,
      $document: null,
      $window: null,
      winHeight: null,
      winWidth: null
    },
    // 获取 store 里面的所有实例
    getStore: function () {
      return this._store;
    },
    // 筛选 store 里面的没有参数传递进来的实例
    notStore: function () {
      var me = this;
      var arr = [];
      var len = arguments.length;
      var store = me._store;
      var storeLen = store.length;
      var i, j, item, item2;
      var find;
      for (i = 0; i < storeLen; i++) {
        find = false;
        item = store[i];
        for (j = 0; j < len; j++) {
          item2 = arguments[j];
          if (item === item2) {
            find = true;
            break;
          }
        }
        if (!find) { // 遍历完 arguments 都没找到
          arr.push(item);
        }
      }

      return arr;
    },
    // 移除 store 里面的相关实例, 目前只有在 dispose 的时候才会用
    removeStore: function () {
      var me = this;
      var len = arguments.length;
      var store = me._store;
      var storeLen = store.length;
      var i, j, item, item2;
      if (len === 0) {
        me._store = []; // 赋值需要用 me._store = [] 而不能 store = []; 操作 store 可以不用 me._store
        return this;
      }
      for (i = 0; i < len; i++) {
        item = arguments[i];
        for (j = 0; j < storeLen; j++) {
          item2 = store[j];
          if (item === item2) {
            store.splice(j, 1);
            j--;
            storeLen--;
            break;
          }
        }
      }

      return this;
    },
    /*
      is(':visible') copied from zepto,
      判断元素是否可见。
      如果 $dom 不存在，也是返回 false
    */
    isVisible: function () {
      var elem = this._$dom;
      return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
    },
    /*
      检查是否是正整数, 字符串正整数也可以通过
      check is a positive interger
    */
    _isPosInteger: function (n) {
      /*
        最外面的要包一层(),
        否则意思就是 数字开头或者0结尾的都匹配了
        即 '2asdfbas' 或 'asdfas0'都匹配了
      */
      var reg = /^(([1-9]\d*)|0)$/;
      var t = $.type(n);
      var flag1 = t === 'number' && n >= 0;
      var flag2 = t === 'string' && reg.test(n);
      return flag1 || flag2;
    },
    /*
      输出错误
    */
    _logError: function (method) {
      console.log("LightboxV2 错误: 调用 " + method + " 方法时找不到target元素");
      return this;
    },
    /* 几秒隐藏, msec 是 millisecond毫秒 */
    hideDelay: function (msec) {
      if (!this.isExitDom()) { // 如果不存在 直接return;
        this._logError("hideDelay");
        return this;
      }
      var argsLen = arguments.length;
      // 若没有传递参数, 默认为 3000
      if (argsLen === 0) {
        msec = 3000;
      }

      var me = this;
      var flag = me._isPosInteger(msec);
      if (!flag) { // 如果 不是整数包括0
        return this;
      }
      var me = this;
      msec = Number(msec); // 有可能是字符串正整数

      // 清空上1次的值, 保证只执行一次
      clearTimeout(me._hideDelayTimeout);
      me.unHookHiding(me._hideDelayFunc);
      /*
        规定执行 hideDelay 时优先级比初始化弹层设置 hideDelayTime 高,
        所以执行 ins.hideDelay() 的时候让 show方法里面的 hideDelay 失效
      */
      me._option.hideDelayTime = -1;

      me._hideDelayTimeout = setTimeout(function () {
        me.hide();
      }, msec);
      me.hookHidingOnce(me._hideDelayFunc);
      return this;
    },
    getMask: function () {
      return this._$mask;
    },
    getDom: function () {
      return this._$dom;
    },
    /* 判断元素是否存在, 并且没有被销毁 */
    isExitDom: function () {
      return this._$dom && this._$dom.length > 0 && !this._isDisposed;
    },
    /*
      获取浏览器的宽度。
      由于PC 上zepto 获取window的宽度和高度没有去掉滚动条，
      所以查看 jquery-1.11.3.js 源码里面获取 window的宽度和高度方法
    */
    _getWinWidth: function () {
      return isHandDevice ? window.innerWidth : $(window).width();
    },
    _getWinHeight: function () {
      return isHandDevice ? window.innerHeight : $(window).height();
    },
    _getDocHeight: function () {
      return $(document).height();
    },
    _getDocWidth: function () {
      return $(document).width();
    },
    /*
      目前主要是用来当 option.position 为 true 时,
      控制当弹窗 show时，绑定resize
      弹窗 hide 时，移除 resize 的绑定
    */
    _createEvent: function () {
      var me = this,
        option = me._option,
        page = me._page,
        $window = page.$window;

      var addEvent = option.addEvent;
      var isFixed = option.isFixed;
      var positionCenter = option.positionCenter;
      var positionMiddle = option.positionMiddle;

      var positionFun = function () {
        if (!me.isVisible()) { // 如果不可见, 则不进行元素居中的定位
          return;
        }
        var winW = me._getWinWidth();
        var winH = me._getWinHeight();
        var diffW = Math.abs(winW - page.winWidth);
        var diffH = Math.abs(winH - page.winHeight);

        if (diffW > 5 || diffH > 5) {
          //me._setDomSize(); // 由于我们弹窗是用 rem 做的宽和高, 当diffW 或 diffH(德州扑克) 改变的时候，会改变 html的font-size
          if (diffW > 5) {
            page.winWidth = winW;
            if (positionCenter) {
              me._positionCenter.call(me);
            }
          }
          if (diffH > 5) {
            page.winHeight = winH;
            if (positionMiddle) {
              me._positionMiddle.call(me);
            }
          }
        }
      }

      var fun = function () {
        throttle(positionFun, 100);
      }

      return {
        bind: function () {
          if (addEvent) {
            if (option.position) { // 是否需要定位
              $window.on('resize', fun);
            }
          }
        },
        unbind: function () {
          if (addEvent) {
            if (option.position) { // 是否需要定位
              $window.off('resize', fun);
            }
          }
        }
      }
    },
    _addEvent: function () {
      var me = this;
      if (!me._eventObj) {
        me._eventObj = me._createEvent();
      }

      return me._eventObj;
    },
    _positionCenter: function () {
      var me = this,
        $dom = me._$dom,
        option = me._option,
        page = me._page;

      var $window = page.$window;
      var isFixed = option.isFixed;
      var domWidth = me._domWidth,
        oParentLeft = me._oParentLeft;

      var winWidth = page.winWidth;
      var left = winWidth - domWidth;

      var overRt,
        winSL,
        docWidth;

      /*
        < 0 有被截断
        scrollLeft 和 _getDocWidth 只有被截断的时候才会请求，性能还好
      */
      if (left < 0) {
        winSL = $window.scrollLeft();
        docWidth = me._getDocWidth();
        overRt = winSL + domWidth - docWidth;
        if (overRt > 0 && domWidth < docWidth) {

        } else {
          left = 0;
        }
      } else {
        left = left / 2;
      }

      // 减去父级的 距离上左的距离
      left -= oParentLeft;

      // 若position 是 absolute, 则得加上滚动条的高度
      if (!isFixed) {
        winSL = winSL || $window.scrollLeft();
        left += winSL;
      }

      $dom.css({
        left: left
      });
    },
    _positionMiddle: function () {
      var me = this,
        $dom = me._$dom,
        option = me._option,
        page = me._page;

      var $window = page.$window;
      var isFixed = option.isFixed;
      var domHeight = me._domHeight,
        oParentTop = me._oParentTop;

      var winHeight = page.winHeight;
      var top = winHeight - domHeight;

      var overBt,
        winST,
        docHeight;

      /*
        < 0 有被截断
        scrollTop 和 _getDocHeight 只有被截断的时候才会请求，性能还好
      */
      if (top < 0) {
        winST = $window.scrollTop();
        docHeight = me._getDocHeight();
        overBt = winST + domHeight - docHeight;
        /*
          top 刚好等于winHeight - domHeight, 不处理
          下面被截断 但是整体高度不大于 docHeight, 否则会看不见上面的
        */
        if (overBt > 0 && domHeight < docHeight) {

        } else { // 下面没有被截断
          top = 0;
        }
      } else {
        top = top / 2;
      }

      // 减去父级的 距离上左的距离
      top -= oParentTop;

      // 若position 是 absolute, 则得加上滚动条的高度
      if (!isFixed) {
        winST = winST || $window.scrollTop();
        top += winST;
      }

      $dom.css({
        top: top
      });
    },
    /* 定位元素 距离窗口上部分和下部分, 只有 show 方法里才会调用 */
    _position: function () {
      var me = this,
        $dom = me._$dom,
        option = me._option,
        page = me._page;
      var position = option.position;
      var positionMiddle = option.positionMiddle;
      var positionCenter = option.positionCenter;

      if (!position) { // 如果不需要定位, 直接return
        return;
      }

      var $window = page.$window;
      /*
        当 isRecaSize 为 true 时，设置isRecaSize false,
        只有当 isRecaSize 又为 true(由于触发了resize事件)，才会进入到if 里面
      */
      if (me._isRecaSize) {
        page.winHeight = me._getWinHeight();
        page.winWidth = me._getWinWidth();

        $dom.show();
        me._setDomSize();
        $dom.hide();

        me._isRecaSize = false;
        $window.one('resize', function () {
          me._isRecaSize = true;
        });
      }

      if (positionMiddle) {
        me._positionMiddle();
      }
      if (positionCenter) {
        me._positionCenter();
      }
    },
    // 上下左右居中
    position: function () {
      if (!this.isExitDom()) {
        this._logError("position");
        return this;
      }
      var me = this;
      // 若元素可见
      if (me.isVisible()) {
        me._setDomSize();
        me._positionMiddle();
        me._positionCenter();
      }
      return this;
    },
    // 上下居中
    positionMiddle: function () {
      if (!this.isExitDom()) {
        this._logError("positionMiddle");
        return this;
      }
      var me = this;
      // 若元素可见
      if (me.isVisible()) {
        me._setDomSize();
        me._positionMiddle();
      }
      return this;
    },
    // 左右居中
    positionCenter: function () {
      if (!this.isExitDom()) {
        this._logError("positionCenter");
        return this;
      }
      var me = this;
      // 若元素可见
      if (me.isVisible()) {
        me._setDomSize();
        me._positionCenter();
      }
      return this;
    },
    // 初始化事件的绑定
    _initEvent: function () {
      var me = this,
        option = me._option,
        $dom = me._$dom,
        $mask = me._$mask;

      var clickMask = option.clickMask;

      if (clickMask) {
        $mask.on('click', function () {
          me.hide();
        });
      }

      /* 循环寻找带有 data-pa-lightbox='close' 的元素, 直到根元素 */
      var findTarget = function ($target, callback) {
        // 如果是关闭按钮，则阻止默认行为，并且用 location.href 跳转
        if ($target.attr('data-pa-lightbox') === 'close') {
          if (typeof callback === 'function') {
            callback();
          }
          return;
        }

        // 已经到父级元素，则直接 return;
        if ($target[0] === $dom[0] || $target.length < 1) {
          return;
        }

        findTarget($target.parent(), callback);
      }

      $dom.on('click', function (e) {
        var $target = $(e.target);
        findTarget($target, function () {
          me.hide();
        });
      });
    },
    // 设置元素的尺寸，和 offsetParent 的 top 和 left
    _setDomSize: function () {
      var me = this,
        option = me._option,
        $dom = me._$dom;
      var isFixed = option.isFixed;
      if (!me.isExitDom() || !me.isVisible()) { // 如果不可见或者不存在 直接return;
        return this;
      }

      //注意zepto.js 版本, height() 相当于 jquery outerHeight(false), 包含border 和 padding,但不包含margin
      me._domHeight = $dom.outerHeight(false);
      me._domWidth = $dom.outerWidth(false);
      /*
        when $dom's position is absolute,
        only can get offsetParent when $dom.show()
      */
      if (!isFixed) {
        ! function () {
          var oParentObj;
          var oParent = $dom.offsetParent();
          /* 当 oParent 为html时，它的 position为 static */
          if (oParent.css('position') === 'static') {
            return;
          }
          oParentObj = oParent.offset();
          me._oParentTop = oParentObj.top;
          me._oParentLeft = oParentObj.left;
        }();
      }
      return this;
    },
    /*
      初始化元素
      1: 元素添加 class
      2: 获得元素宽和高
      3: 获得 offsetParent 的top和left值
    */
    _initDom: function () {
      var me = this,
        $dom = me._$dom,
        $mask = me._$mask,
        page = me._page,
        option = me._option,
        maskShow = option.maskShow,
        maskClass = option.maskClass,
        targetClass = option.targetClass;

      var $body;
      page.$body = $body = $('body');
      page.$document = $(document);
      page.$window = $(window);

      var isFixed = option.isFixed;
      var cssTarget = option.cssTarget;
      var cssMask = option.cssMask;
      var position = option.position;
      var positionCenter = option.positionCenter;
      var positionMiddle = option.positionMiddle;

      $dom.css(cssTarget);
      if (targetClass) {
        $dom.addClass(targetClass);
      }

      /*
        If the dom is not in the document, then append to body,
        as we want to get its height and width.
        放在 $mask 前面，因为它会操作 insertAfter
      */
      if ($dom.parent().length < 1) {
        $dom.appendTo($body);
      }

      /* 就算不需要定位，阴影还是给你的 */
      if (maskShow) {
        $mask.hide()
          .css(cssMask)
          .insertAfter($dom);

        /* 低版本的 zepto, 直接添加null 的class会报错 */
        if (maskClass) {
          $mask.addClass(maskClass);
        }
      }

      // 如果不需要定位 或者 positionCenter 和 positionMiddle 都为 false, 直接return
      if (!position || (!positionCenter && !positionMiddle)) {
        return;
      }

      if (isFixed) {
        $dom.css({
          position: 'fixed'
        });
      } else {
        $dom.css({
          position: 'absolute'
        });
      }
    },
    _setPara: function (para) {
      var typePara = $.type(para);
      if (typePara === 'function') {
        para = {
          callback: para
        }
      } else if (typePara !== 'object') {
        para = {};
      }
      return para;
    },
    show: function (para) {
      if (!this.isExitDom()) {
        this._logError("show");
        // console.log("Can't find the target element from show method");
        return this;
      }
      var me = this;
      /* fire showing */
      me._showing.fire();

      var $dom = me._$dom,
        $mask = me._$mask,
        option = me._option;
      var maskShow = option.maskShow;

      para = me._setPara(para);
      var callback = para.callback;

      zDom += 2;
      zMask += 2;
      var zDomN = zDom;
      var zMaskN = zMask;

      /* 初始化dom元素, 获得宽和高 */
      if (!me._isInit) {
        me._isInit = true;
        me._initDom(); // 获得元素的宽和高
        me._initEvent(); // 初始化事件的绑定
      }

      // _position里有判断 是否需要定位
      me._position();

      // still need to bind, determined by option.addEvent not option.position
      me._addEvent().bind();

      /* fire showingAfter */
      me._showingAfter.fire();

      var ajDone = function () {
          /* fire shown */
          me._shown.fire();
          /*
            hideDelayTime 的取值在ajDone函数里,
            因为假设 ajDone 是延迟执行 setTimeout(ajDone, 0),
            由于 hideDelay() 方法的优先级高于初始化参数的 hideDelayTime,
            hideDelay() 里面会让 option.hideDelayTime 重置为 -1,
            这样 ajDone里就不会执行 hideDelay() 了
          */
          var hideDelayTime = option.hideDelayTime;
          // 如果 option.hideDelayTime 大于等于0
          var flag = me._isPosInteger(hideDelayTime);
          if (flag) {
            me.hideDelay(hideDelayTime);
          }
          if (typeof callback === 'function') {
            callback();
          }
        }
        /* if maskShow from init option is true */
      if (maskShow) {
        $mask.css({
            zIndex: zMaskN
          })
          .show();
      }
      $dom.css({
          zIndex: zDomN
        })
        .show();
      ajDone();

      return this;
    },
    hide: function (para) {
      if (!this.isExitDom()) {
        this._logError("hide");
        //console.log("Can't find the target element from 'hide' method");
        return this;
      }
      var me = this;
      /* fire hiding */
      me._hiding.fire();

      var option = me._option,
        $dom = me._$dom,
        $mask = me._$mask;
      var maskShow = option.maskShow;

      para = me._setPara(para);
      var callback = para.callback;

      /* 判断是否初始化过 */
      if (!me._isInit) {
        me._isInit = true;
        me._initDom(); // 获得元素的宽和高
        me._initEvent(); // 初始化事件的绑定
      }

      // 解除绑定 事件
      me._addEvent().unbind();
      /* fire hidingAfter */
      me._hidingAfter.fire();

      var ajDone = function () {
          /* fire hidden */
          me._hidden.fire();
          if (typeof callback === 'function') {
            callback();
          }
        }
        /* if maskShow from init option is true */
      if (maskShow) {
        $mask.hide();
      }
      $dom.hide();
      ajDone();

      return this;
    },
    dispose: function (para) {
      if (!this.isExitDom()) {
        this._logError("dispose");
        //console.log("Can't find the target element from 'dispose' method");
        return this;
      }
      var me = this;

      para = me._setPara(para);
      var callback = para.callback;

      me._addEvent().unbind();
      me._$mask.remove();
      me._$dom.remove();
      me._isDisposed = true; // 设置标识
      me.removeStore(me); // 移除在 store 里的实例
      me._disposed.fire();
      if (typeof callback === 'function') {
        callback();
      }
      return this;
    },
    _hookFunc: function (o, method, callback) {
      if (!this.isExitDom()) {
        this._logError("hook或unhook");
        //console.log("Can't find the target element from hook method -> " + method);
        return this;
      }

      var func;
      var storeName = 'LightboxV2_bind_this_GM';
      if (typeof callback === 'function' && callback.bind && this[o] && this[o][method]) {
        if (method === 'unsubscribe') {
          func = callback[storeName];
        } else if (method.indexOf('subscribe') > -1) {
          // method 有可能为 subscribe 或 subscribeOnce
          func = callback.bind(this);
          // 由于 bind(this) 以后是一个新的函数, 所以需要存储起来给 unsubscribe
          callback[storeName] = func;
        }
        if (func) {
          this[o][method](func);
        }
      }

      return this;
    },
    hookShown: function (callback) {
      var arr = ['_shown', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookShownOnce: function (callback) {
      var arr = ['_shown', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookShown: function (callback) {
      var arr = ['_shown', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookHidden: function (callback) {
      var arr = ['_hidden', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookHiddenOnce: function (callback) {
      var arr = ['_hidden', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookHidden: function (callback) {
      var arr = ['_hidden', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookShowing: function (callback) {
      var arr = ['_showing', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookShowingOnce: function (callback) {
      var arr = ['_showing', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookShowing: function (callback) {
      var arr = ['_showing', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookShowingAfter: function (callback) {
      var arr = ['_showingAfter', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookShowingAfterOnce: function (callback) {
      var arr = ['_showingAfter', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookShowingAfter: function (callback) {
      var arr = ['_showingAfter', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookHiding: function (callback) {
      var arr = ['_hiding', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookHidingOnce: function (callback) {
      var arr = ['_hiding', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookHiding: function (callback) {
      var arr = ['_hiding', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookHidingAfter: function (callback) {
      var arr = ['_hidingAfter', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    hookHidingAfterOnce: function (callback) {
      var arr = ['_hidingAfter', 'subscribeOnce', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookHidingAfter: function (callback) {
      var arr = ['_hidingAfter', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    },
    hookDisposed: function (callback) {
      var arr = ['_disposed', 'subscribe', callback];
      return this._hookFunc.apply(this, arr);
    },
    unHookDisposed: function (callback) {
      var arr = ['_disposed', 'unsubscribe'];
      if (arguments.length > 0) {
        arr.push(callback);
      }
      return this._hookFunc.apply(this, arr);
    }
  }

  window.PA.ui.LightboxV2 = LightboxV2;
}(this, window.jQuery));
