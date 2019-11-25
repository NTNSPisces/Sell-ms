import rqs from "../utils/request"

//添加商品
export const goodsAdd = params=>rqs.post("/goods/goodsadd",params);
//获取商品列表
export const getgoodslist = params=>rqs.get("/goods/goodslist",params);
//单条商品删除
export const goodsdel = params=>rqs.get("/goods/goodsdel",params);
//单条商品保存
export const goodsedit = params=>rqs.post("/goods/goodsedit",params);
