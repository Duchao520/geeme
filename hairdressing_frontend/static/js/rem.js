/**
 * 根据屏幕大小改变根元素字体大小
 * 设计图为1920X1080
 */
(function(doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if (clientWidth >= 1920) {
              docEl.style.fontSize = '100px';
          } else if(clientWidth < 1280) {
            docEl.style.fontSize = '66.6667px';
          } else {
              docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
          }
      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
