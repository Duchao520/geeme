// components/App/AppSearch/AppSearch.js
Component({
  lifetimes: {
    ready() {
      if (this.data.value) {
        this.setData({
          inputStr: this.data.value,
          ifShowClear: true
        })
      }
    }
  },
  properties: {
    placeholder: String,
    // 搜索框左边选择搜索类型
    selectTypes: Array,
    selectType: String,
    // 是否禁用
    disabled: Boolean,
    // 'ROUND':圆角，'SQUARE':方角
    border: {
      type: String,
      value: "ROUND"
    },
    // 隐藏“搜索”
    hideText: {
      type: Boolean,
      value: false
    },
    // 是否显示购物车按钮
    showCart: {
      type: Boolean,
      value: false
    },
    // 搜索框的初始值
    value: String,
    // 是否聚焦
    focus:Boolean,
  },
  data: {
    inputStr: '',
    // 显示清除按钮
    ifShowClear: false,
    // 节流用
    timer: null
  },
  observers: {
    'value'(n) {
      const ifShowClear = n.length ? true : false
      this.setData({
        inputStr: n,
        ifShowClear
      })
    },
  },
  methods: {
    clickType(e) {
      this.triggerEvent('clicktype', e)
    },
    clickInput(e) {
      if (this.data.disabled) {
        this.triggerEvent('clickinput', e)
      }
    },
    search(){
      this.triggerEvent('searchEvent', { value: this.data.inputStr });
    },
    input(e) {
      this.data.inputStr = e.detail.value
      const ifShowClear = e.detail.value.length ? true : false
      this.setData({
        ifShowClear
      })

      // 节流
      if (this.data.timer) return

      this.data.timer = setTimeout(() => {
        this.data.timer = null
      }, 100)
      this.triggerEvent('input', this.data.inputStr)
    },
    confirm(e) {
      this.triggerEvent('confirm', this.data.inputStr)
    },
    clear() {
      this.setData({
        inputStr: '',
        ifShowClear: false,
      })
      this.triggerEvent('input', this.data.inputStr)
      this.search();
    },
    toCart() {
      this.$route('/pages/TC/pages/cart/cart')
    }
  }
})