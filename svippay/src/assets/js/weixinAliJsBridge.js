/**
 * 判断打开类型
 * 1支付宝
 * 2微信
 * 3助商通
 */
const getPayType = () => {
    if (navigator.userAgent.indexOf('AlipayClient') > -1) {
        return 1;
    } else if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
        return 2;
    } else if (navigator.userAgent.indexOf('zst-ios-broswer') > -1 || navigator.userAgent.indexOf('zst-android-broswer') > -1) {
        return 3;
    } else {
        // TODO 跳转到错误页
    }
}

export {
    getPayType
}