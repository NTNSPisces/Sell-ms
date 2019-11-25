<template>
    <el-header class="r-c-header">
        <!--用栅格系统分为左右布局-->
        <el-row :gutter="20">
            <!--左边面包屑导航-->
            <el-col :span="19" class="rch-left-nav">
                <!--面包屑循环出来-->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(item,index) in crumbs" :key="index" :to="{path:item.path}">{{ item.title }}</el-breadcrumb-item>
                    <!--循环格式：[{path:"/",taitle:"商品管理"}，
                                   {path:"/xx",taitle:"商品列表"}，
                                   {path:"/xx",taitle:"添加商品"}]-->
                    <!--<el-breadcrumb-item>商品列表</el-breadcrumb-item>-->
                    <!--<el-breadcrumb-item>添加商品</el-breadcrumb-item>-->
                </el-breadcrumb>
            </el-col>
            <!--右边个人中心-->
            <el-col :span="5" class="rch-right-center">
                <div class="text-welcome">
                    欢迎你，{{ accName }}
                </div>
                <div class="avatar">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <img v-if="imgsUrl" :src="severApi+imgsUrl"/>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="personalCenter" @click.native="topersoncenter">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout" >退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </el-header>
</template>

<script>
    //引入本地函数
    import {accountinfo} from "../../api/account"

    export default {
        data() {
            return {
                severApi:"http://127.0.0.1:5000/upload/account/",
                //登录用户名
                accName:"",
                imgsUrl:"",
                //定义空面包屑数组
                crumbs:[]
            }
        },
        methods:{
            handleCommand(command){//下拉菜单本身就有的一个事件
                //判断，如果是点击退出，那么清除本地存储且跳到login页面
                if(command==="logout"){
                    window.localStorage.clear();
                    this.$router.push("/login");
                    //然后给一个退出的消息提示
                    this.$message({
                        type:"success",
                        message:"成功退出管理后台！"
                    })

                }
            },
            //跳转到个人中心
            topersoncenter(){
                this.$router.push("/home/personcenter")
            },
            //获取个人信息
            async getaccountmsg(){
                let {accountInfo}=await accountinfo();
                let{account,imgUrl}=accountInfo;
                this.accName=account;
                this.imgsUrl=imgUrl
            },
            //计算路径的变化
            watchRouterPath(){
                /*$route里面有一个属性叫做meta(是一个对象)，它可以携带参数，利用它做面包屑。
                * 原理就是每一个路由上面，都把当前级加上她上面的导航拼上去。
                * */
                //获取meta里面的数组对象赋值给定义的crumbs数组
               this.crumbs=this.$route.meta.crumbs
                //循环数组
            }
        },
        created(){
            this.getaccountmsg();
            //监听到自定义事件，同时更新头像
            this.$bus.$on("updataavatar",()=>{
                this.getaccountmsg()
            })
            //在进入页面的时候再次调用计算路径的函数
            this.watchRouterPath()

        },
        watch:{//用于观察一个对象数据变化的瞬间，可以做些事。和computed不一样的是，计算属性是计算一些列逻辑得出一个最终的值
            "$route.path"(){//通过观察每一个路径的变化
                this.watchRouterPath()
            }
        }
    }
</script>

<style lang="less" scoped>
    .r-c-header {
        flex: 0 0 50px;
        background-color: #fff;
        .el-row {
            height: 100%;
            .el-breadcrumb {
                height: 100%;
                line-height: 50px;
            }
            .rch-right-center {
                height: 100%;
                display: flex;
                .text-welcome {
                    flex: 0 0 130px;
                    line-height: 50px;
                }
                .avatar {
                    flex: 1;
                    img{
                        width: 40px;
                        height:40px;
                        margin-top: 5px;
                        margin-left: 10px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
</style>