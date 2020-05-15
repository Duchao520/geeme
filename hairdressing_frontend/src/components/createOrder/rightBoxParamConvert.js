export default {
  chooseUnServicedServices(list) {
    return list.map(item => {
      return {
        ...item,
        image: item.image,
        memberPrice: item.price,
        name: item.serviceName,
        num: item.count,
        goodsType: item.goodsType,
        shopPrice: item.storePrice,
        specificationName: item.specificationName,
        specificationTime: item.serverTime,
        specificationId: item.specificationId,
        staffId: null,
        staffName: null,
        paymentStatus: item.paymentStatus,
        deleted: false,
        goodsOrderId: item.goodsOrderId,
        snapshotId: item.snapshotId,
        id: item.serviceSnapshotId,
      }
    })
  },
  convertGoodParams(list) {
    return list.map(item => {
      return {
        goodsType: item.goodsType,
        goodsOrderId: item.goodsOrderId,
        specificationId: item.specificationId,
        snapshotId: item.snapshotId,
        count: item.num,
        staffId: item.staffId,
        deleted: item.deleted || false,
        id: item.orderId || null,
        storeRemark: item.remarks || null,
        storePreference: item.storePreference || null,
        tempFinalPrice: item.tempFinalPrice,
        assistantOrSalers: item.assistantOrSalers ? 
          item.assistantOrSalers.map(i => {
            return {
              staffId: i.id || i.staffId,
              staffName: i.staffName || i.name,
              ratio: i.ratio,
              headPortrait: i.headPortrait,
              postId: i.levelId || i.postId,
              postName: i.levelName || i.postName,
              isChosen: i.isChosen, // 是否指定
            };
          }) : null,
        stationOne: item.stationOne ? 
          item.stationOne.map(i => {
            return {
              staffId: i.id || i.staffId,
              staffName: i.staffName || i.name,
              ratio: i.ratio,
              headPortrait: i.headPortrait,
              postId: i.levelId || i.postId,
              postName: i.levelName || i.postName,
              isChosen: i.isChosen, // 是否指定
            };
          }) : null,
        stationThree: item.stationThree ? 
          item.stationThree.map(i => {
            return {
              staffId: i.id || i.staffId,
              staffName: i.staffName || i.name,
              ratio: i.ratio,
              headPortrait: i.headPortrait,
              postId: i.levelId || i.postId,
              postName: i.levelName || i.postName,
              isChosen: i.isChosen, // 是否指定
            };
          }) : null,
        sendType: item.sendType || 0, // 产品的发货方式... 国轩的字段， 和清坤的字段 selfPickUp 冲突; :( 
      };
    });
  },
  convertCardsInfo(list, serviceTime, customerId, staffId, shopId, fromCashierList, consumerOrderId) {
    return list.map(item => {
      return {
        ...item,
        // cardKindId: item.cardKindId,
        // cardKindSnapshotId: item.cardKindSnapshotId,
        cardSellerList: item.cardSellerList ?
          item.cardSellerList.map(i => {
            return {
              postId: i.levelId,
              postName: i.levelName,
              percent: i.ratio,
              sellerStaffId: i.id || i.staffId, // 瞎写的 估计是这样
              staffName: i.staffName
            }
          }) : null,
        listServiceCountInfo: item.listServiceCountInfo,      //次卡自由卡专享字段
        countLimit:item.countLimit || item.totalCountLimit,   //次卡自由卡专享字段，为什么有后面这个 || 呢？因为这个人可能选了次卡，却不做任何的操作直接提交（和直接买卡是没有区别的，无语吧。。。）
        storePreference: item.storePreference || 0,
        // chargeMoney: item.chargeMoney,
        consumerOrderId: fromCashierList ?
          consumerOrderId : null,
        customerId: customerId,
        deleted: item.deleted || false,
        // giftMoney: item.giftMoney,
        id: item.cardOrderId || null,
        // operateType: item.operateType,
        // remarks: item.remarks,
        serviceTime: serviceTime + ":00",
        // staffId: item.staffId,
        storeId: shopId,
        preferentialInfo: {
          ...item.preferentialInfo,
          storePreference: item.storePreference || 0, // 取单时的门店优惠可能被编辑
        },
        // validNum: item.validNum,
        // validUnit: item.validUnit,
        // cardType: item.cardType,
        // customerCardId: item.customerCardId,
        // storeRemarkCardNo: item.storeRemarkCardNo,
        // renewalType: item.renewalType,
        // isUpgrade: item.isUpgrade,
        // upgradeCardKindId: item.upgradeCardKindId,
        // upgradeCardKindName: item.upgradeCardKindName,
      };
    });
  }
}
