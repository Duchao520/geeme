export default {
    BEAUTY_RECORD_ID(state, payload) {
        state.beautyRecordId = payload;
    },
    PRODUCT_EDIT_ID(state, payload) {
        state.productEditId = payload
    },
    PRODUCT_TEMPLATE_ID(state, payload) {
        state.productTemplateId = payload
    },
    SERVICE_ID(state, payload) {
        state.serviceId = payload
    },
    SERVICE_TEMPLATE_ID(state, payload) {
        state.serviceTemplateId = payload
    },
    SAVE_COMMODITY_BRAND_ID(state, payload) {
        state.commodityBrandId = payload
    }
};
