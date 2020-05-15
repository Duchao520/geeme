/**
 * 本文件用来记录接口，需要按类列出
 */
var Host = SERVICE_URL
var wsHost = WEBSERVICE_URL
    // 注册部分接口
    // 注册/找回密码获取手机验证码
export const getPhoneCode = {
        URL: Host + '/service-api/registerVerificationCode'
    }
    // 用户注册按钮调用
export const onRegister = {
    URL: Host + '/service-api/register'
}

// 登录部分接口
// 用户登录按钮调用
export const onLogin = {
    URL: Host + '/service-api/pc/login',
    fail_401: '用户名或密码错误'
}

// 用户退出按钮调用
export const logout = {
    URL: Host + '/service-api/logout'
}

// 找回密码部分接口
// 用户找回密码调用
export const onRetrieve = {
        URL: Host + '/service-api/retrievePassword'
    }
    // 用户找回密码发送验证码
export const retrieveVerificationCode = {
    URL: Host + '/service-api/retrieveVerificationCode'
}

// 个人中心部分接口
// 获取用户信息调用
export const getUserInfo = {
        URL: Host + '/service-api/userInfo'
    }
    // 更新用户信息
export const updateUserInfo = {
        URL: Host + '/service-api/updateUserInfo'
    }
    // 修改密码
export const updatePassword = {
    URL: Host + '/service-api/updatePassword'
}

// 客户管理部分接口
// 新增客户
export const addCustomer = {
        URL: Host + '/service-api/addCustomer'
    }
    // 新增预约时的临时客户
export const addCustomerForAppointment = {
        URL: Host + '/service-api/addCustomerForAppointment'
    }
    // 新增预约占用
export const addAppointmentOccupation = {
        URL: Host + '/service-api/addAppointmentOccupation'
    }
    // 取消预约
export const cancelAppoint = {
        URL: Host + '/service-api/cancelAppoint'
    }
    // 根据门店ID和时间区间获取预约记录(分页)
export const appointmentList = {
        URL: Host + '/service-api/pageAppointmentListByStoreIdAndTimeRange/'
    }
    // 修改员工的推荐状态
export const updateStaffRecommendStatus = {
        URL: Host + '/service-api/updateStaffRecommendStatus'
    }
    // 获取客户列表
export const getCustomerList = {
        URL: Host + '/service-api/getCustomerList'
    }
    // 修改客户备注
export const updateCustomerRemark = {
        URL: Host + '/service-api/updateCustomerRemark'
    }
    // 获取客户美丽档案
export const getCustomerInfo = {
        URL: Host + '/service-api/getCustomerInfo/'
    }
    // 修改客户美丽档案
export const updateCustomerBaseInfo = {
        URL: Host + '/service-api/updateCustomerBaseInfo/'
    }
    // 我的门店部分接口
    // 获取所有品牌调用
export const getMyBrands = {
        URL: Host + '/service-api/myBrands'
    }
    // 获取当前品牌的管理页面权限
export const queryBrandPrivileges = {
        URL: Host + '/service-api/queryBrandPrivileges/'
    }
    // 获取当前品牌的管理页面权限
export const queryStorePrivileges = {
    URL: Host + '/service-api/queryStorePrivileges/'
}

// 当前品牌获取调用
export const getBrandInfo = {
        URL: Host + '/service-api/getBrandInfo'
    }
    // 获取我的店铺调用
export const getMyShops = {
        URL: Host + '/service-api/myShops/'
    }
    // 根据ID获取门店信息
export const getShopInfoById = {
        URL: Host + '/service-api/getShopInfoById/'
    }
    // 删除品牌调用
export const deleteBrand = {
        URL: Host + '/service-api/deleteBrand'
    }
    // 新增创建店铺信息调用
export const createBrand = {
        URL: Host + '/service-api/createBrand'
    }
    // 新增创建门店信息调用
export const createShop = {
        URL: Host + '/service-api/createShop'
    }
    // 获取行业信息调用
export const getIndustryList = {
        URL: Host + '/service-api/getIndustryList'
    }
    // 根据店铺id获取品牌客户电话
export const getCustomerServicePhone = {
        URL: Host + '/service-api/getCustomerServicePhone/'
    }
    // 获取门店下的店铺列表(只有上线状态)
export const getBrandAndShop = {
        URL: Host + '/service-api/getBrandAndShop'
    }
    // 获取门店下的店铺列表(所有状态)
export const getStoreListByFilter = {
        URL: Host + '/service-api/getStoreListByFilter'
    }
    // 文件上传接口
