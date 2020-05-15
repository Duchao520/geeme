<template>
    <div class="wrap"> <!--外框，固定宽度-->
        <div id="box">  <!--内部滚动框-->
            <div id="marquee"><span v-for="item in lists"><img :src="item.ico" alt="">{{item.nick}}    <i class="fc-F7094D">砍价成功</i></span></div>  <!--//展示的文字-->
        </div>
        <div id="node"><span v-for="item in lists"><img :src="item.ico" alt="">{{item.nick}}    <i class="fc-F7094D">砍价成功</i></span></div> <!--//为了获取text实际宽度-->
    </div>
</template>
<script>
    export default {
        name: 'notice',
        props: ['lists'], // 父组件传入数据， 数组形式 [ "连雨不知春去"，"一晴方觉夏深"]
        data () {
            return {
                text: '' // 数组文字转化后的字符串
            }
        },
        methods: {
            move () {
// 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
                let width = document.getElementById('node').clientWidth
                let box = document.getElementById('box')
                let boxWidth = document.getElementsByClassName('wrap')[0].clientWidth
                let distance = boxWidth // 位移距离
//设置位移
                box.style.transform = 'translateX(' + boxWidth + 'px)'
                setInterval(function () {
                    distance = distance - 1
                    // 如果位移超过文字宽度，则回到起点
                    if (-distance >= width) {
                        distance = boxWidth
                    }
                    box.style.transform = 'translateX(' + distance + 'px)'
                }, 20)
            }
        },
// 把父组件传入的arr转化成字符串
        mounted: function () {

        },
        updated(){
            this.move()
        }
    }
</script>
<style scoped>
    /*限制外框宽度，隐藏多余的部分*/
    .wrap {
        overflow: hidden;
    }
    /*移动框宽度设置*/
    #box {
        width: 80000%;
    }
    /*// 文字一行显示*/
    #box div {
        float: left;
    }
    /*// 设置前后间隔*/
    #marquee {
        margin: 0 .16rem 0 0;
        font-size: .24rem;
        display: flex;
    }
    #marquee span{
        padding-right: .4rem;
        display: flex;

    }
    #marquee span img{
        width: .38rem;
        height: .38rem;
        background: #1a9bb1;
        display: block;
        margin-right: .2rem;
        border-radius: 50%;
    }
    /*// 获取宽度的节点，隐藏掉*/
    #node {
        position: absolute;
        z-index: -999;
        top: -999999px;
        display: flex;
        white-space: nowrap;
        font-size: .24rem;
    }
    #node span{
        padding-right: .4rem;
        display: flex;
        font-size: .24rem;
    }
    #node span img{
        width: .38rem;
        height: .38rem;
        background: #1a9bb1;
        display: block;
        border-radius: 50%;
        margin-right: .2rem;
    }
</style>
