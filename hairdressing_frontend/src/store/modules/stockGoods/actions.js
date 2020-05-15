export default {
  // 品牌库存产品
  setBrandProduct: ({ commit }, obj) => {
    commit('SET_BRAND_PRODUCT', obj)
  },
  // 要货单详情
  setProductInvoiceId: ({ commit }, id) => {
    commit('SET_PRODUCT_INVOICE_ID', id)
  }
};