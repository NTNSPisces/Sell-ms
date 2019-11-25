import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    {
      //默认进入登陆界面
        path:"/",
        redirect:"/login"
    },
    {
        path:"/login",
        component:()=>import("../views/Login.vue")
    },
    {
        path:"/home",
        component:()=>import("../views/Home.vue"),//@/是指根目录--src开始
        children:[
            //首页
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home",title:"后台首页"}
                    ]
                },
                path:"",
                component:()=>import("../views/Index.vue")
            },
            //订单管理
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/ordermg",title:"订单管理"}
                    ]
                },
                path:"/home/ordermg",
                component:()=>import("../views/OrderMG/OrderMG.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/ordermg",title:"订单管理"},
                        {path:"/home/ordermg",title:"详情编辑"}
                    ]
                },
                path:"/home/lookorderdetail",
                component:()=>import("../views/OrderMG/lookOrderDetail.vue")
            },
            //商品管理
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/goodslist",title:"商品列表"}
                    ]
                },
                path:"/home/goodslist",
                component:()=>import("../views/GoodsMG/GoodsList.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/goodsadd",title:"商品添加"}
                    ]
                },
                path:"/home/goodsadd",
                component:()=>import("../views/GoodsMG/GoodsAdd.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/goodslist",title:"商品列表"},
                        {path:"/home/goodslist",title:"编辑商品"}
                    ]
                },
                path:"/home/goodsedit",
                component:()=>import("../views/GoodsMG/GoodsEdit.vue")
            },
            //店铺管理
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/shopmg",title:"店铺管理"}
                    ]
                },
                path:"/home/shopmg",
                component:()=>import("../views/ShopMG.vue")
            },
            //账户管理
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/accountlist",title:"账户列表"}
                    ]
                },
                path:"/home/accountlist",
                component:()=>import("../views/AccountMG/AccountList.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/accountadd",title:"添加账号"}
                    ]
                },
                path:"/home/accountadd",
                component:()=>import("../views/AccountMG/AccountAdd.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/editpwd",title:"修改密码"}
                    ]
                },
                path:"/home/editpwd",
                component:()=>import("../views/AccountMG/EditPwd.vue")
            },
            //销售统计
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/goodsstatistics",title:"商品统计"}
                    ]
                },
                path:"/home/goodsstatistics",
                component:()=>import("../views/Statistics/GoodsStatistics.vue")
            },
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/orderstatistics",title:"订单统计"}
                    ]
                },
                path:"/home/orderstatistics",
                component:()=>import("../views/Statistics/OrderStatistics.vue")
            },
            //个人中心
            {
                meta:{//里面是一个数组，要和我们自定义的数组格式一样
                    crumbs:[
                        {path:"/home",title:"首页"},
                        {path:"/home/personcenter",title:"个人中心"}
                    ]
                },
                path:"/home/personcenter",
                component:()=>import("../views/personCenter.vue")
            }
        ]
    },
];

const router = new VueRouter({
  routes
})

export default router
