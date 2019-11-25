<template>
    <div class="index">
        <div class="top">
                <el-row :gutter="20" >
                    <el-col :span="6" v-for="(item,index) in topData" :key="index">
                        <div class="grid-content bg-purple">
                        <div class="left-icon">
                            <i class="iconfont licon" :class="item.icon" :style="{color:item.color}"></i>
                        </div>
                        <div class="right-text">
                            <h2 class="rt-title">{{ item.title}}</h2>
                            <p class="moneyNum">{{ item.moneyNum }}</p>
                        </div>
                    </div>
                    </el-col>
                </el-row>
        </div>
        <div class="echar">
            <div id="myChart" style="width: 100%;height:100%;"></div>
        </div>
    </div>
</template>
<script>
    import {requestindexEchartsData} from "../api/order"

    export default {
        data(){
            return{
                topData:[
                    {title:"总订单",moneyNum:"102,400",icon:"icon-tuanduicankaoxian-",color:"#84AF9B"},
                    {title:"总销售额",moneyNum:"112,400",icon:"icon-qian",color:"#69A076"},
                    {title:"今日订单数",moneyNum:"192,400",icon:"icon-dingdan",color:"#FACDB0"},
                    {title:"今日销售额",moneyNum:"192,400",icon:"icon-qian4",color:"#FC9D99"}
                ]
            }
        },
        mounted(){
            this.getindexEchartsData();
        },
        methods:{
            //画图
            drawLine(date,data){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '数据统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总订单','总销售额']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:date
                    },
                    yAxis: {
                        type: 'value',
                        min: 0,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                    series: [
                        {
                            name:'总订单',
                            type:'line',
                            data:data.amount
                        },
                        {
                            name:'总销售额',
                            type:'line',
                            data:data.orderNum
                        }
                    ]
                });
            },
            //发送请求
            async getindexEchartsData(){
                let {data,date}=await  requestindexEchartsData();
                this.drawLine(date,data)
            }
        }
    }
</script>

<style lang="less" scoped>
.index{
    height: 100%;
    display: flex;
    flex-direction: column;
    .top{
        flex: 0 0 100px;
        .grid-content{
            background-color: #fff;
            height: 100px;
            display: flex;
            .left-icon{
                flex: 0 0 130px;
                text-align: center;
                line-height: 100px;
                .licon{
                    font-size: 70px;
                }
            }
            .right-text{
                flex:1;
                text-align: center;
                line-height: 30px;
                padding-top: 20px;
                .rt-title{
                    color:#D1D1D1;
                    font-weight: 400;
                    font-size: 20px;
                }
                .moneyNum{
                    font-weight: bold;
                    font-size: 20px;
                }
            }
        }
    }
    .echar{
        flex:1;
        margin-top: 50px;
        background-color: #fff;
    }
}
</style>