export const uploadFile = {
        URL: Host + '/service-api/upload/'
    }
    //  查询操作台下拉选品牌信息
export const getBrandInfobrand = {
        URL: Host + '/service-api/getBrandInfo4BrandPullDownMenu/'
    }
    //  查询操作台下拉选门店信息
export const getStoreInfoshop = {
    URL: Host + '/service-api/getBrandInfo4StorePullDownMenu/'
}



// 操作台部分接口
// 今日收款
export const incomeToday = {
        URL: Host + '/service-api/incomeToday'
    }
    // 今日实时
export const realTimeToday = {
        URL: Host + '/service-api/realTimeToday'
    }
    // pc趋势图
export const trendChart = {
    URL: Host + '/service-api/trendChart'
}

// 预约管理部分接口
// 获取预约客户列表
export const listBookingCustomer = {
        URL: Host + '/service-api/listBookingCustomer'
    }
    // 新增预约
export const addBooking = {
        URL: Host + '/service-api/addBooking'
    }
    // 新增预约-根据手机号模糊搜索客户列表
export const listCustomerLikeMobile = {
        URL: Host + '/service-api/listCustomerLikeMobile'
    }
    // 获取预约日历
export const getAppointmentDailyData = {
        URL: Host + '/service-api/getAppointmentDailyData'
    }
    // 根据门店和预约时间列出有空的发型师
export const getAvailableSimpleStaffList = {
        URL: Host + '/service-api/getAvailableSimpleStaffList'
    }
    // 获取门店下的一级分类
export const getServiceSortOneListByStoreIdAndLevel = {
        URL: Host + '/service-api/getServiceSortOneListByStoreIdAndLevel'
    }
    // 根据选择的手艺人列出可选服务项目
export const getServiceListByStoreIdAndSortOneAndLevel = {
        URL: Host + '/service-api/getServiceListByStoreIdAndSortOneAndLevel'
    }
    // 创建预约请求
export const createAppointment = {
        URL: Host + '/service-api/createAppointment'
    }
    // 取消预约
export const cancelBooking = {
        URL: Host + '/service-api/cancelBooking'
    }
    // 获取预约详情
export const getBookingTimeDetails = {
        URL: Host + '/service-api/getBookingTimeDetails'
    }
    // 预约时间表-修改预约详情
export const updateBookingTimeDetails = {
        URL: Host + '/service-api/updateBookingTimeDetails'
    }
    // 根据门店ID获取门店设置的可预约时间
export const getAvailableAppoTime = {
        URL: Host + '/service-api/getAvailableAppointTimeByStoreId'
    }
    // 根据手机号/姓名查找用户
export const findCustomerByNameOrTelephone = {
        URL: Host + '/service-api/findCustomerByNameOrTelephone'
    }
    // 根据时间查找有空的手艺人
export const findTechnicianByTime = {
        URL: Host + '/service-api/findTechnicianByTime'
    }
    // 根据手艺人查找相应服务
export const findServiceItemByTechnician = {
    URL: Host + '/service-api/findServiceItemByTechnician/'
}

// 订单管理模块
// 收款台
export const esConsumerOrderList = {
        url: Host + '/service-api/esConsumerOrderList'
    }
    // 删除消费账单
export const deleteConsumerOrder = {
        url: Host + '/service-api/deleteConsumerOrder'
    }
    //获取指定日期的删除消费账单
export const getDeletedConsumerOrderList = {
        url: Host + '/service-api/getDeletedConsumerOrderList'
    }
    //恢复已删除消费账单
export const renewConsumerOrder = {
        url: Host + '/service-api/renewConsumerOrder'
    }
    //根据订单id查询订单信息
export const getServiceOrderDetailsById = {
        URL: Host + '/service-api/getServiceOrderDetailsById/'
    }
    // 添加用户服务项目备注
export const addFrontDeskRemark = {
        URL: Host + '/service-api/addFrontDeskRemark'
    }
    // 取消订单
export const cancelOrder = {
        URL: Host + '/service-api/cancelOrder'
    }
    // 获取订单详情基本信息
export const getOrderBaseInfo = {
        URL: Host + '/service-api/getOrderBaseInfo/'
    }
    // 获取订单详情的订单明细
export const getOrderInfo = {
        URL: Host + '/service-api/getOrderInfo/'
    }
    //查看门店服务订单列表
export const getServiceOrderList = {
    URL: Host + '/service-api/getServiceOrderList'
}
export const getChoosePeople = {
        URL: Host + '/service-api/getStaffListByStoreIdAndLevelIdAndFilter'
    }
    // 拒绝退款
