<template>
    <div class="look-order-detail">
        <div style="padding-top: 30px;">
            <!--根据flag的值来控制两个显示的显藏效果-->
            <span>订单号:
                <span v-if="!flag">{{ orderDetailList.orderNo}}</span>
                <input v-else v-model="orderDetailList.orderNo" type="text"/>
                    </span>
            <el-divider></el-divider>

            <span>下单时间:
                <span v-if="!flag" class="demonstration">{{ orderDetailList.orderTime}}</span>
                <el-date-picker
                        v-else
                        v-model="orderDetailList.orderTime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
                </span>
            <el-divider></el-divider>

            <span>手机号:
                <span v-if="!flag">{{ orderDetailList.phone }}</span>
                <input v-else v-model="orderDetailList.phone" type="text"/>
            </span>
            <el-divider></el-divider>

            <span>收货人:
                <span v-if="!flag">{{ orderDetailList.consignee }}</span>
                <input v-else v-model="orderDetailList.consignee" type="text"/>
            </span>
            <el-divider></el-divider>

            <span>配送地址:
                <span v-if="!flag">{{ orderDetailList.deliverAddress }}</span>
                <input v-else v-model="orderDetailList.deliverAddress" type="text"/>
            </span>
            <el-divider></el-divider>

            <span>送达时间:
                <span v-if="!flag" class="demonstration">{{ orderDetailList.deliveryTime }}</span>
                    <el-date-picker
                            v-else
                            v-model="orderDetailList.deliveryTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </span>
            <el-divider></el-divider>

            <span>用户备注:
                <span v-if="!flag">{{ orderDetailList.remarks }}</span>
                <input v-else v-model="orderDetailList.remarks" type="text"/>
            </span>
            <el-divider></el-divider>

            <span>订单金额:
                <span v-if="!flag">{{ orderDetailList.orderAmount }}</span>
                <input v-else v-model="orderDetailList.orderAmount" type="text"/>
            </span>
            <el-divider></el-divider>

            <span>订单状态:
                <span v-if="!flag">{{orderDetailList.orderState}}</span>
                <el-select v-else v-model="orderDetailList.orderState" placeholder="订单状态">
                        <el-option label="已受理" value="已受理"></el-option>
                        <el-option label="已结束" value="已结束"></el-option>
                        <el-option label="配送中" value="配送中"></el-option>
                </el-select>
            </span>
            <el-divider></el-divider>
            <div>
                <el-button style="margin-left: 100px;margin-bottom: 20px" :type="flag? 'success':'primary' "
                           @click="edit">{{ btntext }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    /*
    * 这个页面有两个大的需求
    * 1.点击编辑来回切换编辑和保存文字
    * 2.整个页面的两个数据要双向绑定
    * */

    //引入时间处理函数
    import moment from "moment"
    //引入请求函数
    import {orderlistedit} from "../../api/order"

    export default {
        data() {
            return {
                orderDetailList: {},
                flag: false,
            }
        },
        created() {
            this.getorderList()
        },
        methods: {//从本地获取详情信息
            getorderList() {
                let res = JSON.parse(window.sessionStorage.getItem("orderDetail"));
                console.log(res)
                this.orderDetailList = res;
            },
            async edit() {
                this.flag = !this.flag;
                if (!this.flag){//在这里处理选择后的时间函数格式
                    this.orderDetailList.orderTime=moment(this.orderDetailList.orderTime).format('YYYY-MM-DD hh:mm:ss')
                    this.orderDetailList.deliveryTime=moment(this.orderDetailList.deliveryTime).format('YYYY-MM-DD hh:mm:ss')
                }
                if(this.btntext==="编辑"){
                    //保存的时候发送请求
                    let {code}=await orderlistedit(this.orderDetailList);
                    if(code===0){
                        //跳转页面
                        this.$router.push("/home/ordermg")
                    }
                }
            }
        },
        computed: {//通过计算属性计算按钮文本
            btntext() {
                return this.flag ? "保存" : "编辑"
            }
        }
    }

</script>

<style lang="less" scoped>
    .look-order-detail {
        background-color: #fff;
        span {
            color: #666;
            margin-left: 20px;
        }
        input {
            height: 30px;
            border:1px solid #ccc;

        }
    }
</style>