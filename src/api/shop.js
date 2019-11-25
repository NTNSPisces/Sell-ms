//1.引入request模块
import rqs from "../utils/request"

//获取订单列表
export const getshopinfo = params=>rqs.get("/shop/shopinfo",params);

//保存订单列表
export const editshopinfo = params=>rqs.post("/shop/shopedit",params);