export const refuseRefund = {
        URL: Host + '/service-api/refuseRefund'
    }
    // 获取退款金额
export const getRefundInfo = {
        URL: Host + '/service-api/getRefundInfo'
    }
    // 修改退款
export const updateRefund = {
        URL: Host + '/service-api/updateRefund'
    }
    // 快速开单人列表
export const listOrderPerson = {
        URL: Host + '/service-api/listOrderPerson'
    }

// 商品管理模块
// 获取服务列表
export const getServiceList = {
        URL: Host + '/service-api/getServiceList'
    }
    // 获取单个的服务信息，主要用于编辑服务信息
export const getServiceInfo = {
        URL: Host + '/service-api/getServiceInfo/'
    }
    // 新增服务
export const addService = {
        URL: Host + '/service-api/addService'
    }
    // 服务门店隐藏
export const serviceUnshowInShop = {
        URL: Host + '/service-api/serviceUnshowInShop'
    }
    // 服务门店显示
export const serviceShowInShop = {
        URL: Host + '/service-api/serviceShowInShop'
    }
    /**根据员工ID获取可用的服务列表 */
export const getStaffAvailableService = {
        URL: Host + '/service-api/getStaffAvailableService'
    }
    // 服务不推荐
export const serviceUnrecommend = {
        URL: Host + '/service-api/serviceUnrecommend'
    }
    // 服务推荐
export const serviceRecommend = {
        URL: Host + '/service-api/serviceRecommend'
    }
    // 服务上架
export const serviceOnShelves = {
        URL: Host + '/service-api/serviceOnShelves'
    }
    // 服务下架
export const serviceOffShelves = {
        URL: Host + '/service-api/serviceOffShelves'
    }
    // 永久删除服务项目
export const serviceCompleteDelete = {
        URL: Host + '/service-api/serviceCompleteDelete'
    }
    // 查看标签列表
export const listTags = {
        URL: Host + '/service-api/listTags'
    }
    // 新增标签
export const addTags = {
        URL: Host + '/service-api/addTags'
    }
    // 服务恢复
export const serviceRenew = {
        URL: Host + '/service-api/serviceRenew'
    }
    // 获取服务编号
export const getServiceCode = {
        URL: Host + '/service-api/getServiceCode'
    }
    // 查看门店
export const getShopTree = {
        URL: Host + '/service-api/getShopTree/'
    }
    // 删除店铺
export const deleteShop = {
        URL: Host + '/service-api/deleteShop'
    }
    // 获取二级分类
export const getServiceSortLevelTwoList = {
        URL: Host + '/service-api/getServiceSortLevelTwoList'
    }
    // 商品管理-新增服务分类、分类管理
export const addServiceSort = {
        URL: Host + '/service-api/addServiceSort'
    }
    //商品管理,门店添加产品标签
export const addNewProductTag = {
        URL: Host + "/service-api/addNewProductTag"
    }
    //商品管理,添加或者修改产品
export const addOrModifyProduct = {
        URL: Host + "/service-api/addOrModifyProduct"
    }
    //商品管理,门店删除产品标签
export const deleteProductTag = {
        URL: Host + "/service-api/deleteProductTag/"
    }
    //商品管理,获取门店自定义标签
export const getStoreProductTags = {
        URL: Host + "/service-api/getStoreProductTags"
    }
    //商品管理,产品标签修改
export const modifyProductSelectedTags = {
        URL: Host + "/service-api/modifyProductSelectedTags"
    }
    //商品管理,产品补货
export const modifyProductStock = {
        URL: Host + "/service-api/modifyProductStock"
    }
    //商品管理,设置产品虚拟销量
export const modifyVirtualSaleCount = {
        URL: Host + "/service-api/modifyVirtualSaleCount"
    }
    //商品管理,产品上下架处理
export const offShelfProduct = {
        URL: Host + "/service-api/offShelfProduct"
    }
    //商品管理,根据产品ID获取产品详细信息

export const productDetailsInfo = {
        URL: Host + "/service-api/productDetailsInfo/"
    }
    //商品管理,产品是否网店展示
export const productShowInShop = {
        URL: Host + "/service-api/productShowInShop"
    }
    //商品管理,根据产品ID获取当前产品所有规格库存
export const productStock = {
        URL: Host + "/service-api/productStock/"
    }
    //商品管理,产品标签信息统计
export const productTagsCountInfo = {
        URL: Host + "/service-api/productTagsCountInfo/"
    }
    //商品管理,产品首页推荐
export const recommandInFirstPage = {
        URL: Host + "/service-api/recommandInFirstPage"
    }
    //商品管理,删除与恢复产品
