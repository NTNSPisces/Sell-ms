<template>
    <div class="order-mg">
        <!--表单区域-->
        <div class="orderTable-regional">
            <el-form :model="orderForm" :inline="true"  class="demo-form-inline">
                <el-form-item label="订单号">
                    <el-input v-model="orderForm.orderNo"  placeholder="订单号"></el-input>
                </el-form-item>

                <el-form-item label="收货人">
                    <el-input v-model="orderForm.consignee" placeholder="收货人"></el-input>
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="orderForm.phone" placeholder="手机号"></el-input>
                </el-form-item>

                <el-form-item label="订单状态">
                    <el-select v-model="orderForm.orderState" placeholder="订单状态">
                        <el-option label="已受理" value="已受理"></el-option>
                        <el-option label="已结束" value="已结束"></el-option>
                        <el-option label="配送中" value="配送中"></el-option>
                    </el-select>
                </el-form-item>

                <span class="demonstration" style="color:#606266;margin-right: 15px;">选择时间</span>
                <el-date-picker
                        style="margin-right: 20px;"
                        v-model="orderForm.date"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>

                <el-form-item>
                    <el-button type="primary" @click.native="search">查询</el-button>
                    <el-button type="primary" @click.native="clear">清除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--订单显示区域-->
        <div class="orderShow-regional">
            <el-table
                    :data="orderShowData"
                    style="width: 100%"
                    max-height="350px">
                <el-table-column
                        fixed
                        prop="orderNo"
                        label="订单号"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="orderTime"
                        label="下单时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="consignee"
                        label="收货人"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="deliverAddress"
                        label="配送地址"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="deliveryTime"
                        label="送达时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="用户备注"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="orderAmount"
                        label="订单金额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="orderState"
                        label="订单状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button
                                @click="lookdetail(scope.row)"
                                type="text"
                                size="small">
                            详情编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页区域-->
        <div class="paging-regional">
            <el-pagination
                    @current-change="changePage"
                    :current-page="currentPage4"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    //引入请求函数
    import {orderlist} from "../../api/order"
    //引入时间处理函数
    import moment from "moment"

    export default {
        data(){
            return{
                orderForm:{
                    orderNo:"",
                    consignee:"",
                    phone:"",
                    orderState:"",
                    date:[]
                },
                orderShowData:[],
                currentPage4:1,
                total:0,
                pageSize:3
            }
        },
         created(){
            //进页面就调用
             this.getorderlist();
        },
        methods:{
            //获取订单列表
            async getorderlist(){
               let {total,data}=await orderlist({
                    currentPage:this.currentPage4,
                    pageSize:this.pageSize,
                    orderNo:this.orderForm.orderNo,
                    consignee:this.orderForm.consignee,
                    phone:this.orderForm.phone,
                    orderState:this.orderForm.orderState,
                    date:JSON.stringify(this.orderForm.date)//因为是一个数组要转成字符串才可以
                });
               //渲染之前把时间处理了
                data.forEach(v=>{
                        v.deliveryTime=moment(v.deliveryTime).format("YYYY-MM-DD hh:ss:mm"),
                        v.orderTime=moment(v.orderTime).format("YYYY-MM-DD hh:ss:mm")
                }
                );
               //渲染到页面上
                this.orderShowData=data;
                this.total=total;
            },
            //改变当前页
            changePage(page){
                this.currentPage4=page;
                this.getorderlist()
            },
            //查询条件
            search(){
                this.currentPage4=1;
               this.getorderlist()
            },
            //清除条件
            clear(){
                this.orderForm={
                    orderNo:"",
                    consignee:"",
                    phone:"",
                    orderState:"",
                    date:[]
                }
                this.getorderlist()
            },
            //查看详情
            lookdetail(row){
                //将数据保存在本地存储
                window.sessionStorage.setItem("orderDetail",JSON.stringify(row));//本地保存存值只接受字符串
                //然后跳转页面到详情编辑
                //跳转过后有一个问题就是，导航高亮不见了，因为都是在一个页面，没有子页面之类的，所以要把当前的$route.path计算属性计算一下
                //然后去左边导航配置页面修改
                this.$router.push("/home/lookorderdetail")
            }
        }
    }
</script>

<style lang="less" scoped>
.order-mg{
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .orderTable-regional{
        flex: 0 0 140px;
        padding: 15px;
    }
    .orderShow-regional{
        flex: 1;
        border-top: 1px solid #EBEEF5;
    }
    .paging-regional{
        flex: 0 0 60px;
        padding-top: 6px;
        margin-left: 5px;
    }
}
</style>