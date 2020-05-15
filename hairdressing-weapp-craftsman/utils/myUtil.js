// canvas画图，并使大小不规则的图片居于box中间
// 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
function drawCoverImg(box_w, box_h, source_w, source_h) {
  const _ratio = box_w / box_h
  let scale, sx, sy, sWidth, sHeight
  // 确定缩放比例
  if (source_w / source_h > _ratio) {
    scale = box_h / source_h
  } else {
    scale = box_w / source_w
  }

  if (source_w > box_w || source_w * scale > box_w) {
    sWidth = box_w / scale
    sx = (source_w - sWidth) / 2
  } else {
    sx = 0
    sWidth = source_w
  }

  if (source_h > box_h || source_h * scale > box_h) {
    sHeight = box_h / scale
    sy = (source_h - sHeight) / 2
  } else {
    sy = 0
    sHeight = source_h
  }
  return {
    sx,
    sy,
    sWidth,
    sHeight
  }
}

/** 
 * canvas画圆角矩形
 * @param x:左上角x坐标
 * @param y:左上角y坐标
 * @param w:矩形宽度
 * @param h:矩形高度
 * @param r:radius
 * @param ctx:canvas 的绘图上下文 CanvasContext 对象
 */
function drawRoundRect(x, y, w, h, r, ctx) {
  // o1, o2, o3, o4分别为左上、右上、右下、左下的圆点
  const o1 = {
    x: x + r,
    y: y + r
  }
  const o2 = {
    x: x + w - r,
    y: y + r
  }
  const o3 = {
    x: x + w - r,
    y: y + h - r
  }
  const o4 = {
    x: x + r,
    y: y + h - r
  }
  ctx.beginPath()
  ctx.arc(o1.x, o1.y, r, Math.PI, Math.PI * 3 / 2)
  ctx.lineTo(o2.x, o2.y - r)
  ctx.arc(o2.x, o2.y, r, Math.PI * 3 / 2, Math.PI * 2)
  ctx.lineTo(o3.x + r, o3.y)
  ctx.arc(o3.x, o3.y, r, 0, Math.PI / 2)
  ctx.lineTo(o4.x, o4.y + r)
  ctx.arc(o4.x, o4.y, r, Math.PI / 2, Math.PI)
  ctx.closePath()
}

/**
 * @description 替换键名
 * @param {Object} obj 源对象
 * @param {String} oldKey 初始键名
 * @param {String} newKey 新键名
 * @return {Object} 替换键名后的新对象
 */
function replaceKey(obj, oldKey, newKey) {
  var reg = new RegExp(/"\w+?":/, 'g')

  function fn(match) {
    if (match.slice(1, -2) === oldKey) {
      return `"${newKey}":`
    } else {
      return match
    }
  }

  return JSON.parse(JSON.stringify(obj).replace(reg, fn))
}

/**
 * @description 批量替换键名
 * @param {Object} obj 源对象
 * @param {Object} map {oldKey1:newKey1, oldKey2, newKey2}形式的对象
 * @return {Object} obj 新对象
 */
function replaceKeys(obj, map) {
  for (var k in map) {
    obj = replaceKey(obj, k, map[k])
  }
  return obj
}

module.exports = {
  drawCoverImg,
  drawRoundRect,
  replaceKey,
  replaceKeys,
}