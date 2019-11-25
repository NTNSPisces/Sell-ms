import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入element-ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入reset.css
import './assets/css/reset.css';
//引入font图标
import './assets/fonts/iconfont.css';
//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
//引入本地存储函数
import  local from "./utils/local"

//创建一个bus中介。
const bus=new Vue();
Vue.prototype.$bus=bus;//挂载原型上


//注册组件
Vue.use(ElementUI);

Vue.config.productionTip = false;



//路由守卫--只能从登录页面进入。如果单独拆路径进去就不可以
router.beforeEach((to,from,next)=>{//to--要去哪个路径，from从哪个路径来，next--放行
    //在没有令牌之前，拆路径和正常登录都可以进去。那么就要利用后台给的令牌去判断用户的身份了。
    let token=local.get("token");
    if(token){//如果有令牌，则放行到首页
        next()
    }else {//然后又分两种情况，如果本身就是要去login登录界面，就不需要令牌；第二拆路径去了第她页面，让他显示login页面
        if(to.path==="/login"){
            next()
        }else {
            next("/login")
        }
    }

});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
