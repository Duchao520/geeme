// canvas画图，并使大小不规则的图片居于box中间
// 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
let util = require('./util.js')
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

function goodsSharePic(ctx, currentPrice, originalPrice, pic1, pic2) {
  let shareGoods = new Array();
  const promise1 = new Promise(resolve => {
    // 下载小程序码图片到本地
    wx.getImageInfo({
      src: util.getImageUrl(pic1),
      success: res => {
        resolve({ img1: res.path })
      },
    })
  });
  const promise2 = new Promise(resolve => {
    // 下载小程序码图片到本地
    wx.getImageInfo({
      src: util.getImageUrl(pic2),
      success: res => {
        resolve({ img2: res.path })
      },
    })
  })
  let shareGoodsPromise = util.PromiseAll([promise1, promise2]).then(res => {
    shareGoods.push(res.img1);
    shareGoods.push(res.img2);
    return shareGoods;
  })
  ctx.width = 750;
  ctx.height = 400;
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, 750, 400);

  //写价格
  ctx.setFontSize(20);
  ctx.setFillStyle("#F52D56");
  ctx.setGlobalAlpha(1);
  ctx.fillText('¥' + currentPrice, 0, 24);
  let currentPriceWidth = ctx.measureText('¥' + currentPrice).width;


  ctx.setFillStyle("#CCCCCC");
  ctx.fillText('¥' + originalPrice, 12 + currentPriceWidth + 12, 24);
  let originalPriceWidth = ctx.measureText('¥' + originalPrice).width;

  ctx.setStrokeStyle("#CCCCCC");
  ctx.moveTo(12 + currentPriceWidth + 12, 18);
  ctx.lineTo(12 + currentPriceWidth + 12 + originalPriceWidth + 4, 18);
  ctx.stroke();

  let rate = 0.5;
  let xy = [
    { x: 0, y: (68) * rate },
    { x: (280) * rate, y: (68) * rate }
  ]
  return new Promise(resolve => {
    shareGoodsPromise.then(res => {
      res.forEach((e, idx) => {
        ctx.beginPath();
        ctx.save();
        let width = 240 * rate
        let radius = 8 * rate
        let angleLine = 10 * rate
        // { x: (30+30)*rate,y: (246+30)*rate },
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#E9E9E9')
        ctx.moveTo(xy[idx].x + angleLine, xy[idx].y);           // 创建开始点
        ctx.lineTo(xy[idx].x + angleLine + width, xy[idx].y);          // 创建水平线
        ctx.arcTo(xy[idx].x + angleLine * 2 + width, xy[idx].y, xy[idx].x + angleLine * 2 + width, xy[idx].y + angleLine, radius); // 创建弧
        ctx.lineTo(xy[idx].x + angleLine + width + angleLine, xy[idx].y + angleLine + width);         // 创建垂直线
        ctx.arcTo(xy[idx].x + angleLine * 2 + width, xy[idx].y + angleLine * 2 + width, xy[idx].x + angleLine + width, xy[idx].y + angleLine * 2 + width, radius); // 创建弧
        ctx.lineTo(xy[idx].x + angleLine, xy[idx].y + angleLine * 2 + width);         // 创建水平线
        ctx.arcTo(xy[idx].x, xy[idx].y + angleLine * 2 + width, xy[idx].x, xy[idx].y + angleLine + width, radius); // 创建弧
        ctx.lineTo(xy[idx].x, xy[idx].y + angleLine);         // 创建垂直线
        ctx.arcTo(xy[idx].x, xy[idx].y, xy[idx].x + angleLine, xy[idx].y, radius); // 创建弧
        ctx.stroke(); // 这个具体干什么用的？
        ctx.clip();
        ctx.drawImage(e, xy[idx].x, xy[idx].y, 270 * rate, 270 * rate);
        ctx.restore();
      })
      ctx.draw(true, () => {
        wx.canvasToTempFilePath({
          width: 750,
          height: 400,
          destWidth: 750,
          destHeight: 400,
          canvasId: ctx.canvasId,
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      });
    })
  })
};

function cardSharePic(ctx, price, name , logo, bg){
  let shareGoods = new Array();
  const promise1 = new Promise(resolve => {
    // 下载小程序码图片到本地
    wx.getImageInfo({
      src: util.getImageUrl(logo + '?x-oss-process=image/resize,m_lfit,h_82,w_82'),
      success: res => {
        resolve({ img1: res.path })
      },
    })
  });
  const promise2 = new Promise(resolve => {
    // 下载小程序码图片到本地
    wx.getImageInfo({
      src: util.getImageUrl(bg + '?x-oss-process=image/resize,m_fill,h_400,w_630'),
      success: res => {
        resolve({ img2: res.path })
      },
    })
  })
  let shareGoodsPromise = util.PromiseAll([promise1, promise2]).then(res => {
    shareGoods.push(res.img1);
    shareGoods.push(res.img2);
    return shareGoods;
  });

  ctx.width = 375;
  ctx.height = 300;
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, 375, 300);

  //写价格
  ctx.setFontSize(20);
  ctx.setFillStyle("#F52D56");
  ctx.setGlobalAlpha(1);
  ctx.fillText('¥' + price, 24, 20);

  return new Promise(resolve => {
    shareGoodsPromise.then(res => {
      let logoImg = res[0],bgImg = res[1];
      //画背景
      ctx.drawImage(bgImg , 24 , 36 , 327 , 207);

      //画logo
      ctx.save();
      ctx.beginPath();
      ctx.arc(68, 80, 20, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(logoImg,48,60,40,40);
      ctx.restore();

      //写名字
      ctx.setFillStyle("#FFFFFF");
      ctx.setFontSize(18);
      ctx.fillText(name,100 , 90);

      //写价格
      ctx.setFontSize(20);
      ctx.fillText('¥' + price,260,220)

      ctx.draw(true, () => {
        wx.canvasToTempFilePath({
          width: 375,
          height: 300,
          destWidth: 375,
          destHeight: 300,
          canvasId: ctx.canvasId,
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      });
    })
  })
}

function serverSharePic(ctx,score,appointment,production,avatarUrl){
  const avatarPromise = new Promise(resolve => {
    // 下载图片到本地
    wx.getImageInfo({
      src: util.getImageUrl(avatarUrl + '?x-oss-process=image/resize,m_fill,h_300,w_300'),
      success: res => {
        resolve({ img1: res.path })
      },
    })
  });

  ctx.width = 375;
  ctx.height = 320;
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, 375, 320);

  drawStar(ctx,score,15,12,4,12);

  ctx.setFontSize(16);
  ctx.setFillStyle("#cccccc");
  ctx.fillText(appointment + " 次预约",110,26);
  ctx.fillText(production + " 作品", 210, 26);

  return new Promise(resolve => {
    avatarPromise.then(res => {
      let avaImg = res.img1;
      ctx.drawImage(avaImg, 76, 50, 223, 223);
      ctx.draw(true, () => {
        wx.canvasToTempFilePath({
          width: 375,
          height: 320,
          destWidth: 375,
          destHeight: 300,
          canvasId: ctx.canvasId,
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      });
    })
  })
}

/** 
 * 画星星评分
 * @param score  评分
 * @param STAR_WIDTH 星星宽度(等同高度)
 * @param X_BASE  起始x坐标
 * @param SPACE  星星间隙
 * @param Y 间隙
 */
function drawStar(ctx, score = 5, STAR_WIDTH = 9 , X_BASE = 12, SPACE = 4, Y = 12) {

  // 填充灰色背景
  ctx.setFillStyle('#dad9e2')
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(X_BASE + STAR_WIDTH * i + SPACE * i, Y, STAR_WIDTH, STAR_WIDTH)
  }

  // 根据员工平均分填充红色背景
  ctx.setFillStyle('#f52d56')
  for (let i = 0; i < score; i++) {
    if (score - i >= 1) {
      ctx.fillRect(X_BASE + STAR_WIDTH * i + SPACE * i, Y, STAR_WIDTH, STAR_WIDTH)
    } else {
      ctx.fillRect(X_BASE + STAR_WIDTH * i + SPACE * i, Y, STAR_WIDTH * (score - i), STAR_WIDTH)
    }
  }

  for (let i = 0; i < 5; i++) {
    ctx.drawImage('star.png', X_BASE + STAR_WIDTH * i + SPACE * i, Y, STAR_WIDTH, STAR_WIDTH)
  }
}



module.exports = {
  drawCoverImg,
  drawRoundRect,
  goodsSharePic,
  cardSharePic,
  serverSharePic
}