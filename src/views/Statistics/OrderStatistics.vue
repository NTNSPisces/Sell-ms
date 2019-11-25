<template>
    <div class="order-stati">
        <!--查询时间-->
        <div class="queryTime">
            <span class="demonstration" style="margin-right: 10px;">时间范围</span>
            <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" style="margin-left: 20px;" @click="searchBydate">查询</el-button>
        </div>
        <!--echarts图-->
        <div class="orderEcharts">
            <div id="myChart" style="width: 100%;height:100%;"></div>
        </div>
    </div>
</template>
<script>
    import {requestEchartsData} from "../../api/order"
    import moment from "moment"

    /*
    * 动态获取报表数据渲染
    * 1.创建报表
    * 2.装备配置数据（数据从后台获取，然后渲染）
    * 3.发送请求获取数据
    * 4.处理拿回来的数据
    * 5.画图
    * */

    export default {
        data(){
            return{
                date:""
            }
        },
        mounted(){
            this.getechartsData();
        },
        methods:{
            //画图
            drawLine(X,Y){//传入参数--X轴和Y轴的值
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: [
                        {
                            name:'日期',
                            type: 'category',
                            data: X,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '销售额',
                            min: 0,
                            interval: 500,
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        }
                    ],
                    series: [
                        {
                            type:'bar',
                            data:Y
                        }
                    ]
                };
                myChart.setOption(option);
            },
            //发送请求获取动态参数
            async getechartsData(){
                let {data}=await requestEchartsData({date:JSON.stringify(this.date)});
                //处理时间格式(遍历)
                data.forEach(v=>{v.orderTime=moment(v.orderTime).format("YY/MM/DD")})
                //处理重复日期 先定义一个空时间对象，然后看数组内有无当前时间，无就添加进去,有就把销售额叠加计算
                let newobj={};
                data.forEach(v=>{
                    if(!newobj[v.orderTime]){//如果新对象中没有当前项时间值
                        newobj[v.orderTime]=v.orderAmount;//当前时间为属性，当前金额为值
                    }else {
                        newobj[v.orderTime]+=v.orderAmount;//如果当前时间存在，那么值就相加
                    }
                });
                //定义两个轴为空数组变量
                const X=[];
                const Y=[];
                //循环newobj然后把值分为添加进两个数组中
                for (let i in newobj){
                    X.push(i);
                    Y.push(newobj[i])
                }
                //调用画图函数，传入处理后的数据
                this.drawLine(X,Y);
            },
            //根据日期查询时间
            searchBydate(){
                this.getechartsData()
            }
        }
    }
</script>

<style lang="less" scoped>
    .order-stati{
        height: 100%;
        display: flex;
        flex-direction: column;
        .queryTime{
            flex: 0 0 100px;
            display: flex;
            align-items: center;
        }
        .orderEcharts{
            flex: 1;
            background-color: #fff;
            padding-top: 30px;
        }
    }
</style>