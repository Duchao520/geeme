/**
 * 本文件用来存放默认的数据，比如一些默认头像
 */
export const avatar = {
    URL: require('@/assets/img/img_default_someone.png'),
    manURL: require('@/assets/img/img_default_boy.png'),
    womanURL: require('@/assets/img/img_default_girl.png')
}
export const logoDef = {
    URL: require('@/assets/img/client_default.png')
}
export const loading = {
        URL: require('../../../static/images/loading.gif')
    }
    // 上传过后的图片URL前缀
export const imgUrl = {
        URL: `${IMAGE_URL}/`
    }
    // 默认图片defaultImg
export const defaultImg = {
    // 品牌logo的默认图片
    brandLogo: require('../../../static/images/default/brand.png'),
    // 无性别头像默认图片
    someone: require('../../../static/images/default/someone.png'),
    // 男头像默认图片
    boy: require('../../../static/images/default/boy.png'),
    // 女头像默认图片
    girl: require('../../../static/images/default/girl.png'),
    // 没有门店列表
    noshoplist: require('../../../static/images/default/bg_store.png'),
    // 没有品牌列表
    nobrandlist: require('../../../static/images/default/bg_brand.png'),
    // 没有品牌列表
    nopersonlist: require('../../../static/images/default/bg_staff.png'),
    // 没有服务项目列表
    noservicelist: require('../../../static/images/default/bg_goods.png'),
}

// 匹配页面的子路由
// 个人中心页面
export const ROUTER_CENTER_MENU = [{
            title: '资产中心',
            icon: 'info_assets',
            list: [
                {
                    url: '/center/brands',
                    title: '我的品牌'
                },
                {
                    url: '/center/shops',
                    title: '我的门店'
                },
                {
                    url: '/center/novice-guide',
                    title: '新手引导'
                },
                {
                    url: '/center/buySoftware',
                    title: '软件订购'
                },
            ]
        },
        // {
        //     title: '商家社区',
        //     icon: 'info_store',
        //     list: [
        //         {
        //             url: '#2',
        //             title: '社区首页'
        //         },
        //         {
        //             url: '#3',
        //             title: '我的提问'
        //         },
        //         {
        //             url: '#4',
        //             title: '我的关注'
        //         },
        //         {
        //             url: '#5',
        //             title: '及美公众号'
        //         }
        //     ]
        // },
        // {
        //     title: '消息中心',
        //     icon: 'info_message',
        //     list: [
        //         // {
        //         //     url: '#6',
        //         //     title: '内部通知'
        //         // },
        //         {
        //             url: '/center/systemInfo',
        //             title: '系统消息'
        //         },
        //         {
        //             url: '/center/customerService',
        //             title: '客服顾问'
        //         }
        //     ]
        // },
        {
            title: '消息中心',
            icon: 'info_message',
            list: [
                // {
                //     url: '#6',
                //     title: '内部通知'
                // },
                // {
                //     url: '/center/systemInfo',
                //     title: '系统消息'
                // },
                {
                    url: '/center/customerService',
                    title: '客服顾问'
                }
            ]
        },
        {
            title: '个人设置',
            icon: 'info_set',
            list: [{
                    url: '/center/person',
                    title: '个人资料'
                },
                {
                    url: '/center/account',
                    title: '账户安全'
                },
                {
                    url: '/center/password',
                    title: '修改密码'
                },
                {
                    url: '#',
                    title: '退出登录'
                }
            ]
        }
    ]
    // 周几英文对应的中文
export const WEEKTOCHINA = {
        MONDAY: '周一',
        TUESDAY: '周二',
        WEDNESDAY: '周三',
        THURSDAY: '周四',
        FRIDAY: '周五',
        SATURDAY: '周六',
        SUNDAY: '周日'
    }
    // 日期列表
export const WEEKDAY = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    // 服务状态
export const SERVER_STATUS = {
    '待服务': 'lan',
    '已服务': 'lu',
    '未分配': 'huang',
    '已超时': 'hei',
    '已占用': 'hui',
    '已取消': 'hui',
    '待付款': 'hong',
    '已支付': 'lu',
}