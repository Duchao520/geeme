// components/App/AppFooter/AppFooter.js
var apiAction = require('../../../utils/apiAction.js')
Component({
  properties: {
    
  },
  data: {
    brandName: null,
    city: null,
    mobile: null,
    province: null,
    tradeId: null,
    tradeName: null,
    username: null,
    industryList: [],
    SHOW_MODAL_SWITCHER: false
  },
  ready(){
    this.getIndustryList();
  },
  methods: {
    getIndustryList(){
      this.$setData({ industryList: wx.$getStorage('industryList')})
    },
    bindValue(e){
      let {key} = e.currentTarget.dataset,
         {value} = e.detail;
      this.data[key] = value;
    },
    changeRegion(e){
      let {value} = e.detail;
      this.$setData({ province: value[0], city : value[1]})
    },
    changeSelector(e){
      let {value} = e.detail,
        { industryList} = this.data;
      let industry = industryList[value];
      this.$setData({
        tradeId: industry.id,
        tradeName: industry.name
      })
    },
    createWebsiteForm(){
      let { brandName, city, mobile, province, tradeId, tradeName, username} = this.data;
      if(!brandName) {wx.showToast({title: '请输入商家名称',icon: 'none'});return;};
      if (!username) { wx.showToast({ title: '请填写您的名字', icon: 'none' }); return; };
      if (!mobile) { wx.showToast({ title: '请填写您的手机号码', icon: 'none' }); return; };
      if (!(province && city)) { wx.showToast({ title: '请选择省市', icon: 'none' }); return; };

      let params = {
        brandName, city, mobile, province, tradeId, tradeName, username, type: 1
      };
      apiAction.createWebsiteForm(params).then(res => {
        if(res.success){
          wx.showToast({
            title: '提交完成'
          })
          this.$setData({ 
            SHOW_MODAL_SWITCHER: false,
            brandName: null,
            city: null,
            mobile: null,
            province: null,
            tradeId: null,
            tradeName: null,
            username: null
          })
        }
      })
    },
    closeModal(){
      this.$setData({
        SHOW_MODAL_SWITCHER: false
      })
    },
    showModal(){
      this.$setData({
        SHOW_MODAL_SWITCHER: true
      })
    }
  }
})
