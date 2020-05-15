// components/OrderComponents/OrderListItem/OrderListItem.js
Component({
  options: {
    multipleSlots: true // 启用多slot支持
  },
  lifetimes: {
    attached() {
      let { orderItem } = this.data;
      if (orderItem.received) {
        orderItem.price = this.AccDiv(orderItem.received, orderItem.amount)
      } else {
        orderItem.price = this.AccDiv(orderItem.unitPrice, orderItem.amount)
      }
      console.log(orderItem)
      this.setData({ orderItem })
    }
  },
  properties: {
    orderItem: {
      type: Object,
      value: null
    }
  },
  data: {

  },
  methods: {
    toOrderDetail() {
      const item = this.data.orderItem
      switch (this.$getCurPageName()) {
        // 退款/售后--产品
        case 'refundList':
          this.$route('/pages/IC/pages/refundDetail/refundDetail', { id: item.id, isProduct: 1 })
          break;
        case 'refundList_service':
          this.$route('/pages/IC/pages/refundDetail/refundDetail', { id: item.id })
          break;
        // 产品
        case 'productOrderList':
          this.$route('/pages/IC/pages/productOrderDetail/productOrderDetail', { orderId: item.id })
          break;
      }
    },
    //除法
    AccDiv(arg1, arg2) {
      arg1 = Number(arg1);
      arg2 = Number(arg2);
      var t1 = 0, t2 = 0, r1, r2;
      try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
      try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      return this.AccMul((r1 / r2), Math.pow(10, t2 - t1));
    },
    //乘法
    AccMul(arg1, arg2) {
      arg1 = Number(arg1); arg2 = Number(arg2)
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try { m += s1.split(".")[1].length } catch (e) { }
      try { m += s2.split(".")[1].length } catch (e) { }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    //加法
    AccAdd(arg1, arg2) {
      arg1 = Number(arg1); arg2 = Number(arg2)
      var r1, r2, m;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
    },
    //减法
    Subtr(arg1, arg2) {
      arg1 = Number(arg1); arg2 = Number(arg2)
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = (r1 >= r2) ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
  }

})