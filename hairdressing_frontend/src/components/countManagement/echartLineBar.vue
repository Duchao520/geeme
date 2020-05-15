<template>
    <div class='l-body'>
        <div class='l-left'>
            <div class='title'>
                <p>最近30天走势图</p>
                <el-select v-model="value2" class='selects' placeholder="请选择">
                    <el-option
                        v-for="item in selectData"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </div>
            <div id='line' class='echarts'></div>
        </div>
        <div class='l-right'>
            <div class='title'>
                <p>最近30天走势图</p>
                <el-select v-model="value2" class='selects' placeholder="请选择">
                    <el-option
                        v-for="item in selectData"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </div>
            <div class='echarts' id='bar'></div>
        </div>
    </div>
</template>
<script>
import echarts from "echarts";
export default {
    data() {
        return {
            value2:''
        }
    },
    props: {
        selectData: Array
    },
    mounted() {
        this.drawLine();
        this.drawBar();
    },
    methods: {
        drawLine() {
            var myChart = echarts.init(document.getElementById('line'));
            var option = {
                series: {
                    type: 'line',
                    data: [1,2,3,4,5,6,7,8],
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: {
                    normal: {
                        color: "#4ADAAB"
                    }
                    },
                    smooth: true,
                    lineStyle: {
                    normal: {
                        color: "#4ADAAB",
                        width: 4,
                        shadowColor: "rgba(74,218,171,1)",
                        shadowBlur: 100,
                        shadowOffsetY: 30
                    }
                    }
                },
                xAxis: {
                    type: 'value',
                    axisLine: { // 坐标轴
                        show: false
                    },
                    axisTick: { // 坐标轴刻度
                        show: false
                    }
                    //data: [2,4,6,8,10,12,16,18,20]
                },
                yAxis: {
                    type: 'value',
                    data: '{value}',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                }
            }
            myChart.setOption(option);
            // 自适应
            window.addEventListener('resize', function () {
                setTimeout(function(){
                myChart.resize()
                },300)
            })
        },
        drawBar() {
            var myChart = echarts.init(document.getElementById('bar'));
            var option = {
                series: {
                    type: 'bar',
                    data: [1,2,3,4,5,6,7,8],
                    symbol: "circle",
                    barWidth: 26,
                    itemStyle: {
                        normal: {
                            color: "#ECF1F8"
                        },
                        emphasis: {
                            color: '#57E0B6'
                        }
                    },
                    label: {
                        emphasis: {
                            color: '#57E0B6',
                            show: true,
                            position: 'top',
                        }
                    }
                },
                xAxis: {
                    show: true,
                    type: 'value',
                    axisLine: { // 坐标轴
                        show: false
                    },
                    axisTick: { // 坐标轴刻度
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                    //data: [2,4,6,8,10,12,16,18,20]
                },
                yAxis: {
                    show: false,
                    type: 'value',
                    data: '{value}',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                }
            }
            myChart.setOption(option);
            // 自适应
            window.addEventListener('resize', function () {
                setTimeout(function(){
                myChart.resize()
                },300)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.l-body {
    margin-right: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 370px;
    .l-left {
        width: 49%;
        height: 370px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 4px;
    }
    .l-right {
        width: 50%;
        height: 370px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 4px;
    }
    .title{
        width: 100%;
        height: 80px;
        line-height: 80px;
        position: relative;
        padding-left: 20px;
        p{
            color: #666;
            font-size: 16px;
        }
    }
    .selects{
        position: absolute;
        right: 30px;
        top: 0;
    }
    .echarts{
        width: 100%;
        height: 290px;
    }
}
</style>