export const recoverOrDeleteProduct = {
        URL: Host + "/service-api/recoverOrDeleteProduct"
    }
    //商品管理,存为草稿
export const saveProductInfoAsDraft = {
        URL: Host + "/service-api/saveProductInfoAsDraft"
    }
    // 员工中心模块
    // 创建门店员工
export const createStaff = {
        URL: Host + '/service-api/createStaff'
    }
    // 创建总部员工
export const createBrandStaff = {
        URL: Host + '/service-api/createBrandStaff'
    }
    // 自动获取员工编号
export const createStaffCode = {
        URL: Host + '/service-api/createStaffCode'
    }
    // 获取员工职级列表
export const getStaffLevelListByStoreId = {
        URL: Host + '/service-api/getStaffLevelListByStoreId/'
    }
    // 获取服务者员工职级列表
export const getSimpleLevelList = {
        URL: Host + '/service-api/getSimpleStoreStaffLevelList/'
    }
    // 获取非服务者员工职级列表
export const getNoLevelList = {
        URL: Host + '/service-api/getNotServerStaffLevelList/'
    }
    // 获取门店员工总列表
export const getStaffInfoList = {
        URL: Host + '/service-api/getStaffInfoList/'
    }
    // 获取总部员工总列表
export const getBrandStaffList = {
        URL: Host + '/service-api/esGetBrandStaffList/'
    }
    // 获取门店当前员工信息
export const getStoreStaffInfo = {
        URL: Host + '/service-api/getStoreStaffInfo/'
    }
    // 获取总部当前员工信息
export const getBrandStaffInfoById = {
        URL: Host + '/service-api/getBrandStaffInfoById/'
    }
    // 获取总部下所有的职务身份列表
export const getBrandStaffLevels = {
        URL: Host + '/service-api/getBrandStaffLevels/'
    }
    // 更新员工信息
export const updateStaff = {
        URL: Host + '/service-api/updateStaff'
    }
    // 更新总部员工信息
export const updateBrandStaff = {
        URL: Host + '/service-api/updateBrandStaffById'
    }
    // 从列表中修改员工为离职状态
export const batchDimission = {
        URL: Host + '/service-api/batchDimission'
    }
    // 从列表中修改总部员工为离职状态
export const forbidBrandStaff = {
        URL: Host + '/service-api/forbidBrandStaff'
    }
    // 从列表中修改员工为在职状态
export const batchWorking = {
        URL: Host + '/service-api/batchWorking'
    }
    // 从列表中删除员工信息
export const batchStaffDelete = {
        URL: Host + '/service-api/batchStaffDelete'
    }
    // 从列表中删除总部员工信息
export const batchBrandStaffDelete = {
        URL: Host + '/service-api/batchBrandStaffDelete'
    }
    // 从列表中永久删除员工信息
export const batchCompleteDeleteStaff = {
        URL: Host + '/service-api/batchCompleteDeleteStaff'
    }
    // 从列表中禁用门店员工信息
export const forbidStaff = {
        URL: Host + '/service-api/forbidStaff'
    }
    // 从列表中恢复门店员工信息
export const batchStaffRenew = {
        URL: Host + '/service-api/batchStaffRenew'
    }
    // 从列表中恢复总部员工信息
export const batchBrandStaffRenew = {
        URL: Host + '/service-api/batchBrandStaffRenew'
    }
    // 我的店铺列表
export const findShopList = {
        URL: Host + '/service-api/findShopList/'
    }
    // 文件上传模块
    // 图片上传
export const uploadPicture = {
        URL: Host + '/service-api/uploadPicture/'
    }
    // 图片删除
export const deletePicture = {
    URL: Host + '/service-api/deletePicture/'
}

// 测试websocket接口
export const socketServer = {
    URL: wsHost + '/service-api/socketServer'
}

// 创建消费订单（挂单）
export const createConsumerOrder = {
    URL: Host + '/service-api/createConsumerOrder'
}

// 设置中心
// 预约快捷设置
export const getStoreAppointmentSettingByStoreId = {
    URL: Host + '/service-api/getStoreAppointmentSettingByStoreId/'
}
export const updateStoreAppointmentSetting = {
        URL: Host + '/service-api/updateStoreAppointmentSetting/'
    }
    // 排班
    // 获取门店员工班次列表(按职级筛选)
export const getStoreStaffShifts = {
        URL: Host + '/service-api/getStoreStaffShifts'
    }
    // 获取门店的全部班次安排列表
export const getStoreShiftsTimeByStoreId = {
        URL: Host + '/service-api/getStoreShiftsTimeByStoreId/'
    }
    // 更新门店员工的某天排班信息
