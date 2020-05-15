<template>
    <div class="l-body">
        <div class="l-left">
            <div class='selects'>
                <el-select v-model="value2" placeholder="请选择">
                    <el-option
                        v-for="item in selectData"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </div>
            <div class='echarts' :id="id"></div>
        </div>
        <div class="l-right">
          <div class="item">
            <!-- 数据都是假的 -->
            <img src="/static/images/console/icon_laodong.png">
            <div>
              <p>{{labourData.laborPerformance}}</p>
              <span>劳动业绩</span>
            </div>
          </div>
          <div class="item">
            <img src="/static/images/console/icon_zhiding.png">
            <div>
              <p>{{labourData.cardConsume}}</p>
              <span>卡金消耗</span>
            </div>
          </div>
          <div class="item">
            <img src="/static/images/console/icon_chongka.png">
            <div>
              <p>{{labourData.serviceCount}}</p>
              <span>服务单数</span>
            </div>
          </div>
          <div class="item">
            <img src="/static/images/console/icon_daodian.png">
            <div>
              <p>{{labourData.customerPerPay}}</p>
              <span>客单价</span>
            </div>
          </div>
          <div class="item">
            <img src="/static/images/console/icon_xinzeng.png">
            <div>
              <p>{{labourData.onlinePaymentCount}}</p>
              <span>线上支付单数</span>
            </div>
          </div>
          <div class="item">
            <img src="/static/images/console/icon_kajin.png">
            <div>
              <p>{{labourData.onlinePaymentTotalIncome}}</p>
              <span>线上支付金额</span>
            </div>
          </div>
        </div>
      </div>
</template>
<script>
import echarts from "echarts";
export default {
    props: {
        labourData: Object,
        id: String,
        selectData: Array
    },
    data() {
        return {
            value2: '',
        }
    },
    mounted() {
        console.log(echarts)
        this.drawPie()
    },
    methods: {
        drawPie() {
            var myChart = echarts.init(document.getElementById(this.id));
            console.log(myChart)
            // 指定图表的配置项和数据
            var option = {
                color: ['#41CAC0','#779FFF','#FA4769','#FFCD02','#FF8474','#67D3F5','#57E0B6'],
                series: [{
                    type: "pie",
                    center: ['50%','60%'],
                    data: [
                        {
                            value: 23120,
                            name: "剪发"
                        },
                        {
                            value: 19823.5,
                            name: "吹风造型"
                        },
                        {
                            value: 31960,
                            name: "烫发"
                        },
                        {
                            value: 90122,
                            name: "染发"
                        },
                        {
                            value: 10560,
                            name: "护理"
                        },
                        {
                            value: 31960,
                            name: "美容"
                        }
                    ],
                    radius: ['40%', '50%'],
                    labelLine: {
                        show: true,
                        length2: 60
                    }
                }],

            };
            myChart.setOption(option);
            // 自适应
            window.addEventListener('resize', function () {
                setTimeout(function(){
                myChart.resize()
                },300)
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.l-body {
    margin-right: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .l-left {
        width: 49%;
        height: 370px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
        margin-right: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 4px;
        .selects{
            position: absolute;
            right: 30px;
            top: 20px;
            z-index: 1;
        }
        .echarts{
            width: 100%;
            height: 370px;
        }
    }
    .l-right {
        width: 50%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48%;
            height: 110px;
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
            margin-bottom: 20px;
            border-radius: 4px;
            img{
                width: 50px;
                height: 50px;
                margin-left: 29px;
                margin-right: 25px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.61, 0.25, 0.24, 0.85);
                &:hover {
                    transform: scale(1.25);
                }
            }
            div{
                flex: 1;
                p{
                    font-size: 28px;
                    font-weight:400;
                }
                span{
                    font-size: 16px;
                    color: #606266;
                }
            }
        }
    }
}
</style>
