// pages/UIC/pages/userWorkSet/userWorkSet.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    
  },

  chooseImage(e) {
    const type = e.currentTarget.dataset.type
    wx.chooseImage({
      count: 1,
      sourceType:type,
      success: (res) => {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          fetch.uploadFile(res.tempFilePaths[i]).then(uploadFileRes => {
            fetch.updateMyWorksCover(uploadFileRes).then(data => {
              if (data.success) {
                wx.$event.emit('updateCoverImage', uploadFileRes)
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
            })
            
          })
        }
      }
    })
  },
})