export const updateStoreStaffShifts = {
        URL: Host + '/service-api/updateStoreStaffShifts'
    }
    // 新增门店的班次信息
export const addStoreShift = {
        URL: Host + '/service-api/addStoreShift'
    }
    // 更新门店的某个班次信息
export const updateStoreShift = {
        URL: Host + '/service-api/updateStoreShift'
    }
    // 删除某个班次信息
export const deleteStoreShift = {
        URL: Host + '/service-api/deleteStoreShift/'
    }
    //提成设置
    //获取门店提成设置的基础设置
export const getStoreBaseCommissionSetting = {
        URL: Host + '/service-api/getStoreBaseCommissionSetting/'
    }
    //修改门店提成设置基础设置
export const updateStoreBaseCommissionSetting = {
        URL: Host + '/service-api/updateStoreBaseCommissionSetting'
    }
    //提成设置时的服务列表
export const getStoreServiceListForPerformanceCost = {
        URL: Host + '/service-api/getStoreServiceListForPerformanceCost'
    }
    //提成设置商品服务者业绩提成的服务列表
export const getStoreServiceListForPerformanceStaff = {
        URL: Host + '/service-api/getStoreServiceListForPerformanceStaff'
    }
    //批量设置业绩成本
export const batchSetPerformanceCost = {
        URL: Host + '/service-api/batchSetPerformanceCost'
    }
    //批量设置服务人员业绩
export const batchSetPerformanceStaff = {
        URL: Host + '/service-api/batchSetPerformanceStaff'
    }
    //获取门店服务分类信息
export const getStoreSortInfo = {
        URL: Host + '/service-api/getStoreSortInfo/'
    }
    //服务分类名称模糊检索
export const getStoreSortInfoWithFilter = {
        URL: Host + '/service-api/getStoreSortInfoWithFilter'
    }
    //删除服务分类
export const deleteServiceSort = {
        URL: Host + '/service-api/deleteServiceSort'
    }
    //更新服务分类
export const updateServiceSort = {
        URL: Host + '/service-api/updateServiceSort'
    }
    //批量设置服务标签
export const batchSetServiceTags = {
        URL: Host + '/service-api/batchSetServiceTags'
    }
    //获取可使用的服务标签
export const getDynamicCountByTag = {
        URL: Host + '/service-api/getDynamicCountByTag/'
    }
    // 组织架构
    // 职务管理
    // 创建员工职务
export const createStaffLevel = {
        URL: Host + '/service-api/createStaffLevel'
    }
    // 删除员工职务
export const deleteStaffLevel = {
        URL: Host + '/service-api/deleteStaffLevel'
    }
    // 获取职务列表
export const getStaffLevelByFilter = {
        URL: Host + '/service-api/getStaffLevelByFilter'
    }
    // 修改员工职务
export const updateStaffLevel = {
        URL: Host + '/service-api/updateStaffLevel'
    }
    // 权限管理 - 角色权限
export const queryAllPrivileges = {
        URL: Host + '/service-api/queryAllPrivileges'
    }
    // 权限管理 - 获取所有角色权限信息
export const getAllRoles = {
    URL: Host + '/service-api/getAllRoles'
}


//门店管理，批量首页推荐/取消推荐
export const batchStoreRecommend = {
        URL: Host + '/service-api/batchStoreRecommend'
    }
    //门店管理，设置店长
export const setStoreManager = {
        URL: Host + '/service-api/setStoreManager'
    }
    //门店管理，创建店长
export const createStoreManager = {
        URL: Host + '/service-api/createStoreManager'
    }
    //修改店长
export const editStoreManager = {
        URL: Host + '/service-api/editStoreManager'
    }
    //门店管理，更改门店排序
export const updateStoreOrderNo = {
        URL: Host + '/service-api/updateStoreOrderNo'
    }
    //获取品牌小程序二维码
export const getQrCode = {
        URL: Host + "/service-api/getQrCode"
    }
    //新增自定义标签
export const addNewCustomerTag = {
        URL: Host + "/service-api/addNewCustomerTag"
    }
    //删除自定义标签
export const deleteCustomerTag = {
        URL: Host + "/service-api/deleteCustomerTag"
    }
    //根据客户ID，获取客户的所有标签
export const getCustomerTagsByIdsAndStoreId = {
        URL: Host + "/service-api/getCustomerTagsByIdsAndStoreId"
    }
    /**获取客户列表部分筛选条件 * */
export const getStoreCustomerListFilter = {
        URL: Host + "/service-api/getStoreCustomerListFilter/"
    }
    //获取客户列表头部标签信息以及统计信息
