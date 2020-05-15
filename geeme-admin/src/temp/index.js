/* 模拟角色权限树 */
const mockRole = {
  name: 'app',
  entry: [],
  children: [
    {
      title: '操作台',
      name: 'dashboard',
      permission: true,
      entry: [],
      children: [],
    },
    {
      title: '商家管理',
      name: 'merchant',
      permission: true,
      entry: [],
      children: [
        {
          title: '商家列表',
          name: 'merchantList',
          permission: true,
          entry: [
            { name: 'mldetail', title: '商家详情', permission: true},
            { name: 'mlcertification', title: '商家认证', permission: true},
            { name: 'mlexport', title: '列表导出', permission: false},
          ],
          children: [],
        },
        {
          title: '新增使用',
          name: 'trialMerchantList',
          permission: true,
          entry: [
            { name: 'tmdetail', title: '新增用户详情', permission: true},
            { name: 'tmcertification', title: '新增用户认证', permission: true},
            { name: 'tmexport', title: '新增用户列表导出', permission: false},
          ],
          children: [],
        },
        {
          title: '新购订单',
          name: 'newMerchantList',
          permission: true,
          entry: [],
          children: [],
        },
        {
          title: '续费订单',
          name: 'renewalMerchantList',
          permission: true,
          entry: [],
          children: [],
        },
      ]
    } 
  ],
}

export default mockRole
