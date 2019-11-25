/*
* 在api层里面就是放每一个独立模块的请求接口
* 这一个JS页面放的是账户相关的api
* */
//1.引入request模块
import rqs from "../utils/request"



/*定义一个函数，传入参数是前端调用时要传递的数据对象
* rqs.post()====new Promise((resolve,reject)=>{
            axios.get(url,qs.stringify(params))
                .then(res=>{//res请求成功后拿到的后台响应数据
                    resolve(res);//将数据结果交给resolve处理。他会把res丢给外面的.then
                })
                .catch(err=>{//请求失败的错误信息
                    reject(err);
                })
        })
*
* 所以accountAdd=return 一个Promise对象
* */
//添加账户
export const accountAdd = params=>rqs.post("/account/accountadd",params);
//请求用户列表
export const accountlist = params=>rqs.get("/account/accountlist",params);
//删除单条数据
export const accountdel = params=>rqs.get("/account/accountdel",params);
//批量删除数据
export const batchdelaccount = params=>rqs.get("/account/accountbatchdel",params);
//保存编辑后数据
export const saveAccountData = params=>rqs.post("/account/accountedit",params);
//登录账户
export const accountLogin = params=>rqs.post("/account/checklogin",params);
//验证原密码一致性
export const oldPwd = params=>rqs.get("/account/checkoldpwd",params);
//修改密码
export const editPwd = params=>rqs.post("/account/passwordedit",params);
//获取个人信息
export const accountinfo = params=>rqs.get("/account/accountinfo",params);
//点击上传按钮上传头像
export const  avataredit= params=>rqs.get("/account/avataredit",params);


//接下来就去对应的vue层调用这个请求方法
