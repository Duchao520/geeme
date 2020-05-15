export default {
  // 品牌库存产品
  SET_BRAND_PRODUCT(state, obj) {
    for (let key in obj) {
      state.brandProduct[key] = obj[key]
    }
  },
  SET_PRODUCT_INVOICE_ID(state, id) {
    state.productInvoiceId = id
  }
};