// pages/UIC/pages/skills/skills.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    list: null,
  },
  onLoad(options) {
    this.fetch()
  },
  fetch() {
    fetch.getStaffSkill().then(data => {
      this.$setData({
        list: data.staffSkillInStores
      })
    })
  },
  setSkill(e) {
    const {
      id,
      storeindex
    } = e.currentTarget.dataset
    const skillIds = this.data.list[storeindex].staffSkillAndStroeInfo.skillIds || []

    let hasSkill = false
    for (let i = 0; i < skillIds.length; i++) {
      if (skillIds[i] === id) {
        skillIds.splice(i, 1)
        hasSkill = true
        break;
      }
    }
    if (!hasSkill) {
      skillIds.push(id)
    }

    let attr = `list[${storeindex}].staffSkillAndStroeInfo.skillIds`
    this.$setData({
      [attr]: skillIds
    })
  },
  confirm() {
    const staffSkillList = []
    let skillNum = 0
    let skillIds
    for (const v of this.data.list) {
      skillIds = v.staffSkillAndStroeInfo.skillIds
      if (!(skillIds && skillIds.length)) {
        staffSkillList.push({
          skills: [],
          staffId: v.staffSkillAndStroeInfo.staffId,
        })
      } else {
        outer: 
        for (let i = 0; i < skillIds.length; i++) {
          for (const skill of v.skillInStore.skills) {
            if (skill.id == skillIds[i]) {
              continue outer
            }
          }
          skillIds.splice(i--, 1)
        }
        skillNum += skillIds.length
        staffSkillList.push({
          skills: skillIds,
          staffId: v.staffSkillAndStroeInfo.staffId
        })
      }
    }
    fetch.updateStaffSkill({
      staffSkillList
    }).then(data => {
      if (data.success) {
        wx.$event.emit('updateSkillNum', skillNum)
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
})