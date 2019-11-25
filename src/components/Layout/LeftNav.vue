<template>
    <div class="left-nav">
        <div class="businessName">
            <img  class="Logo" :src="LogoUrl">
            <span>顶呱呱外卖后台</span>
        </div>
        <!--route:是element中封装的开开启路由模式，index就相当于roter-link to了-->
        <!--:default-active="$route.path"取到当前路径，然后激活-->
        <el-menu
                router
                background-color="#304156"
                text-color="#fff"
                :default-active="routePath"
                unique-opened
                class="el-menu-vertical-demo ">
            <!--整个导航是动态的，可能从后台拿数据新添，所以要改成遍历格式-->
            <!--导航分为两个，一个有子集一个没有子集，但是两个都存在，v-for放在其中一个上都不合适，需要用一个无用标签包裹起整体遍历-->
            <!--先定义一个遍历需要的数据-->
            <template v-for="(item,index) in navList" >
                <!--1级-->
                <!--这里有一个判断。是判断如果当前循环的内容没有children这个字段就走v-if，否则走v-else。如果不做判断，就会循环两段代码-->
                <el-menu-item v-if="!item.children" :index="item.path" :key="index">
                    <!--这里有一个公共类分离出来，动态变化的class设成动态绑定数据-->
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
               <!--2级-->
                <el-submenu v-else :index="item.path" :key="index">
                    <template slot="title">
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{ item.title }}</span>
                    </template>
                    <el-menu-item v-for="(item,index) in item.children" :key="index" :index="item.path">{{ item.title }}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
    import local from "../../utils/local";

    export default {
        data(){
            return{
                navList:[],
                LogoUrl:"http://localhost:8080/imgs/Logo.jpg"
            }
        },
        computed:{
            //计算激活路径,不是地址栏路径，不会修改地址栏路径
            routePath(){
                //判断，不管是订单管理还是查看详情，只要路径包含order，就让订单管理高亮
                if(this.$route.path==="/home/lookorderdetail"){// /home/ordermg  or  /home/lookorderdetail 都包含了order
                    return "/home/ordermg" //上面的routePath就是/home/ordermg这个路径被激活 为啥子是这个路径是因为导航上就是这个路径才有效激活
                }else if(this.$route.path==="/home/goodsedit"){
                    return "/home/goodslist"
                }
                //是其他页面的话，照常返回当前路径
                return this.$route.path

            }
        },
        created(){//一进页面就渲染
            //获取身份
            const role=local.get("role");
            const list=[//后台首页
                {
                    meta:{
                        Permissions:["super","general"]
                    },
                    path:"/home",icon:"icon-shouye",title:"后台首页"},
                //订单管理
                {
                    meta:{
                        Permissions:["super","general"]
                    },
                    path:"/home/ordermg",icon:"icon-74wodedingdan",title:"订单管理"},
                //商品管理
                {
                    meta:{
                        Permissions:["super","general"]
                    },
                    path:"/home/goodsmg",icon:"icon-shangpin-tianchong",title:"商品管理",
                    children:[
                        {path:"/home/goodslist",title:"商品列表"},
                        {path:"/home/goodsadd",title:"添加商品"}
                    ]},
                //店铺管理
                {
                    meta:{
                        Permissions:["super"]
                    },
                    path:"/home/shopmg",icon:"icon-ai204",title:"店铺管理"},
                //账号管理
                {
                    meta:{
                        Permissions:["super"]
                    },
                    path:"/home/accountmg",icon:"icon-zhanghao",title:"账号管理",
                    children:[
                        {path:"/home/accountlist",title:"账号列表"},
                        {path:"/home/accountadd",title:"添加账号"},
                        {path:"/home/editpwd",title:"修改密码"}
                    ]},
                //销售统计
                {
                    meta:{
                        Permissions:["super"]
                    },
                    path:"/home/sellsstat",icon:"icon-tongji",title:"销售统计",
                    children:[
                        {path:"/home/goodsstatistics",title:"商品统计"},
                        {path:"/home/orderstatistics",title:"订单统计"}
                    ]}]
                //对这个数组进行过滤,返回符合权限要求的导航数组
                this.navList=list.filter(v=>v.meta.Permissions.includes(role))
        },
    }
</script>
<style lang="less" >
    .left-nav{
        flex: 0 0 200px;
        background-color: #304156;
        .businessName{
            line-height: 70px;
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            color:#fff;
            .Logo{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin:0 5px;
            }
        }
        .el-menu{
            border: none;
            .el-menu-item{
                .iconfont{
                    margin-right: 10px;
                }
            }
            .el-submenu{
                .el-submenu__title{
                    .iconfont{
                        margin-right: 10px;
                    }
                }
                .el-menu-item{
                    background-color:  #202F3F!important;
                }
            }
        }
    }
</style>