export const getHeadTagInfoAndCount = {
        URL: Host + "/service-api/getHeadTagInfoAndCount"
    }
    //更改客户服务者
export const changeServer = {
        URL: Host + "/service-api/changeCutomerBelongServer"
    }
    //更改客户的自定义标签
export const updateCustomerTags = {
        URL: Host + "/service-api/updateCustomerTags"
    }
    //根据职级ID获取可选服务列表
export const getServiceListByLevelFilter = {
        URL: Host + "/service-api/getServiceListByLevelFilter"
    }
    //获取原绑定手机号验证码
export const getOldMobileVerifyCode = {
        URL: Host + "/service-api/getOldMobileVerifyCode"
    }
    //获取验证码验证结果
export const getVerifyCodeResult = {
        URL: Host + "/service-api/getVerifyCodeResult"
    }
    //修改绑定手机号
export const updateMobile = {
        URL: Host + "/service-api/updateMobile"
    }
    //获取修改个人手机号验证码
export const getUpdateMobileVerifyCode = {
        URL: Host + "/service-api/getUpdateMobileVerifyCode"
    }
    //员工管理/(put)根据员工作品动态ID设置为热门或非热门
export const setStaffDynamicWorksIsHotByIds = {
        URL: Host + "/service-api/setStaffDynamicWorksIsHotByIds"
    }
    //员工管理/(put)根据员工作品动态ID设置为封面或非封面
export const setStaffCovers = {
        URL: Host + "/service-api/setStaffDynamicWorksIsCoverByIds"
    }
    //员工管理/(put)员工作品动态作品删除与恢复
export const staffDynamicWorksStatusChangeByIds = {
        URL: Host + "/service-api/staffDynamicWorksStatusChangeByIds"
    }
    //员工管理/(get)根据门店ID获取员工作品动态统计信息
export const staffDynamicWorksCountInfo = {
        URL: Host + "/service-api/staffDynamicWorksCountInfo/"
    }
    //员工管理/(post) pc动态榜单-员工
export const getDynamicStaffRankList = {
        URL: Host + "/service-api/getDynamicStaffRankList/"
    }
    //员工管理/(post) pc动态榜单-作品
export const getDynamicWorksRankList = {
        URL: Host + "/service-api/getDynamicWorksRankList/"
    }
    //员工管理/(get)根据员工动态作品ID获取动态作品详情页
export const staffDynamicWorksDetail = {
        URL: Host + "/service-api/staffDynamicWorksDetail/"
    }
    //员工管理/(delete)根据评论ID删除员工动态作品评论信息
export const staffDynamicWorksComments = {
        URL: Host + "/service-api/staffDynamicWorksComments/"
    }
    //员工管理/(delete)/根据回复ID删除员工动态作品回复信息
export const staffDynamicWorksReplies = {
        URL: Host + "/service-api/staffDynamicWorksReplies/"
    }
    //认证品牌信息查询
export const getAuthenticateBrandInfo = {
        URL: Host + "/service-api/getAuthenticateBrandInfo"
    }
    //认证品牌
export const authenticateBrand = {
        URL: Host + "/service-api/authenticateBrand"
    }
    //新增客户时检索品牌下是否存在
export const getCustomerInfoByMobile = {
        URL: Host + "/service-api/getCustomerInfoByMobile"
    }
    //获取客户美丽档案基础信息
export const getCustomerBaseInfoById = {
        URL: Host + "/service-api/getCustomerBaseInfoById/"
    }
    //员工档案根据员工ID获取该员工所有的动态作品
export const getStaffDynamicWorksList = {
        URL: Host + "/service-api/getStaffDynamicWorksList"
    }
    //员工中心-查询员工档案的服务评价列表
export const getStaffAssessmentList = {
        URL: Host + "/service-api/getStaffAssessmentList"
    }
    //员工中心-查询员工档案的服务档案
export const getStaffServiceRecords = {
        URL: Host + "/service-api/getStaffServiceRecords"
    }
    //员工中心-修改服务档案客户端展示
export const editServiceClient = {
        URL: Host + "/service-api/editServiceClient"
    }
    //根据品牌ID获取产品分类
export const getProductSortList = {
        URL: Host + "/service-api/getProductSortList/"
    }
    //添加修改产品分类
export const createProductSort = {
    URL: Host + "/service-api/createProductSort"
}
export const deleteProductSortBySortId = {
        URL: Host + "/service-api/deleteProductSortBySortId/"
    }
    //根据品牌ID分类名称模糊查询产品分类
