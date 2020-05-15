/**
 * 权限按钮对照数据, 不能重复!
 **/
const data = {
  // ======== 门店 ========
  '门店-操作台-快捷操作-快速开单': 'shop_console_quickOperate_newOrder',
  '门店-操作台-快捷操作-取单结算': 'shop_console_quickOperate_getOrder',
  '门店-操作台-快捷操作-新增预约': 'shop_console_quickOperate_newAppointment',
  '门店-操作台-快捷操作-新增客户': 'shop_console_quickOperate_newCustomer',
  '门店-操作台-快捷操作-快速开卡': 'shop_console_quickOperate_newCard',
  '门店-操作台-快捷操作-充值续费': 'shop_console_quickOperate_recharge',

  '门店-操作台-待办事项-预约待确认': 'shop_console_todo_appointment',
  '门店-操作台-待办事项-产品待发货': 'shop_console_todo_product',
  '门店-操作台-待办事项-评价待回复': 'shop_console_todo_appraise',
  '门店-操作台-待办事项-退款待处理': 'shop_console_todo_refund',
  '门店-操作台-待办事项-售后待处理': 'shop_console_todo_afterSale',

  // - v1 移除
  '门店-订单管理-收款台-快速开单': 'shop_order_quickAddBill',
  '门店-订单管理-收款台-删除订单': 'shop_order_deleteOrder',
  '门店-订单管理-收款台-取单': 'shop_order_getBill',
  '门店-订单管理-收款台-订单详情': 'shop_order_billDetails',

  //  - v2 收款台独立一级导航
  '门店-订单管理-收款台-快速开单': 'shop_cashier_quickAddBill',
  '门店-订单管理-收款台-删除订单': 'shop_cashier_deleteOrder',
  '门店-订单管理-收款台-取单': 'shop_cashier_getBill',
  '门店-订单管理-收款台-订单详情': 'shop_cashier_billDetails',

  '门店-订单管理-服务订单-备注': 'shop_order_service_notes',
  '门店-订单管理-服务订单-邀请评价': 'shop_order_service_inviteNotes',
  '门店-订单管理-服务订单-查看评价': 'shop_order_service_evaluateDetails',
  '门店-订单管理-服务订单-订单详情': 'shop_order_service_orderDetails',
  '门店-订单管理-服务订单-删除订单': 'shop_order_service_delBill',
  '门店-订单管理-服务订单-同意退款': 'shop_order_service_agreeRefund',
  '门店-订单管理-服务订单-拒绝退款': 'shop_order_service_rejectRefund',
  '门店-订单管理-服务订单-撤回拒绝退款': 'shop_order_service_repealRejectRefund',

  '门店-订单管理-产品订单-备注': 'shop_order_product_notes',
  '门店-订单管理-产品订单-邀请评价': 'shop_order_product_inviteNotes',
  '门店-订单管理-产品订单-查看评价': 'shop_order_product_evaluateDetails',
  '门店-订单管理-产品订单-订单详情': 'shop_order_product_orderDetails',
  '门店-订单管理-产品订单-删除订单': 'shop_order_product_delBill',
  '门店-订单管理-产品订单-同意退款': 'shop_order_product_agreeRefund',
  '门店-订单管理-产品订单-拒绝退款': 'shop_order_product_rejectRefund',
  '门店-订单管理-产品订单-撤回拒绝退款': 'shop_order_product_repealRejectRefund',
  '门店-订单管理-产品订单-售后处理': 'shop_order_product_afterSale',
  '门店-订单管理-产品订单-发货': 'shop_order_product_deliver-goods', //new

  '门店-订单管理-卡项订单-备注': 'shop_order_card_notes',
  '门店-订单管理-卡项订单-订单详情': 'shop_order_card_orderDetails',

  '门店-客户中心-客户列表-开单': 'shop_customer_addBill',
  '门店-客户中心-客户列表-打标签': 'shop_customer_mark', // 全选同
  '门店-客户中心-客户列表-更改服务者': 'shop_customer_changeServer',
  '门店-客户中心-客户列表-新增客户': 'shop_customer_addCustomer',
  '门店-客户档案-基本资料-保存': 'shop_customer_customerRecord_base_save',  // 备注同

  '门店-员工中心-员工列表-启用/禁用': 'shop_staff_staffStatus',
  '门店-员工档案-基本资料-保存': 'shop_staff_staffRecord_base_save',
  '门店-员工档案-服务档案-编辑': 'shop_staff_staffRecord_archives_edit',
  '门店-员工档案-作品动态-删除': 'shop_staff_staffRecord_dynamic_delete',
  '门店-员工档案-服务评价-回复': 'shop_staff_staffRecord_rate_reply',

  '门店-商品管理-服务管理-操作按钮': 'shop_goods_service_tableButtons',  // 表格区域所有的操作含全选
  '门店-商品管理-产品管理-操作按钮': 'shop_goods_product_tableButtons',  // 表格区域所有的操作含全选

  '门店-店铺管理-网店设置-保存': 'shop_store_save',

  '门店-设置中心-预约设置-快捷设置-保存': 'shop_appoint_quick_save',
  '门店-设置中心-预约设置-排班设置-编辑': 'shop_appoint_schedule_edit',
  '门店-设置中心-提成设置-基础设置-保存': 'shop_commission_base_save',
  '门店-设置中心-提成设置-员工提成配置-编辑': 'shop_commission_staff_edit',

  // ======== 品牌 ========
  '品牌-员工中心-员工列表-启用/禁用': 'brand_staff_staffStatus',
  '品牌-员工档案-基本资料-保存': 'brand_staff_staffRecord_base_save',
  '品牌-员工档案-服务档案-编辑': 'brand_staff_staffRecord_archives_edit',
  '品牌-员工档案-作品动态-删除': 'brand_staff_staffRecord_dynamic_delete',
  '品牌-员工档案-服务评价-回复': 'brand_staff_staffRecord_rate_reply',

  '品牌-商品管理-卡项管理-操作按钮': 'brand_goods_card_tableButtons',  // 表格区域所有的操作含全选

  '品牌-营销中心-营销应用-红包-启用/禁用': 'brand_market_redpacket_useingStatus',
  // 派发红包 待补充
  '品牌-营销中心-营销应用-红包详情-回收': 'brand_market_redpacket_recycle',
  '品牌-营销中心-营销应用-红包详情-恢复': 'brand_market_redpacket_renew',

  // 品牌库存相关 2020年4月22日 新增
  // 1.1 库存产品
  '品牌-库存产品-导出excel': 'brand_stock_product_export', // new
  '品牌-库存产品-产品上下架': 'brand_stock_product_upDown', // new
  '品牌-库存产品-产品删除': 'brand_stock_product_delete', // new
  // 1.2 库存明细
  '品牌-库存明细-导出excel': 'brand_stock_list_export', // new
  // 1.3 入库管理
  '品牌-入库管理-审核': 'brand_stock_in_audit', // new
  '品牌-入库管理-删除': 'brand_stock_in_delete', // new
  '品牌-入库管理-导出excel': 'brand_stock_in_export', // new
  '品牌-入库管理-创建入库单': 'brand_stock_in_create', // new
  // 1.4 出库管理
  '品牌-出库管理-审核': 'brand_stock_out_audit', // new
  '品牌-出库管理-删除': 'brand_stock_out_delete', // new
  '品牌-出库管理-导出excel': 'brand_stock_out_export', // new
  '品牌-出库管理-创建出库单': 'brand_stock_out_create', // new
  // 1.5 门店订货
  '品牌-门店订货-详情': 'brand_stock_require_detail', // new // 这里不要了 其实是路由
  '品牌-门店订货-导出excel': 'brand_stock_require_export', // new
  // 1.6 订货详情
  '门店-门店订货-详情-订单确认': 'shop_stock_require_detail-check', // new (门店) !!!
  '门店-门店订货-详情-订单取消': 'shop_stock_require_detail-delete', // new (门店) !!!
  // 创建入库单 门店
  // 审核入库单 门店
  // 确认收货 门店

  '品牌-门店订货-详情-订单审核': 'brand_stock_require_detail-audit', // new (品牌)
  '品牌-门店订货-详情-订单作废': 'brand_stock_require_detail-delete', // new (品牌)
  '品牌-门店订货-详情-财务审核': 'brand_stock_require_detail-financial', // new (品牌)
  // 创建出库单 品牌 - 沿用出库管理页面
  // 审核出库单 品牌 （备货） - 沿用出库管理页面
  '品牌-门店订货-详情-物流发货': 'brand_stock_require_detail-sendGoods', // new (品牌)

  // 1.7 统计报表
  '品牌-统计报表-出入库明细': 'brand_stock_statistics_stockIO', // new (品牌)
  '品牌-统计报表-产品收发汇总': 'brand_stock_statistics_productRS', // new (品牌)
  '品牌-统计报表-订单统计报表': 'brand_stock_statistics_requireOrder', // new (品牌)
  '品牌-统计报表-商品销售报表': 'brand_stock_statistics_goodsSell', // new (品牌)
  '品牌-统计报表-门店订货报表': 'brand_stock_statistics_storeRequireOrder', // new (品牌)
  '品牌-统计报表-订单商品统计': 'brand_stock_statistics_orderGoods', // new (品牌)
}

const center = {
  // 我的品牌
  '品牌认证': 'brand_center_authorize',
  '品牌管理': 'brand_center_manage',
  '品牌编辑': 'brand_center_edit',
  '品牌删除': 'brand_center_delete',
  '品牌-创建门店': 'brand_center_create_shop',

  '门店指定店长': 'store_center_assign',
  '门店管理': 'store_center_manage',
  '门店编辑': 'store_center_edit',
  '门店删除': 'store_center_delete',
}
// [{"name": "快捷操作","status": false,"flag": "66_1","frontFlag": "shop_console_quick_operate"},]
