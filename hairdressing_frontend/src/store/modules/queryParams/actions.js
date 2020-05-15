export default {
    beautyRecordId: ({ commit }, param) => {
        commit('BEAUTY_RECORD_ID', param)
    },
    productEditId: ({ commit }, param) => {
        commit('PRODUCT_EDIT_ID', param)
    },
    productTemplateId: ({ commit }, param) => {
        commit('PRODUCT_TEMPLATE_ID', param)
    },
    serviceId: ({ commit }, param) => {
        commit('SERVICE_ID', param)
    },
    serviceTemplateId: ({ commit }, param) => {
        commit('SERVICE_TEMPLATE_ID', param)
    },
    saveCommodityBrandId: ({ commit }, param) => {
        commit('SAVE_COMMODITY_BRAND_ID', param)
    }
};