export const getProductSortListByNameAndBrandId = {
    URL: Host + "/service-api/getProductSortListByNameAndBrandId"
}
export const searchProductListByCondition = {
        URL: Host + "/service-api/searchProductListByCondition"
    }
    //查看产品分类是否可删除
export const checkProductSortCanDelete = {
        URL: Host + "/service-api/checkProductSortCanDelete/"
    }
    //获取是否允许删除服务分类
export const getPermissionForDeleteServiceSort = {
        URL: Host + "/service-api/getPermissionForDeleteServiceSort/"
    }
    //查询角色列表
export const queryRoleList = {
        URL: Host + "/service-api/queryRoleList"
    }
    //获取订单ID,状态获取产品订单详情
export const getProductOrderDetailsById = {
        URL: Host + "/service-api/getProductOrderDetailsById"
    }
    //售后处理
export const handleAfterSaleContent = {
        URL: Host + "/service-api/handleAfterSaleContent"
    }
    //商家同意退款
export const salerAgreeRefundOrder = {
        URL: Host + "/service-api/salerAgreeRefundOrder"
    }
    //商家取消未支付的产品订单
export const salerCancelUnPayOrder = {
        URL: Host + "/service-api/salerCancelUnPayOrder/"
    }
    //商家删除产品订单
export const salerDeleteProducutOrder = {
        URL: Host + "/service-api/salerDeleteProducutOrder/"
    }
    //产品订单备注修改
export const salerModifyProductOrderNote = {
        URL: Host + "/service-api/salerModifyProductOrderNote"
    }
    //商家拒绝退款
export const salerRejectRefundOrder = {
        URL: Host + "/service-api/salerRejectRefundOrder"
    }
    //商家撤回拒绝退款
export const salerRejectRefundOrderRollBack = {
        URL: Host + "/service-api/salerRejectRefundOrderRollBack/"
    }
    /**PC 软件订购 我管理的品牌列表 */
export const myMGbrand = {
        URL: Host + "/service-api/brandList4SoftOrder/"
    }
    /**PC 软件订购 我管理的门店列表 */
export const myMGStore = {
        URL: Host + "/service-api/storeList4SoftOrder/"
    }
    /**软件订购 消费记录 */
export const getRecord = {
    URL: Host + "/service-api/brandSoftOrderRecord/"
}

/**软件订购-试用店开通软件服务 */
export const openSoftService = {
    URL: Host + "/service-api/openSoftService/"
}

/**我的门店-检测该品牌的券和试用名额 */
export const getCreateAbleStoreNum = {
        URL: Host + "/service-api/getCreateAbleStoreNum/"
    }
    /**软件订购-查询可购买的软件列表 */
export const getSoftInfoBuySoft = {
        URL: Host + "/service-api/getSoftInfo4BuySoft/"
    }
    /**产品列表ES搜索 */
export const esProductList = {
    URL: Host + "/service-api/esProductList"
}

/** 软件订购 门店新开/续购券信息 */
export const softRecord = {
        URL: Host + "/service-api/softRecord/"
    }
    /** 软件订购 门店新开/续购券购券记录 */
export const softRecordList = {
        URL: Host + "/service-api/softRecordList/"
    }
    /** 软件订购 创建软件订单，返回支付链接 */
export const createSoftOrder = {
        URL: Host + "/service-api/createSoftOrder/"
    }
    /*修改产品排序号*/
export const changeProductSortOrder = {
        URL: Host + "/service-api/changeProductSortOrder/"
    }
    /**商家回复顾客的售后评价 */
export const salerReplyCustomerAfterSaleAssessment = {
        URL: Host + "/service-api/salerReplyCustomerAfterSaleAssessment"
    }
    // 新增会员卡须知
export const createMembershipCardNotes = {
        URL: Host + "/service-api/createMembershipCardNotes"
    }
    // 获取会员卡须知
export const getMembershipCardNotes = {
        URL: Host + "/service-api/getMembershipCardNotes"
    }
    // 删除会员卡须知
export const deleteMembershipCardNotes = {
        URL: Host + "/service-api/deleteMembershipCardNotes"
    }
    // 修改会员卡须知
export const modifyMembershipCardNotes = {
        URL: Host + "/service-api/modifyMembershipCardNotes"
    }
    // 新增身份卡
export const addIdentityCardKindInfo = {
        URL: Host + "/service-api/addIdentityCardKindInfo"
    }
    //新增储蓄卡
export const addPrePaidCardKindInfo = {
        URL: Host + "/service-api/addPrePaidCardKindInfo"
    }
    // 查询会员卡类型数量信息 -- 总部
