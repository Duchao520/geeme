export default {
  selectedServiceAndProductListFromOrder(list) {
    return list.map(
      item => {
        return {
          ...item,
          // '哈哈': '1', // for develop
          orderId: item.id,
          id: item.serviceId, //服务的id
          image: item.image,
          memberPrice: item.unitPrice,
          name: item.serviceName,
          num: item.count,
          shopPrice: item.oldPrice,
          specificationName: item.specificationName || "默认",
          specificationTime: item.serverTime,
          specificationId: item.specificationId,
          staffId: item.serverId,
          staffName: item.server,
          paymentStatus: item.paymentStatus,
          goodsType: item.goodsType,
          deleted: false,
          online: item.online,
          assistantOrSalers: (item.assistantOrSalers || []).map(i => {
            return {
              // id: i.staffId || i.sellerStaffId,
              // staffName: i.staffName,
              // ratio: i.ratio
              staffId: i.id || i.staffId,
              staffName: i.staffName || i.name,
              ratio: i.ratio,
              headPortrait: i.headPortrait,
              postId: i.levelId || i.postId,
              postName: i.levelName || i.postName,
              isChosen: i.isChosen, // 是否指定
            }
          }),
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
          remarks: item.note,
          snapshotId: item.snapshotId,
          // 后端调整待结算后数据变了
          // storePreference: item.preferentialInfo.storePreference,
          storePreference: item.storePreference,
          goodsOrderId: item.goodsOrderId
        };
      }
    )
  },
  selectedCardListFromOrder(list) {
    return list.map(
      item => {
        if(item.validUsedNum > 0) {
          item.validNum = item.validNum > 0 ? item.validNum : '使用后' + item.validUsedNum
        }
        return {
          ...item,
          cardSellerList: item.cardSellerList.map(i => {
            return {
              id: i.sellerStaffId,
              staffName: i.staffName,
              postId: i.levelId,
              postName: i.levelName,
              ratio: i.percent
            }
          }),
          paymentStatus: item.paymentStatus,
          cardKindId: item.cardKindId,
          cardKindSnapshotId: item.cardKindSnapshotId,
          chargeMoney: item.chargeMoney,
          giftMoney: item.giftMoney,
          operateType: item.operateType,
          remarks: item.remarks,
          validNum: item.validNum,
          // validUsedNum: item.validUsedNum,
          validUnit: item.validUnit,
          cardType: item.cardType,
          cardName: item.cardName,
          cardCover: item.cardCover,
          deleted: item.deleted,
          validPermanent: item.validPermanent,
          customerCardId: item.customerCardId,
          cardOrderId: item.id,
          extendTime: item.validNum + (item.validUnit === 'year' ? '年' : (item.validUnit === 'month' ? '个月' : '天')),
          // 后端调整待结算后数据变了
          // storePreference: item.preferentialInfo && item.preferentialInfo.storePreference
          storePreference: item.storePreference
        };
      }
    )
  },
  createConsumerOrderFromAppointment(list) {
    // console.log({list});
    return list.map(
      item => {
        return {
          ...item,
          // "呵呵": '2', // for develop
          cardSellerList: [],
          snapshotId: item.snapshotId,
          remarks: item.note,
          online: item.online,
          cardOrderId: item.id,
          image: item.image,
          memberPrice: item.price, //会员价
          name: item.serviceName, //服务名字
          num: item.count, //数量
          shopPrice: item.storePrice, //原价
          specificationName: item.specificationName || "默认", //规格
          specificationTime: item.serverTime, //服务时长
          specificationId: item.specificationId, //规格ID
          staffId: item.serverId || null, //员工id
          staffName: item.serverName || null, //员工名字
          goodsType: item.goodsType,
          deleted: false,
          paymentStatus: item.paymentStatus,
          received: item.received,
          id: item.serviceSnapshotId,
          goodsOrderId: item.goodsOrderId
        }
      }
    )
  }
}
