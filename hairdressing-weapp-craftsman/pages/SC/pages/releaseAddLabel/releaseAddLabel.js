// pages/SC/pages/releaseAddLabel/releaseAddLabel.js
const fetch = require('../../../../utils/fetch.js');
const request = new fetch.request();
const app = getApp();
Page({
  data: {
    // 热门标签
    publicTags: null,
    // 专属标签
    privateTags: null,
    // 从上个页面传来的已选中的标签的id
    selectedTagsId: null,
    // 添加的标签名
    tagName: null,
    value: null
    // 
  },
  onLoad(options) {
    this.data.selectedTagsId = JSON.parse(options.tags)
    this.getHotTags();
    this.getPrivateTagsByStoreId();
  },
  getHotTags() {
    this.$get('/getPlateformHotTags').then(data => {
      let publicTags = data.staffTagList.map(v => {
        v.selected = this.data.selectedTagsId.includes(v.id)
        return v
      });
      this.setData({
        publicTags
      })
    })
  },

  /**
   * 获取员工专属的标签
   */
  getPrivateTagsByStoreId(tagName) {
    this.$get(`/staffDynamicTags/${wx.$getStorage('storeId')}`).then(data => {
      const list = data.staffTagList
      // 检测是否有从上个页面带来的已选中的标签
      if (this.data.selectedTagsId) {
        for (const v of list) {
          v.selected = this.data.selectedTagsId.includes(v.id)
        }
        this.data.selectedTagsId = null
      }
      // 检测原先标签
      if (this.data.privateTags) {
        for (let i = 0; i < list.length; i++) {
          if (this.data.privateTags[i]) {
            continue
            // 若原先没有，则说明新添加的，自动选中
          } else {
            list[i].selected = true
            this.data.privateTags.push(list[i])
          }
        }
      }
      this.setData({
        privateTags: this.data.privateTags ? this.data.privateTags : list
      })
    })
  },

  /**
   * 点击单个标签事件
   */
  clickTagItem(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    this.setSelectedTagByClick(type, index)
  },

  /**
   * 选中或取消标签
   * 传入类型和下标,确定是否选中
   */
  setSelectedTagByClick(type, index) {
    if (type == 'private') {
      this.data.privateTags[index].selected = !this.data.privateTags[index].selected;
      this.setData({
        privateTags: this.data.privateTags
      })
    } else if (type == 'public') {
      this.data.publicTags[index].selected = !this.data.publicTags[index].selected;
      this.setData({
        publicTags: this.data.publicTags
      })
    }
  },

  /**
   * searchInput->双向绑定
   */
  searchInput(e) {
    this.setData({
      tagName: e.detail
    })
  },

  /**
   * 点击添加标签
   */
  createPrivateTag() {
    if (!this.data.tagName) {
      wx.showToast({
        title: '请输入要添加的标签名',
        icon: 'none'
      })
      return;
    }
    const params = {
      name: this.data.tagName,
      storeId: wx.$getStorage('storeId')
    }
    this.$post('/createStaffDynamicTag', params).then(data => {
      if (data.success) {
        this.getPrivateTagsByStoreId(this.data.tagName);
        this.setData({
          tagName: null
        })
      }
    })
  },

  /**
   * 点击完成按钮
   */
  finish() {
    let tags = [...this.data.privateTags, ...this.data.publicTags]
    let idList = [], nameList = []
    tags.map(v => {
      if (v.selected) {
        idList.push(v.id)
        nameList.push(v.name)
      }
    })

    wx.$event.emit('updateTags', { idList, nameList })
    wx.navigateBack({
      delta: 1
    })
  },

})
