/*
* 本地存储的封装
* */

export default {
    get(key){
        let string=window.localStorage.getItem(key);//取到value值，是字符串
        return JSON.parse(string);//返回一个转过的对象值
    },
    set(key,value){
        window.localStorage.setItem(key,JSON.stringify(value))
    },
    clear(){
        window.localStorage.clear();
    },
    remove(key){
        window.localStorage.removeItem(key)
    }
}