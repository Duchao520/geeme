import store from '../store'
import qs from 'qs'
const mixin = {
    methods: {
        deplay(args) {
            setTimeout(() => {
                if (args.isPath) {
                    if (args.argsUrl) {
                        this.$router.push(args.argsUrl)
                    } else {
                        this.$router.go(-1)
                    }
                }
                args.fn && this[args.fn]()
                this.$data[args.loading] = false
            }, args.time || 200)
        },
        checkHasBtnPermission(pathOrFlag, type = 'flag') {
            // return true // 防止数据没重置时测试环境无权限, 上线请记得注释!!!
            let refer = []
            if (type === 'flag') {
                refer = store.state.authRouter.btnAuths
            } else if (type === 'path') {
                refer = store.state.authRouter.flatAuths
            } else {
                console.error('警告! 错误的参数!!!')
            }
            return refer.includes(pathOrFlag)
        },
        // 页面跳转新标签
        toPagesInNewTags(path, query) {
            let protocol = window.location.protocol
            let host = window.location.host
            let str = qs.stringify(query)
            window.open(`${protocol}//${host}/#${path}?${str}`)
        },
        // 表格单元格合并
        setSpanData(data, arr, name) {
            if (data && data.length) {
                let pos = 0
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        arr.push(1);
                        pos = 0
                    } else {
                        if (data[i][name] === data[i - 1][name]) {
                            arr[pos] += 1;
                            arr.push(0);
                        } else {
                            arr.push(1);
                            pos = i;
                        }
                    }
                }
            }
        },
    }
}
export { mixin }
