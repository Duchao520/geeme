// components/App/AppSlidelip/AppSlidelip.js
var apiAction = require('../../../utils/apiAction.js');
Component({
  lifetimes: {
    attached() {
      this.data.list.map(item => {
        item.x = 0;
      })
      this.setData({
        list: this.data.list
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    selected: {
      type: String,
      value: ""
    },
    brandId: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startX: '',
    startY: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 开始滑动
    touchMoveStartHandle(e) {
      // 我们要记录滑动开始的坐标点，后面计算要用到
      if (e.touches.length == 1) {
        this.setData({
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY
        });
      }
    },
    // 滑动事件处理,一次只能滑出一个删除按钮 为了防止滑动出现抖动，我们用滑动结束事件
    touchMoveEndHandle: function (e) {
      // console.log(2)
      var currentIndex = e.currentTarget.dataset.index, //当前索引
        startX = this.data.startX, //开始X坐标
        startY = this.data.startY, //开始Y坐标
        touchMoveEndX = e.changedTouches[0].clientX, //滑动变化X坐标
        touchMoveEndY = e.changedTouches[0].clientY, //滑动变化Y坐标
        //获取滑动角度
        angle = this.angle({
          X: startX,
          Y: startY
        }, {
            X: touchMoveEndX,
            Y: touchMoveEndY
          });
      //滑动超过50度角 return，防止上下滑动触发

      if (Math.abs(angle) > 50) return;
      this.data.list.map((item, index) => {
        if (touchMoveEndX > startX) {
          // 右滑
          if(touchMoveEndX - startX > 30){
            item.x = 0;
          }else{
            item.x = -120
          }
          if (index != currentIndex) item.x = 0;
        } else {
          // 左滑
          if (touchMoveEndX - startX < -30) {
            item.x = -120;
          } else {
            item.x = 0
          }
          if (index != currentIndex) item.x = 0;
        }
      })
      this.setData({
        list: this.data.list
      })
    },
    /**
     * 计算滑动角度
     * start 起点坐标
     * end 终点坐标
     * Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
     */
    angle: function (start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    chooseItem(e){
      const {id} = e.currentTarget.dataset;
      this.triggerEvent('getItem',{id});
    },
    //修改商品数量
    changeAmount(e){
      let {index} = e.currentTarget.dataset,
          count = e.detail,
          {list,brandId} = this.data,
          goods = list[index];
      let params = {
        brandId: Number(brandId),
        goodsTypeScope: goods.goodsTypeScope,
        number: 1,
        operationType: goods.number > count ? 'subtract' : 'add',
        specificationId: goods.id
      }
      apiAction.shoppingCartChange(params).then(res => {
        if(res.success){
          list[index].number = count;
          this.setData({
            list
          });
          this.triggerEvent('setList',{list})
        }
      })
    },
    deleteGoods(e){
      let { index } = e.currentTarget.dataset;
      console.log(index)
      this.triggerEvent('deleteGoods', { index });
    },
    toProductDetail(e) {
      let productId = e.currentTarget.dataset.id;
      const { id, type } = e.currentTarget.dataset
      const params = {
        productId: id
      }
      if (type == 'product') params.isProduct = 1
      this.$route('/pages/IC/pages/productdetails/productdetails', params)
    }
  }
})
