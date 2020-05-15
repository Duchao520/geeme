// pages/IC/pages/productcate/productcate.js
var apiAction = null;
Page({
  $name:'productcate',
  data: {
    // 一级分类列表
    list1: [],
    // 推荐
    recommend: {
      id: -1,
      classTwo: [],
      sortName: '推荐'
    },
    // 当前选中一级分类
    currentClass1: null,
  },
  computed: {
    // 二级分类列表
    list2() {
      if (this.data.currentClass1) {
        return this.data.currentClass1.classTwo
      } else {
        return this.data.recommend.classTwo
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.fetch()
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  fetch() {
    apiAction.getStoreWholeGoodsClass().then(data => {
      const list1 = data.serviceClassInfo.concat(data.productClassInfo)
      if (data.recommandClassInfo.length) {
        this.data.recommend.classTwo = data.recommandClassInfo
        list1.unshift(this.data.recommend)
      }
      this.$setData({
        list1,
        currentClass1: list1[0] || null
      })
    })
  },
  // 点击一级分类
  setCurrentClass1(e) {
    this.$setData({
      currentClass1: e.currentTarget.dataset.class1
    })
  },
  // 跳转全部商品对应分类
  jumpClass(e) {
    // const parentId = e.currentTarget.dataset.parent
    // for(const v of this.data.list1){
    //   if(v.id == parentId){
    //     const page = v.goodsTypeScope === 'service' ? '/pages/IC/pages/productcatedetails/productcatedetails' : '/pages/IC/pages/goodProduct/goodProduct'
    //     this.$route(page, {classId:v.id, className:v.sortName})
    //     return 
    //   }
    // }
    const {id, type, name} = e.currentTarget.dataset
    const page = type === 'service' ? '/pages/IC/pages/productcatedetails/productcatedetails' : '/pages/IC/pages/goodProduct/goodProduct'
    this.$route(page, {
      classId: id,
      className: name
    })
    return
  },
})