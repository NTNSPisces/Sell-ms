/*
* 企业级的接口封装--三层
* 1.工具层
* 2.接口层
* 3.vue层
* */
/*
* 当前在utils文件内的requestJS文件就是第一层，这层的主要作用是
* 封装一个通用axios：
* 1.请求（重点掌握！）
* 2.请求拦截器（固定格式）
* 3.相应拦截器（固定格式）
* */

//1.先安装并引入axios和qs模块第三方模块
import axios from "axios"
//这里引入的时候用qs接收了，以后使用就用qs。所以不要与Qs混淆了
import qs from "qs"
// 按需引入组件
import { Message } from 'element-ui'
//引入本地存储函数
import  local from "../utils/local"




// 2.设置默认请求的接口地址
axios.defaults.baseURL = 'http://127.0.0.1:5000';

// 3.请求拦截器
axios.interceptors.request.use(config => {
    // 在请求发送出去之前 带上一些东西 config是请求的配置对象， 如果直接返回 就等于什么都不带
    //现在要在发送出去之前给请求带上一个令牌，然后后台鉴别令牌合法性，合法则返回数据，不合法则返回错误信息
    //没有令牌就会报错显示错误信息
    //先在本地取到令牌
    let token=local.get("token");
    config.headers.Authorization = 'Bearer ' + token;
    return config;
}, error => {
    return Promise.reject(error); // 请求错误处理
});

// 4.响应拦截器
axios.interceptors.response.use(response => {
    // response就是后端响应回来的东西 如果你想做什么统一的处理 可以在这里写
    let { code, msg } = response.data;
    // 成功
    if (code === 0) {
        Message({
            type: 'success',
            message: msg
        })
    } else if (code === 1) {
        // 失败
        Message.error(msg)
    }
    return response;

}, error => {
    Message.error("网络请求发生错误，请稍后再试");
    return Promise.reject(error); // 响应错误处理
});


//5.暴露两种请求方法出去
export default {
    get(url,params={}){//params={}是ES6的默认参数写法
        // 只有promise对象后面接.then.catch。所以要返回一个promise对象
        return new Promise((resolve,reject)=>{
            //在这个里面发送axios请求
            axios.get(url,{params})
                .then(res=>{//res请求成功后拿到的后台响应数据
                    resolve(res.data);//将数据结果交给resolve处理。他会把res丢给外面的.then
                })
                .catch(err=>{//请求失败的错误信息
                    reject(err);
                })
        })
    },
    post(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.post(url,qs.stringify(params))
                .then(res=>{//res请求成功后拿到的后台响应数据
                    resolve(res.data);//将数据结果交给resolve处理。他会把res丢给外面的.then
                })
                .catch(err=>{//请求失败的错误信息
                    reject(err);
                })
        })
    }
}

//请求就封装成功了，接着去api层封装
/*
* 加入前端的请求格式：
* qs.get("url",{Params:{xx:xx}}).then(),catch()
*
* */