export const getCardKindCountInfo = {
        URL: Host + "/service-api/getCardKindCountInfo"
    }
    // 下架某些种类会员卡
export const offCardKinds = {
        URL: Host + "/service-api/shelfCardKinds"
    }
    // 上架某些种类会员卡
export const upperCardKinds = {
        URL: Host + "/service-api/upperCardKinds"
    }
    // 恢复某些种类会员卡
export const recoverCardKinds = {
        URL: Host + "/service-api/recoverCardKinds"
    }
    // 设为超值推荐
export const recommendCardKinds = {
        URL: Host + "/service-api/recommendCardKinds"
    }
    // 取消超值推荐
export const cancelRecommendCardKinds = {
        URL: Host + "/service-api/cancelRecommendCardKinds"
    }
    // 删除某些种类会员卡
export const deleteCardKinds = {
        URL: Host + "/service-api/deleteCardKinds"
    }
    // 设置会员卡权重
export const setCardKindsSortWeight = {
        URL: Host + "/service-api/setCardKindsSortWeight"
    }
    // 设置续卡、充值规则
export const setCardRenewalRules = {
        URL: Host + "/service-api/setCardRenewalRules"
    }
    // 查询某种会员卡详细信息
export const getCardKindDetailInfo = {
        URL: Host + "/service-api/getCardKindDetailInfo"
    }
    // 分页查询会员卡销售记录 - 总部
export const pagedQueryCardKindSalesRecord = {
        URL: Host + "/service-api/pagedQueryCardKindSalesRecord"
    }
    // 分页查询历史卡项--总部
export const pagedQueryCardKindHistory = {
        URL: Host + "/service-api/pagedQueryCardKindHistory"
    }
    // 查询某种会员卡快照详细信息
export const getCardKindSnapshotDetailInfo = {
        URL: Host + "/service-api/getCardKindSnapshotDetailInfo"
    }
    // 分页查询会员卡快照销售记录----总部
export const pagedQueryCardKindSnapshotSalesRecord = {
        URL: Host + "/service-api/pagedQueryCardKindSnapshotSalesRecord"
    }
    // 修改身份卡种类信息
export const modifyIdentityCardKindInfo = {
        URL: Host + "/service-api/modifyIdentityCardKindInfo"
    }
    // 修改储蓄卡种类信息
export const modifyPrePaidCardKindInfo = {
        URL: Host + "/service-api/modifyPrePaidCardKindInfo"
    }
    //根据订单ID获取订单评价
export const getGoodsOrderAssessmentByOrderId = {
        URL: Host + "/service-api/getGoodsOrderAssessmentByOrderId/"
    }
    //商家回复订单评价/{refundOrderId}
export const replyAssessment = {
        URL: Host + "/service-api/replyAssessment"
    }
    //根据售后单ID查询评价详情
export const getOrderAfterSaleAssessmentInfo = {
        URL: Host + "/service-api/getOrderAfterSaleAssessmentInfo/"
    }
    //创建会员卡结算单
export const createPcCardsBill = {
        URL: Host + "/service-api/createPcCardsBill"
    }
    // 付款码结算
export const billingByPaymentCode = {
        URL: Host + "/service-api/billingByPaymentCode"
    }
    // 获取顾客会员卡信息
export const getCustomerCardByCustomerId = {
        URL: Host + "/service-api/getCustomerCardByCustomerId/"
    }
    // 获取品牌的职级列表
export const getStaffLevelListByBrandId = {
        URL: Host + "/service-api/getStaffLevelListByBrandId/"
    }
    //获取会员卡的续卡规则信息
export const getCardRenewalRules = {
        URL: Host + "/service-api/getCardRenewalRules/"
    }
    //卡项订单----开卡订单记录
export const pagedQueryBasicCreateCardOrderInfo = {
        URL: Host + "/service-api/pagedQueryBasicCreateCardOrderInfo"
    }
    //卡项订单----充值订单记录
export const pagedQueryBasicRenewalCardOrderInfo = {
        URL: Host + "/service-api/pagedQueryBasicRenewalCardOrderInfo"
    }
    //修改订单备注----卡项订单
export const modifyCardOrderRemarks = {
    URL: Host + "/service-api/modifyCardOrderRemarks"
}

// 获取门店下的店铺列表(卡项管理专用)
export const getBasicStoreListByFilter = {
        URL: Host + '/service-api/getBasicStoreListByFilter'
    }
    // 查询会员卡类型数量信息 -- 门店
export const getStoreCardKindCountInfo = {
    URL: Host + "/service-api/getStoreCardKindCountInfo"
}
