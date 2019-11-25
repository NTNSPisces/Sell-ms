//1.引入request模块
import rqs from "../utils/request"


//获取订单列表
export const orderlist = params=>rqs.get("/order/orderlist",params);

//查看详情里面的确认修改
export const orderlistedit = params=>rqs.post("/order/orderedit",params);

//请求订单报表数据
export const requestEchartsData = params=>rqs.get("/order/ordertotal",params);

//请求首页报表数据
export const requestindexEchartsData = params=>rqs.get("/order/indexcharts",params);