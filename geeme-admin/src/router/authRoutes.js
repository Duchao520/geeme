const authRoutes = [
  {
    path: 'dashboard',
    component: () => import('@/pages/dashboard/index'),
    name: 'dashboard',
    meta: {
      title: '操作台',
      link: '/app/dashboard',
      icon: '&#xe6bb;'
    },
  },
  {
    path: 'merchant',
    component: () => import('@/pages/merchant/index'),
    name: 'merchant',
    redirect: '/app/merchant/list',
    meta: {
      title: '商户管理',
      link: '/app/merchant',
      icon: '&#xe6b9;',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/merchant/list/index'),
        name: 'merchantList',
        meta: {
          title: '商家列表',
          link: '/app/merchant/list'
        },
        children: [
          {
            path: 'authBrand/:id',
            component: () => import('@/pages/merchant/list/authBrand/index'),
            name: 'authBrand',
            meta: {
              title: '品牌认证',
              link: '/app/merchant/list/authBrand',
            }
          },
          {
            path: 'brandDetail/:id',
            component: () => import('@/pages/merchant/list/brandDetail/index'),
            name: 'brandDetail',
            meta: {
              title: '品牌详情',
              link: '/app/merchant/list/brandDetail',
            }
          },
          {
            path: 'shopDetail/:id',
            component: () => import('@/pages/merchant/list/shopDetail/index'),
            name: 'shopDetail',
            meta: {
              title: '门店详情',
              link: '/app/merchant/list/shopDetail',
            }
          }
        ]
      },
      {
        path: 'CouponRecord',
        component: () => import('@/pages/merchant/CouponRecord/index'),
        name: 'CouponRecord',
        meta: {
          title: '派券记录',
          link: '/app/merchant/CouponRecord'
        },
      },
      {
        path: 'trial',
        component: () => import('@/pages/merchant/trial/index'),
        name: 'trialMerchantList',
        meta: {
          title: '新增试用',
          link: '/app/merchant/trial',
        }
      },
      {
        path: 'new',
        component: () => import('@/pages/merchant/new/index'),
        name: 'newMerchantList',
        meta: {
          title: '新购订单',
          link: '/app/merchant/new',
        }
      },
      {
        path: 'renewal',
        component: () => import('@/pages/merchant/renewal/index'),
        name: 'renewalMerchantList',
        meta: {
          title: '续费订单',
          link: '/app/merchant/renewal',
        }
      },
      {
        path: 'upgrade',
        component: () => import('@/pages/merchant/upgrade/index'),
        name: 'upgradeMerchantList',
        meta: {
          title: '升级订单',
          link: '/app/merchant/upgrade',
        }
      },
      {
        path: 'webapp',
        component: () => import('@/pages/merchant/webapp/index'),
        name: 'webapp',
        meta: {
          title: '小程序管理',
          link: '/app/merchant/webapp',
        },
        children: [
          {
            path: 'webappDetail/:id',
            component: () => import('@/pages/merchant/webapp/webappDetail/index'),
            name: 'webappDetail',
            meta: {
              title: '门店详情',
              link: '/app/merchant/webapp/webappDetail',
            }
          }
        ]
      },
      {
        path: 'specialAgreement',
        component: () => import('@/pages/merchant/specialAgreement/index'),
        name: 'specialAgreement',
        meta: {
          title: '特约商户',
          link: '/app/merchant/specialAgreement',
        },
      },
    ],
  },
  {
    path: 'supplier',
    component: () => import('@/pages/supplier/index'),
    name: 'supplier',
    redirect: '/app/supplier/list',
    meta: {
      title: '供应商管理',
      link: '/app/supplier',
      icon: '&#xe6ba;',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/supplier/list/index'),
        name: 'supplierList',
        meta: {
          title: '供应商列表',
          link: '/app/supplier/list',
        },
        children: [
          {
            path: 'supplierDetail/:id',
            component: () => import('@/pages/supplier/list/supplierDetail/index'),
            name: 'supplierDetail',
            meta: {
              title: '企业详情',
              link: '/app/supplier/list/supplierDetail',
            }
          }
        ]
      },
      {
        path: 'trial',
        component: () => import('@/pages/supplier/trial/index'),
        name: 'trialSupplierList',
        meta: {
          title: '新增试用',
          link: '/app/supplier/trial',
        }
      },
      {
        path: 'new',
        component: () => import('@/pages/supplier/new/index'),
        name: 'newSupplierList',
        meta: {
          title: '新购订单',
          link: '/app/supplier/new',
        }
      },
      {
        path: 'renewal',
        component: () => import('@/pages/supplier/renewal/index'),
        name: 'renewalSupplierList',
        meta: {
          title: '续费订单',
          link: '/app/supplier/renewal',
        }
      },
      {
        path: 'upgrade',
        component: () => import('@/pages/supplier/upgrade/index'),
        name: 'upgradeSupplierList',
        meta: {
          title: '升级订单',
          link: '/app/supplier/upgrade',
        }
      }
    ],
  },
  {
    path: 'employee',
    component: () => import('@/pages/employee/index'),
    name: 'employee',
    redirect: '/app/employee/list',
    meta: {
      title: '员工中心',
      link: '/app/employee',
      icon: '&#xe6b6;',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/employee/list/index'),
        name: 'employeeList',
        meta: {
          title: '员工列表',
          link: '/app/employee/list',
        },
        children: [
          {
            path: 'add',
            component: () => import('@/pages/employee/list/add/index'),
            name: 'addEmployee',
            meta: {
              title: '新增员工',
              link: '/app/employee/list/add',
            }
          }
        ]
      },
      {
        path: 'ranking',
        component: () => import('@/pages/employee/ranking/index'),
        name: 'employeeRanking',
        meta: {
          title: '业绩与薪酬',
          link: '/app/employee/ranking',
        }
      },
    ]
  },
  {
    path: 'category',
    component: () => import('@/pages/category/index'),
    name: 'category',
    redirect: '/app/category/service',
    meta: {
      title: '品类品牌',
      link: '/app/category',
      icon: '&#xe6b1;',
    },
    children: [
      {
        path: 'service',
        component: () => import('@/pages/category/service/index'),
        name: 'serviceClass',
        meta: {
          title: '服务分类',
          link: '/app/category/service',
        }
      },
      {
        path: 'product',
        component: () => import('@/pages/category/product/index'),
        name: 'productClass',
        meta: {
          title: '产品分类',
          link: '/app/category/product',
        }
      },
      {
        path: 'brand',
        component: () => import('@/pages/category/brand/index'),
        name: 'brandCan',
        meta: {
          title: '品牌库',
          link: '/app/category/brand',
        },
        children: [
          {
            path: 'add',
            component: () => import('@/pages/category/brand/edit'),
            name: 'addBrand',
            meta: {
              title: '新增品牌',
              link: '/app/category/brand/add',
            }
          },
          {
            path: 'edit/:id',
            component: () => import('@/pages/category/brand/edit'),
            name: 'editBrand',
            meta: {
              title: '编辑品牌',
              link: '/app/category/brand/edit',
            }
          }
        ]
      },
      {
        path: 'brandReview',
        component: () => import('@/pages/category/brandReview/index'),
        name: 'brandReview',
        meta: {
          title: '品牌审核',
          link: '/app/category/brandReview',
        }
      },
    ]
  },
  {
    path: 'community',
    component: () => import('@/pages/community/index'),
    name: 'community',
    //redirect: '/app/supplier/list',
    meta: {
      title: '服务者社区',
      link: '/app/community',
      icon: '&#xe708;',
    },
  },
  {
    path: 'official',
    component: () => import('@/pages/official/index'),
    name: 'official',
    redirect: '/app/official/problem',
    meta: {
      title: '官方网站',
      link: '/app/official',
      icon: '&#xe709;',
    },
    children: [
      {
        path: 'problem',
        name: 'problem',
        meta: {
          title: '常见问题',
          link: '/app/official/problem'
        },
        component: () => import('@/pages/official/problem/index'),
      },
      {
        path: 'customer',
        name: 'customer',
        meta: {
          title: '表单收集',
          link: '/app/official/customer'
        },
        component: () => import('@/pages/official/customer/index')
      }
    ]
  },
  {
    path: 'statistics',
    component: () => import('@/pages/statistics/index'),
    name: 'statistics',
    //redirect: '/app/supplier/list',
    meta: {
      title: '数据统计',
      link: '/app/statistics',
      icon: '&#xe6af;',
    },
  },
  {
    path: 'setting',
    component: () => import('@/pages/setting/index'),
    name: 'setting',
    redirect: '/app/setting/person',
    meta: {
      title: '设置中心',
      link: '/app/setting',
      icon: '&#xe6b7;',
    },
    children: [
      {
        path: 'person',
        component: () => import('@/pages/setting/person/index'),
        name: 'settingPerson',
        redirect: '/app/setting/person/basicInfo',
        meta: {
          title: '个人中心',
          link: '/app/setting/person',
        },
        children: [
          {
            path: 'basicInfo',
            component: () => import('@/pages/setting/person/basicInfo/index'),
            name: 'basicInfo',
            meta: {
              title: '基本资料',
              link: '/app/setting/person/basicInfo',
            }
          },
          {
            path: 'accountSecurity',
            component: () => import('@/pages/setting/person/accountSecurity/index'),
            name: 'accountSecurity',
            meta: {
              title: '账户安全',
              link: '/app/setting/person/accountSecurity',
            }
          },
          {
            path: 'changePassword',
            component: () => import('@/pages/setting/person/changePassword/index'),
            name: 'changePassword',
            meta: {
              title: '修改密码',
              link: '/app/setting/person/changePassword',
            }
          },
        ]
      }, {
        path: 'organization',
        component: () => import('@/pages/setting/organization/index'),
        name: 'settingOrganization',
        redirect: '/app/setting/organization/architecture',
        meta: {
          title: '组织架构',
          link: '/app/setting/organization',
        },
        children: [
          {
            path: 'architecture',
            component: () => import('@/pages/setting/organization/architecture/index'),
            name: 'settingArchitecture',
            meta: {
              title: '架构设置',
              link: '/app/setting/organization/architecture',
            }
          },
          {
            path: 'position',
            component: () => import('@/pages/setting/organization/position/index'),
            name: 'settingPosition',
            meta: {
              title: '职务设置',
              link: '/app/setting/organization/position',
            }
          },
          {
            path: 'permission',
            component: () => import('@/pages/setting/organization/permission/index'),
            name: 'settingPermission',
            meta: {
              title: '权限管理',
              link: '/app/setting/organization/permission',
            }
          },
        ]
      },
      {
        path: 'pricing',
        component: () => import('@/pages/setting/pricing/index'),
        name: 'settingPricing',
        redirect: '/app/setting/pricing/merchant',
        meta: {
          title: '软件定价',
          link: '/app/setting/pricing',
        },
        children: [
          {
            path: 'merchant',
            component: () => import('@/pages/setting/pricing/merchant/index'),
            name: 'merchantPrice',
            meta: {
              title: '商家系统',
              link: '/app/setting/pricing/merchant',
            }
          },
          {
            path: 'supplier',
            component: () => import('@/pages/setting/pricing/supplier/index'),
            name: 'supplierPrice',
            meta: {
              title: '供应商系统',
              link: '/app/setting/pricing/supplier',
            }
          }
        ]
      }, {
        path: 'commission',
        component: () => import('@/pages/setting/commission/index'),
        name: 'settingCommission',
        redirect: '/app/setting/commission/new',
        meta: {
          title: '提成设置',
          link: '/app/setting/commission',
        },
        children: [
          {
            path: 'new',
            component: () => import('@/pages/setting/commission/new/index'),
            name: 'newPurchaseCommission',
            meta: {
              title: '新购提成',
              link: '/app/setting/commission/new',
            },
            children: [
              {
                path: 'add',
                component: () => import('@/pages/setting/commission/new/add/index'),
                name: 'addNewCommission',
                meta: {
                  title: '新增提成方案',
                  link: '/app/setting/commission/new/add',
                }
              }
            ]
          },
          {
            path: 'renewal',
            component: () => import('@/pages/setting/commission/renewal/index'),
            name: 'renewalCommission',
            meta: {
              title: '续费提成',
              link: '/app/setting/commission/renewal',
            },
            children: [
              {
                path: 'add',
                component: () => import('@/pages/setting/commission/renewal/add/index'),
                name: 'addRenewalCommission',
                meta: {
                  title: '新增提成方案',
                  link: '/app/setting/commission/renewal/add',
                }
              }
            ]
          },
          {
            path: 'upgrade',
            component: () => import('@/pages/setting/commission/upgrade/index'),
            name: 'upgradeCommission',
            meta: {
              title: '升级提成',
              link: '/app/setting/commission/upgrade',
            }
          },
          {
            path: 'team',
            component: () => import('@/pages/setting/commission/team/index'),
            name: 'teamCommission',
            meta: {
              title: '团队业绩提成',
              link: '/app/setting/commission/team',
            },
            children: [
              {
                path: 'add',
                component: () => import('@/pages/setting/commission/team/add/index'),
                name: 'addTeamCommission',
                meta: {
                  title: '新增提成方案',
                  link: '/app/setting/commission/team/add',
                }
              }
            ]
          },
          {
            path: 'config',
            component: () => import('@/pages/setting/commission/config/index'),
            name: 'commissionConfig',
            meta: {
              title: '员工提成配置',
              link: '/app/setting/commission/config',
            }
          },
        ]
      }, {
        path: 'encoding',
        component: () => import('@/pages/setting/encoding/index'),
        name: 'settingEncoding',
        redirect: '/app/setting/encoding/list',
        meta: {
          title: '编码规则',
          link: '/app/setting/encoding',
        },
        children: [
          {
            path: 'list',
            component: () => import('@/pages/setting/encoding/list/index'),
            name: 'encodingList',
            meta: {
              title: '编码列表',
              link: '/app/setting/encoding/list',
            }
          },
          {
            path: 'area',
            component: () => import('@/pages/setting/encoding/area/index'),
            name: 'areaCode',
            meta: {
              title: '地区码',
              link: '/app/setting/encoding/area',
            }
          },
          {
            path: 'service',
            component: () => import('@/pages/setting/encoding/service/index'),
            name: 'serviceCode',
            meta: {
              title: '编码列表',
              link: '/app/setting/encoding/service',
            }
          },
        ]
      }, {
        path: 'material',
        component: () => import('@/pages/setting/material/index'),
        name: 'settingMaterial',
        redirect: '/app/setting/material/photo',
        meta: {
          title: '素材库',
          link: '/app/setting/material',
        },
        children: [
          {
            path: 'photo',
            component: () => import('@/pages/setting/material/photo/index'),
            name: 'photoLibrary',
            meta: {
              title: '图片',
              link: '/app/setting/material/photo',
            }
          },
          {
            path: 'audio',
            component: () => import('@/pages/setting/material/audio/index'),
            name: 'audioLibrary',
            meta: {
              title: '语音',
              link: '/app/setting/material/audio',
            }
          },
          {
            path: 'video',
            component: () => import('@/pages/setting/material/video/index'),
            name: 'videoLibrary',
            meta: {
              title: '视频',
              link: '/app/setting/material/video',
            }
          }
        ]
      }
    ]
  },
  /*
  * 上面的为主页的一级导航，下面的不在主页显示(在meta里面添加hide:true即可)
  * */
 // 商户管理特约商户-微信支付详情
 {
   path: '/app/merchant/specialAgreement-details/:id/:brandId',
   component: () => import('@/pages/merchant/specialAgreement/details/index'),
   name: 'details',
   meta: {
     title: '特约商户',
     link: '/app/merchant/specialAgreement/details',
     hide: true
    }
  },
  // 商户管理特约商户-微信支付认证
  {
    path: '/app/merchant/specialAgreement-certification/:id/:brandId',
    component: () => import('@/pages/merchant/specialAgreement/details/index'),
    name: 'certification',
    meta: {
      title: '特约商户',
      link: '/app/merchant/specialAgreement/certification',
      hide: true
    }
  },
  // 支付宝支付 - 认证
  {
    path: '/app/ali-pay-auth/:id/:brandId',
    component: () => import('@/pages/merchant/specialAgreement/details/alipayDetail'),
    meta: {
      title: '支付宝认证',
      link: '/app/ali-pay-auth',
      hide: true
    }
  },

  // - 官网 问答
  {
    path: '/app/official/problem/addProblem',
    name: '/app/official/problem/addProblem',
    component: () => import('@/pages/official/components/addProblem'),
    meta: {
      title: '添加问题',
      link: '/app/official/problem/addProblem',
      hide: true
    }
  },
  // - 官网 详情&编辑
  {
    path: '/app/official/problem/edit-problem/:id/:classId',
    name: '/app/official/problem/edit-problem',
    component: () => import('@/pages/official/components/addProblem'),
    meta: {
      title: '添加问题',
      link: '/app/official/problem/edit-problem',
      hide: true
    }
  },
]

export default authRoutes
